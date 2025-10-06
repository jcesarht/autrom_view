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
        'field' : {
            type: String,
            default:''
        },
        'rule' : {
            type: String,
            default: "all",
        },
        'required' : {
              type: String,
              default: "false",
        },
        getLabel: { type: Function, default: (i) => (typeof i === 'object' && i !== null ? i.label ?? i.name ?? String(i) : String(i)) },
        itemKey: { type: Function, default: (i, idx) => (i && i.id) ?? idx },
        openOnFocus: { type: Boolean, default: true },
    })

const emit = defineEmits(['update:modelValue', 'select'])

const id = `autocomplete-${Math.random().toString(36).slice(2, 9)}`
const listId = `${id}-list`
const inputEl = ref(null)
const input_value = ref(props.modelValue ?? '')
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
        return props.getLabel(item)
    }

    function getKey(item, idx) {
        return props.itemKey(item, idx)
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
  selected.value = val
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

    const validateRules = () => {
        let exclude_character = '';
        let input_to_check = String(input_value.value).trim()
        input_to_check  = (input_to_check == 'undefined')? '' : input_to_check
        isError.typeError = ''
        isError.error = false
        isError.message = ''
        if (required && input_to_check == '' ) {
            isError.typeError = 'empty'
            isError.error = true
            isError.message = 'This field is required'
        }else if (rule == 'alphanumeric') {
            //this sentence only alphanumerics plus "_" characters are accepted
            exclude_character = input_to_check.match(/[^A-Z-a-z-0-9ñÑ\_]/)
            exclude_character = exclude_character == null? '' : exclude_character
            input_value.value = String(input_to_check.replace(/[^A-Z-a-z-0-9ñÑ\_]/,''))
            if (exclude_character != null && exclude_character.length > 0){
                isError.typeError = 'alphanumeric'
                isError.error = true
                isError.message = exclude_character + ' is not allowed'
            }
        }else if (rule == 'numeric'){
            exclude_character = input_to_check.match(/[^0-9]/)
            exclude_character = exclude_character == null? '' : exclude_character
            input_value.value = String(input_to_check.replace(/[^0-9]/,''))
            if (exclude_character.length > 0){
                isError.typeError = 'numeric'
                isError.error = true
                isError.message = exclude_character + ' is not numeric; therefore, it is not allowed'
            }
        }
    }

    //validate maximum and minimum char 
    const validateRulesAfterInput = ()=> {
         // validate minimun characters
         if (minChar > 0 && input_value.value.length < minChar){
            isError.typeError = 'minimun_chars'
            isError.error = true
            isError.message = 'Please enter at least '+ minChar +' characters'
        }
        
        // validate maximum characters
        if (maxChar > 0 && input_value.value.length > maxChar){
            isError.typeError = 'maximun_chars'
            isError.error = true
            isError.message = 'Please enter no more than '+ maxChar +' characters'
        }

        //validate email format
        if (rule == 'email') {
            const input_to_check = String(input_value.value).trim()
            // Define our regular expression.
            const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            if (!input_to_check.match(validEmail)){
                isError.typeError = 'email_format'
                isError.error = true
                isError.message = 'Please enter a valid email format'
            }
        }

    }

    const valueInput = ()=>{
        return selected.value.code?? '';
    }

     /**
    * validate if an error exist and return a boolean
    */
    const  checkValidateError = ()=>{
        validateRules()
        validateRulesAfterInput()
        return isError.error
    }

    // reset input
    const reset = ()=>{
        input_value.value = "";
        return input_value.value;
    }

    const attribute = {
        'name':props.name,
        'placeholder':props.placeholder,
        'id':props.id,
        //'value':props.value,
        'field':props.field,
        //'required':props.required,
        'rule':props.rule,
        //'ruleText':props.ruleText,
        'minChar':props.minChar,
        'maxChar':props.maxChar,
    }

    // expose the checkValidateError to parent component
    defineExpose({checkValidateError,valueInput, attribute, reset})
    
</script>

<style scoped>
/* small visual tweaks; uses Tailwind in template, keep CSS minimal */
</style>