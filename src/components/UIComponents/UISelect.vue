<template>
    <div class="w-full mb-2">
        <div v-show="showLabel" class="px-1 text-gray-500">
            <strong>{{ fieldName }}</strong>
        </div>
        <div class="relative w-full">
            <select
                :id="id"
                ref="selectEl"
                v-model="input_value"
                :class="[
                    'font-semibold',
                    'w-full',
                    'rounded px-3 py-2 border-2',
                    borderColor,
                    focusBorderColor,
                    'focus:outline-none',
                    'text-sm',
                    'bg-white',
                    'appearance-none',
                    'cursor-pointer'
                ]"
            >
                <option value="" disabled>{{ placeholderText }}</option>
                <option 
                    v-for="item in items" 
                    :key="getKey(item)" 
                    :value="getValue(item)"
                >
                    {{ getLabel(item) }}
                </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </div>
            <div class="px-1 min-h-6">
                <span :class="['text-xs', 'italic', 'leading-1', colorText]">{{ input_sign }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, computed, watch } from 'vue'

    const props = defineProps({
        modelValue: { type: [String, Number], default: '' },
        items: { type: Array, default: () => [] },
        placeholder: { type: String, default: 'Seleccionar...' },
        'name': { type: String, default: '' },
        'field': { type: String, default: '' },
        'required': { type: String, default: 'false' },
        'rule': { type: String, default: 'all' },
        itemLabel: { type: [String, Function], default: 'label' },
        itemValue: { type: String, default: 'value' },
        itemKey: { type: [String, Function], default: 'value' },
    })

    const emit = defineEmits(['update:modelValue', 'change'])

    const id = `select-${Math.random().toString(36).slice(2, 9)}`
    const selectEl = ref(null)
    const input_value = ref(props.modelValue ?? '')
    const required = (props.required == "true")
    const showLabel = ref(props.field && String(props.field).trim() != '')

    const isError = reactive({
        'typeError': null,
        'message': '',
        'error': false
    })

    const input_sign = computed(() => {
        return isError.error ? isError.message : ''
    })

    const placeholderText = computed(() => {
        let placeholder = String(props.placeholder).trim()
        return (required && placeholder != '' && String(props.field).trim() == "") ? placeholder + " *" : placeholder
    })

    const fieldName = computed(() => {
        let field = String(props.field).trim()
        return (required && field != '') ? field + " *" : field
    })

    const borderColor = computed(() => {
        return (isError.error) ? 'border-red-300' : 'border-blue-300'
    })

    const focusBorderColor = computed(() => {
        return (isError.error) ? 'focus:border-red-500' : 'focus:border-blue-500'
    })

    const colorText = computed(() => {
        return (isError.error) ? 'text-red-500' : 'text-gray-500'
    })

    function getLabel(item) {
        if (typeof props.itemLabel === 'function') return props.itemLabel(item)
        return typeof item === 'object' ? item[props.itemLabel] : String(item)
    }

    function getValue(item) {
        return typeof item === 'object' ? item[props.itemValue] : item
    }

    function getKey(item) {
        if (typeof props.itemKey === 'function') return props.itemKey(item)
        if (typeof item === 'object') {
            return item[props.itemKey] !== undefined ? item[props.itemKey] : item[props.itemValue]
        }
        return item
    }

    watch(input_value, (newVal) => {
        emit('update:modelValue', newVal)
        emit('change', newVal)
    })

    watch(() => props.modelValue, (v) => {
        input_value.value = v ?? ''
    })

    const validateRules = () => {
        let input_to_check = String(input_value.value).trim()
        input_to_check = (input_to_check == 'undefined') ? '' : input_to_check
        isError.typeError = ''
        isError.error = false
        isError.message = ''
        if (required && input_to_check == '') {
            isError.typeError = 'empty'
            isError.error = true
            isError.message = 'Este campo es obligatorio'
        }
    }

    const valueInput = () => {
        return input_value.value
    }

    const focus = () => {
        if (selectEl.value) {
            selectEl.value.focus()
            if (typeof selectEl.value.scrollIntoView === 'function') {
                selectEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }

    const checkValidateError = (autoFocus = true) => {
        validateRules()
        if (isError.error && autoFocus) {
            focus()
        }
        return isError.error
    }

    const reset = () => {
        input_value.value = ""
        return input_value.value
    }

    const attribute = {
        'name': props.name,
        'placeholder': props.placeholder,
        'id': props.id,
        'field': props.field,
        'rule': props.rule,
    }

    defineExpose({ checkValidateError, valueInput, attribute, reset, focus })
</script>

<style scoped>
</style>
