<template>
    <div class="w-full mb-2">
        <div v-show="showLabel"  class="px-1 text-gray-500" >
            <strong>{{ fieldName }}</strong>
        </div>
        <div class="relative w-full" @keydown.escape.prevent="close()">
            <div class="flex items-center gap-2">
                <input
                    :id="id"
                    ref="inputEl"
                    v-model="input_value"
                    :placeholder="placeholderText"
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
                    :class="[
                        'font-semibold',
                        'w-full',
                        'rounded px-3 py-2 border-2',
                        borderColor,
                        focusBorderColor,
                        'focus:outline-none',
                        'text-sm',
                        'bg-white'
                    ]
                    "
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

            <div class="px-1 min-h-6">
            <span :class="[
                'text-xs',
                'italic',
                'leading-1',
                colorText
                ]"
            >{{ input_sign }} </span>
        </div>
        </div>
    </div>
    
</template>

<script setup>
    import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'

    // ----------------------
    // Props / Emits
    // ----------------------
    const props = defineProps({
        modelValue: { type: [String, Number, Object], default: '' },
        items: { type: Array, default: () => [] },
        fetchSuggestions: { type: Function, default: null }, // async function(input_value) => items[]
        placeholder: { type: String, default: 'Buscar...' },
        debounceMs: { type: Number, default: 250 },
        clearable: { type: Boolean, default: true },
        minChars: { type: Number, default: 1 },
        'minChar' : {
                type: Number,
                default: -1,
            },
        'maxChar' : {
                type: Number,
                default: -1,
            },
        'name' : {
                type: String,
                default: '',
            },
        'field' : {
            type: String,
            default:''
        },
        'rule' : {
            type: String,
            default: "all",
        },
        ruleText: { type: String, default: '' },
        'required' : {
              type: String,
              default: "false",
        },
        itemLabel: { type: [String, Array, Function], default: null },
        getLabel: { type: Function, default: null },
        itemKey: { type: [Function, String], default: null },
        itemValue: { type: String, default: 'code' },
        openOnFocus: { type: Boolean, default: true },
    })

const emit = defineEmits(['update:modelValue', 'select'])

const id = `autocomplete-${Math.random().toString(36).slice(2, 9)}`
const listId = `${id}-list`
const inputEl = ref(null)
const input_value = ref('')
const rule = ref(props.rule ?? '')
const required = (props.required == "true") // assign true or false
const minChar = props.minChar
const maxChar = props.maxChar
const isOpen = ref(false)
const highlighted = ref(-1)
const internalItems = ref([])
const loading = ref(false)
const showLabel = ref( props.field && String(props.field).trim() != '' )
const selected = ref(null)
let fetchController = null

function debounce(fn, ms) {
    let t
        return (...args) => {
            clearTimeout(t)
            t = setTimeout(() => fn(...args), ms)
        }
    }

    function display(item) {
        if (item === null || item === undefined) return ''
        if (typeof item !== 'object') return String(item)

        if (props.itemLabel) {
            if (typeof props.itemLabel === 'function') {
                return props.itemLabel(item)
            }
            if (Array.isArray(props.itemLabel)) {
                return props.itemLabel
                    .map(key => item[key])
                    .filter(val => val !== null && val !== undefined && val !== '')
                    .join(' - ')
            }
            if (typeof props.itemLabel === 'string' && props.itemLabel.trim() !== '') {
                if (item[props.itemLabel] !== undefined) {
                    return String(item[props.itemLabel])
                }
            }
        }

        if (typeof props.getLabel === 'function') {
            return props.getLabel(item)
        }

        return item.label ?? item.name ?? item.title ?? String(item)
    }

    function getKey(item, idx) {
        if (typeof props.itemKey === 'function') return props.itemKey(item, idx)
        if (typeof props.itemKey === 'string' && item && item[props.itemKey] !== undefined) return item[props.itemKey]
        if (item && typeof item === 'object') {
            return item[props.itemValue] ?? item.id ?? item.code ?? idx
        }
        return idx
    }

    function itemId(idx) {
        return `${id}-item-${idx}`
    }

    const isError= reactive({
        'typeError': null,
        'message':'',
        'error': false
    })

    //computed message over the input
    const input_sign = computed(()=>{
        return isError.error? isError.message: props.ruleText ;
    })

    //computed placeholder
    const placeholderText = computed(()=>{
        let placeholder = String(props.placeholder).trim()
        return (
            required 
            && placeholder != '' 
            && String(props.field).trim() == "") ? placeholder + " *" : placeholder
    })
    
    //computed field name
    const fieldName = computed(()=>{
        let field = String(props.field).trim()
        return (required && field != '' )? field + " *" : field
    })
    
    const activeDescendantId = computed(() => (highlighted.value >= 0 ? itemId(highlighted.value) : null))
    // define computed border class
    const borderColor = computed(()=>{
        return (isError.error)? 'border-red-300' : 'border-blue-300'
    });

    const focusBorderColor = computed(()=>{
        return (isError.error )? 'focus:border-red-500' : 'focus:border-blue-500'
    })
    // computed color text
    const colorText = computed(()=>{
        return (isError.error)? 'text-red-500' : 'text-gray-500'
    })

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
      }, props.debounceMs
  )

function onInput() {
  if (selected.value && typeof selected.value === 'object') {
      if (input_value.value !== display(selected.value)) {
          selected.value = null
      }
  }
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
      selected.value = val
      input_value.value = typeof val === 'object' ? display(val) : String(val)
      emit('update:modelValue', val)
      emit('select', val)
      close()
    }
    
    function clear() {
      input_value.value = ''
      selected.value = null
      internalItems.value = []
      emit('update:modelValue', '')
      open()
    }

// ----------------------
// Sync with v-model / outside
// ----------------------
watch(() => props.modelValue, (v) => {
  if (v === null || v === undefined || v === '') {
      input_value.value = ''
      selected.value = null
  } else if (typeof v === 'object') {
      selected.value = v
      input_value.value = display(v)
  } else {
      const source = internalItems.value.length ? internalItems.value : props.items
      const found = source.find(item => {
          if (item && typeof item === 'object') {
              const val = item[props.itemValue] ?? item.id ?? item.code
              return String(val) === String(v)
          }
          return String(item) === String(v)
      })
      if (found) {
          selected.value = found
          input_value.value = display(found)
      } else {
          selected.value = v
          input_value.value = String(v)
      }
  }
}, { immediate: true })

watch(internalItems, (newItems) => {
  if (props.modelValue && typeof props.modelValue !== 'object' && newItems.length) {
      const found = newItems.find(item => {
          if (item && typeof item === 'object') {
              const val = item[props.itemValue] ?? item.id ?? item.code
              return String(val) === String(props.modelValue)
          }
          return String(item) === String(props.modelValue)
      })
      if (found) {
          selected.value = found
          input_value.value = display(found)
      }
  }
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

    const validateRules = () => {
        let exclude_character = '';
        let val = valueInput()
        let input_to_check = String(val !== null && val !== undefined ? val : '').trim()
        input_to_check  = (input_to_check == 'undefined')? '' : input_to_check
        isError.typeError = ''
        isError.error = false
        isError.message = ''
        if (required && (input_to_check == '' || String(input_value.value).trim() == '')) {
            isError.typeError = 'empty'
            isError.error = true
            isError.message = 'Este campo es obligatorio'
        }else if (rule == 'alphanumeric') {
            //this sentence only alphanumerics plus "_" characters are accepted
            exclude_character = input_to_check.match(/[^A-Z-a-z-0-9ñÑ\_]/)
            exclude_character = exclude_character == null? '' : exclude_character
            if (exclude_character != null && exclude_character.length > 0){
                isError.typeError = 'alphanumeric'
                isError.error = true
                isError.message = exclude_character + ' no está permitido'
            }
        }else if (rule == 'numeric'){
            let str = String(input_value.value || '')
            let cleaned = str.replace(/[^0-9.]/g, '')
            const firstDotIndex = cleaned.indexOf('.')
            if (firstDotIndex !== -1) {
                const integerPart = cleaned.slice(0, firstDotIndex + 1)
                const decimalPart = cleaned.slice(firstDotIndex + 1).replace(/\./g, '')
                cleaned = integerPart + decimalPart
            }
            input_value.value = cleaned
        }
    }

    //validate maximum and minimum char 
    const validateRulesAfterInput = ()=> {
         // validate minimun characters
         if (minChar > 0 && input_value.value.length < minChar){
            isError.typeError = 'minimun_chars'
            isError.error = true
            isError.message = 'Por favor ingrese al menos '+ minChar +' caracteres'
        }
        
        // validate maximum characters
        if (maxChar > 0 && input_value.value.length > maxChar){
            isError.typeError = 'maximun_chars'
            isError.error = true
            isError.message = 'Por favor ingrese no más de '+ maxChar +' caracteres'
        }

        //validate email format
        if (rule == 'email') {
            const input_to_check = String(input_value.value).trim()
            // Define our regular expression.
            const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            if (!input_to_check.match(validEmail)){
                isError.typeError = 'email_format'
                isError.error = true
                isError.message = 'Por favor ingrese un correo válido'
            }
        }

    }

    const valueInput = () => {
        if (selected.value !== null && selected.value !== undefined && selected.value !== '') {
            if (typeof selected.value === 'object') {
                return selected.value[props.itemValue] ?? selected.value.id ?? selected.value.code ?? selected.value;
            }
            return selected.value;
        }
        if (props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== '') {
            if (typeof props.modelValue === 'object') {
                return props.modelValue[props.itemValue] ?? props.modelValue.id ?? props.modelValue.code ?? props.modelValue;
            }
            return props.modelValue;
        }
        return '';
    }

    const focus = () => {
        if (inputEl.value) {
            inputEl.value.focus()
            if (typeof inputEl.value.scrollIntoView === 'function') {
                inputEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }

     /**
    * validate if an error exist and return a boolean
    */
    const checkValidateError = (autoFocus = true) => {
        validateRules()
        validateRulesAfterInput()
        if (isError.error && autoFocus) {
            focus()
        }
        return isError.error
    }

    // reset input
    const reset = ()=>{
        input_value.value = "";
        selected.value = null;
        return input_value.value;
    }

    const attribute = {
        'name':props.name,
        'placeholder':props.placeholder,
        'id':props.id,
        'field':props.field,
        'rule':props.rule,
        'minChar':props.minChar,
        'maxChar':props.maxChar,
        'itemValue':props.itemValue,
        'itemLabel':props.itemLabel,
    }

    // expose the checkValidateError to parent component
    defineExpose({checkValidateError, valueInput, attribute, reset, focus})
    
</script>

<style scoped>
/* small visual tweaks; uses Tailwind in template, keep CSS minimal */
</style>