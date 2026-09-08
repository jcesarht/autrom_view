<template>
    <div ref="containerEl" class="w-full mb-2">
        <div v-if="showLabel" class="px-1 text-gray-500 mb-1">
            <strong>{{ fieldName }}</strong>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
            <button
                v-for="star in totalStars"
                :key="star"
                type="button"
                :disabled="disabled"
                @click="selectStar(star)"
                :class="[
                    'w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400',
                    star <= rating ? activeColorClass : inactiveColorClass,
                    star <= rating ? 'text-white' : 'text-gray-400',
                    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'
                ]"
                :title="`Calificación: ${star} de ${totalStars}`"
            >
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            </button>
        </div>
        <div class="px-1 min-h-6 mt-1">
            <span :class="['text-xs italic leading-1', colorText]">
                {{ input_sign }}
            </span>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, reactive, watch } from 'vue';

    const props = defineProps({
        name: {
            type: String,
            required: true,
            default: 'dri_qualify'
        },
        id: {
            type: String,
            default: ''
        },
        field: {
            type: String,
            default: ''
        },
        maxStars: {
            type: [Number, String],
            default: 2
        },
        value: {
            type: [Number, String],
            default: 0
        },
        modelValue: {
            type: [Number, String],
            default: undefined
        },
        required: {
            type: String,
            default: 'false'
        },
        activeColor: {
            type: String,
            default: 'bg-blue-500'
        },
        inactiveColor: {
            type: String,
            default: 'bg-gray-200'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        ruleText: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['update:modelValue', 'change']);

    const parseNum = (v, defaultVal) => {
        if (v === null || v === undefined || v === '') return 0;
        const n = parseInt(v, 10);
        return isNaN(n) ? defaultVal : n;
    };

    const totalStars = computed(() => {
        const num = parseNum(props.maxStars, 2);
        if (num < 1) return 2;
        if (num > 10) return 10;
        return num;
    });

    const initialVal = props.modelValue !== undefined ? props.modelValue : props.value;
    const rating = ref(parseNum(initialVal, 0));

    watch(() => props.modelValue, (newVal) => {
        if (newVal !== undefined) {
            rating.value = parseNum(newVal, 0);
        }
    });

    watch(() => props.value, (newVal) => {
        if (props.modelValue === undefined && newVal !== undefined) {
            rating.value = parseNum(newVal, 0);
        }
    });

    const isRequired = computed(() => props.required === 'true');
    const showLabel = computed(() => props.field && String(props.field).trim() !== '');

    const activeColorClass = computed(() => props.activeColor || 'bg-blue-500');
    const inactiveColorClass = computed(() => props.inactiveColor || 'bg-gray-200');

    const isError = reactive({
        typeError: null,
        message: '',
        error: false
    });

    const colorText = computed(() => isError.error ? 'text-red-500' : 'text-gray-500');
    const input_sign = computed(() => isError.error ? isError.message : props.ruleText);

    const fieldName = computed(() => {
        const field = String(props.field).trim();
        return isRequired.value && field !== '' ? field + ' *' : field;
    });

    const validateRules = () => {
        isError.typeError = '';
        isError.error = false;
        isError.message = '';
        if (isRequired.value && rating.value <= 0) {
            isError.typeError = 'required';
            isError.error = true;
            isError.message = 'Este campo es obligatorio';
        }
    };

    const selectStar = (star) => {
        if (props.disabled) return;
        if (rating.value === star) {
            rating.value = 0;
        } else {
            rating.value = star;
        }
        const emitVal = rating.value > 0 ? rating.value : null;
        emit('update:modelValue', emitVal);
        emit('change', emitVal);
        validateRules();
    };

    const valueInput = () => (rating.value > 0 ? rating.value : null);

    const containerEl = ref(null);

    const focus = () => {
        if (containerEl.value) {
            const btn = containerEl.value.querySelector('button');
            if (btn) btn.focus();
            if (typeof containerEl.value.scrollIntoView === 'function') {
                containerEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const checkValidateError = (autoFocus = true) => {
        validateRules();
        if (isError.error && autoFocus) {
            focus();
        }
        return isError.error;
    };

    const reset = () => {
        rating.value = parseNum(initialVal, 0);
        isError.error = false;
        isError.message = '';
    };

    const attribute = {
        name: props.name,
        id: props.id || props.name + '_quality_id',
        field: props.field,
        value: rating.value,
        required: props.required,
        maxStars: totalStars.value
    };

    defineExpose({ checkValidateError, valueInput, attribute, reset, focus });
</script>
