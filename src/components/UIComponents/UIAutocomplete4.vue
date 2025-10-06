<template>
  <div class="relative w-full" @keydown.escape.prevent="close()">
    <label v-if="label" :for="id" class="sr-only">{{ label }}</label>

    <div class="flex items-center gap-2">
      <input
        :id="id"
        ref="inputEl"
        v-model="input_value"
        :placeholder="placeholder"
        @input="onInput"
        @focus="open()"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="onEnter"
        @keydown.tab="onTab"
        :aria-activedescendant="activeDescendantId"
        :aria-expanded="isOpen.toString()"
        :aria-owns="listId"
        role="combobox"
        autocomplete="off"
        class="w-full border rounded p-2 focus:outline-none focus:ring"
      />
      <button v-if="clearable && input_value" @click="clear" type="button" class="px-2 py-1 text-sm">✕</button>
    </div>

    <ul
      v-if="isOpen && filtered.length"
      :id="listId"
      role="listbox"
      class="absolute z-20 mt-1 w-full max-h-60 overflow-auto border rounded bg-white shadow"
      @mousedown.prevent
    >
      <li
        v-for="(item, index) in filtered"
        :key="getKey(item, index)"
        :id="itemId(index)"
        role="option"
        :aria-selected="index === highlighted"
        @click="select(item)"
        @mousemove="setHighlight(index)"
        class="px-3 py-2 cursor-pointer hover:bg-gray-100"
        :class="{'bg-gray-100': index === highlighted}"
      >
        <slot name="item" :item="item">{{ display(item) }}</slot>
      </li>
    </ul>

    <p v-if="isOpen && !filtered.length && !loading" class="mt-1 text-sm text-gray-500">No hay resultados</p>
    <p v-if="loading" class="mt-1 text-sm text-gray-500">Cargando...</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// ----------------------
// Props / Emits
// ----------------------
const props = defineProps({
  modelValue: { type: [String, Number, Object], default: '' },
  items: { type: Array, default: () => [] },
  fetchSuggestions: { type: Function, default: null }, // async function(input_value) => items[]
  placeholder: { type: String, default: 'Buscar...' },
  minChars: { type: Number, default: 1 },
  debounceMs: { type: Number, default: 250 },
  clearable: { type: Boolean, default: true },
  label: { type: String, default: null },
  getLabel: { type: Function, default: (i) => (typeof i === 'object' && i !== null ? i.label ?? i.name ?? String(i) : String(i)) },
  itemKey: { type: Function, default: (i, idx) => (i && i.id) ?? idx },
  openOnFocus: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'select'])

// ----------------------
// Local state
// ----------------------
const id = `autocomplete-${Math.random().toString(36).slice(2, 9)}`
const listId = `${id}-list`
const inputEl = ref(null)
const input_value = ref(props.modelValue ?? '')
const isOpen = ref(false)
const highlighted = ref(-1)
const internalItems = ref([])
const loading = ref(false)
let fetchController = null

// ----------------------
// Utilities
// ----------------------
function debounce(fn, ms) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

function display(item) {
  return props.getLabel(item)
}

function getKey(item, idx) {
  return props.itemKey(item, idx)
}

function itemId(idx) {
  return `${id}-item-${idx}`
}

const activeDescendantId = computed(() => (highlighted.value >= 0 ? itemId(highlighted.value) : null))

// ----------------------
// Filtering + fetching
// ----------------------
const filtered = computed(() => {
  if (!input_value.value || input_value.value.length < props.minChars) return []
  // prefer internalItems (from fetch) when provided; otherwise filter props.items
  const source = internalItems.value.length ? internalItems.value : props.items
  const q = String(input_value.value).toLowerCase()
  return source.filter((it) => display(it).toLowerCase().includes(q))
})

const doSearch = debounce(async (q) => {
  if (!props.fetchSuggestions) return
  if (fetchController) {
    try { fetchController.abort() } catch (e) {}
  }
  // Optional AbortController support for fetch-like functions
  fetchController = new AbortController()
  loading.value = true
  try {
    const result = await props.fetchSuggestions(q, { signal: fetchController.signal })
    internalItems.value = Array.isArray(result) ? result : []
    highlighted.value = -1
  } catch (e) {
    if (e.name !== 'AbortError') console.error(e)
  } finally {
    loading.value = false
  }
}, props.debounceMs)

function onInput() {
  emit('update:modelValue', input_value.value)
  if (props.fetchSuggestions && input_value.value.length >= props.minChars) {
    doSearch(input_value.value)
    open()
  } else {
    // if no fetch fn, open list to show filtered local items
    if (!props.fetchSuggestions) open()
  }
}

// ----------------------
// Selection / navigation
// ----------------------
function open() {
  if (props.openOnFocus || input_value.value.length >= props.minChars) isOpen.value = true
}
function close() {
  isOpen.value = false
  highlighted.value = -1
}

function setHighlight(i) {
  highlighted.value = i
}

function highlightNext() {
  if (!filtered.value.length) return
  highlighted.value = Math.min(filtered.value.length - 1, highlighted.value + 1)
  scrollToHighlighted()
}
function highlightPrev() {
  if (!filtered.value.length) return
  highlighted.value = Math.max(0, highlighted.value - 1)
  scrollToHighlighted()
}

function scrollToHighlighted() {
  const idEl = itemId(highlighted.value)
  const el = document.getElementById(idEl)
  if (el) el.scrollIntoView({ block: 'nearest' })
}

function onEnter() {
  if (highlighted.value >= 0) select(filtered.value[highlighted.value])
  else if (filtered.value.length === 1) select(filtered.value[0])
}

function onTab() {
  // If tabbing and there's a highlighted item, select it
  if (highlighted.value >= 0) select(filtered.value[highlighted.value])
}

function select(item) {
  const val = item
  emit('update:modelValue', val)
  emit('select', val)
  input_value.value = typeof val === 'object' ? display(val) : String(val)
  close()
}

function clear() {
  input_value.value = ''
  internalItems.value = []
  emit('update:modelValue', '')
  open()
}

// ----------------------
// Sync with v-model / outside
// ----------------------
watch(() => props.modelValue, (v) => {
  // when parent updates modelValue externally, sync input text
  if (v === null || v === undefined) input_value.value = ''
  else input_value.value = typeof v === 'object' ? display(v) : String(v)
})

// Close on outside click
function onDocumentClick(e) {
  if (!inputEl.value) return
  if (!inputEl.value.contains(e.target) && !e.composedPath().some((n) => n?.id && n.id.startsWith(id))) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  if (fetchController) try { fetchController.abort() } catch (e) {}
})
</script>

<style scoped>
/* small visual tweaks; uses Tailwind in template, keep CSS minimal */
</style>