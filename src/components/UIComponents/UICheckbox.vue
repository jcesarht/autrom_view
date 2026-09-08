<template>
    <div class="w-full mb-2">
        <div class="flex items-center gap-3 px-1 py-2">
            <!-- Checkbox visual -->
            <button
                ref="buttonEl"
                type="button"
                role="checkbox"
                :aria-checked="isChecked"
                :id="inputID"
                :disabled="input.disabled"
                :class="[
                    'relative inline-flex items-center justify-center',
                    'w-10 h-6 rounded-full',
                    'transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1',
                    isChecked ? activeTrackColor : 'bg-gray-200',
                    isChecked ? 'focus:ring-blue-400' : 'focus:ring-gray-300',
                    input.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                ]"
                @click="toggle"
            >
                <span
                    :class="[
                        'absolute left-0.5 top-0.5',
                        'w-5 h-5 rounded-full bg-white shadow',
                        'transition-transform duration-200 ease-in-out',
                        isChecked ? 'translate-x-4' : 'translate-x-0',
                    ]"
                />
            </button>

            <!-- Label -->
            <span v-if="showLabel" :class="['text-sm font-semibold', colorText]">
                {{ fieldName }}
            </span>
        </div>

        <!-- Hint / error message -->
        <div class="px-1 min-h-6">
            <span :class="['text-xs italic leading-1', colorText]">
                {{ input_sign }}
            </span>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, reactive, watch } from 'vue';

    const input = defineProps({
        'name': {
            type: String,
            required: true,
            default: 'checkbox'
        },
        'id': {
            type: String,
            default: ''
        },
        'field': {
            type: String,
            default: ''
        },
        /**
         * Value sent to the backend when the checkbox is ON.
         * Supports: Number (1), Boolean (true), String ('1', 'yes', 'active', …)
         * Default: 1
         */
        'checkedValue': {
            type: [Number, Boolean, String],
            default: 1
        },
        /**
         * Value sent to the backend when the checkbox is OFF.
         * Supports: Number (0), Boolean (false), String ('0', 'no', 'inactive', …)
         * Default: 0
         */
        'uncheckedValue': {
            type: [Number, Boolean, String],
            default: 0
        },
        /**
         * Initial checked state. Accepts the same types as checkedValue/uncheckedValue.
         * The component will treat it as checked if it loosely equals checkedValue.
         */
        'value': {
            type: [Number, Boolean, String],
            default: 0
        },
        'required': {
            type: String,
            default: 'false'
        },
        'ruleText': {
            type: String,
            default: ''
        },
        /**
         * Active track color class (Tailwind). Default: blue toggle.
         */
        'activeColor': {
            type: String,
            default: 'bg-blue-500'
        },
        'disabled': {
            type: Boolean,
            default: false
        },
    });

    // ─── Internal state ────────────────────────────────────────────────────────

    const required   = input.required === 'true';

    /**
     * Normalize any value to a comparable primitive so that
     * 1, "1", true all match when checkedValue is 1.
     */
    const normalize = (v) => {
        if (v === undefined || v === null) return '0';
        const str = String(v).toLowerCase().trim();
        if (str === 'true' || str === '1' || str === 'si' || str === 'sí' || str === 'yes') return '1';
        if (str === 'false' || str === '0' || str === 'no') return '0';
        return str;
    };

    const isChecked  = ref(normalize(input.value) === normalize(input.checkedValue));
    const inputID    = ref(input.id !== '' ? input.id : input.name + '_checkbox_id');
    const showLabel  = ref(input.field && String(input.field).trim() !== '');

    watch(() => input.value, (newVal) => {
        isChecked.value = normalize(newVal) === normalize(input.checkedValue);
    });

    const isError = reactive({
        typeError: null,
        message:   '',
        error:     false
    });

    // ─── Computed ──────────────────────────────────────────────────────────────

    const activeTrackColor = computed(() => input.activeColor);

    const colorText = computed(() =>
        isError.error ? 'text-red-500' : 'text-gray-500'
    );

    const input_sign = computed(() =>
        isError.error ? isError.message : input.ruleText
    );

    const fieldName = computed(() => {
        const field = String(input.field).trim();
        return required && field !== '' ? field + ' *' : field;
    });

    // ─── Validation ────────────────────────────────────────────────────────────

    const validateRules = () => {
        isError.typeError = '';
        isError.error     = false;
        isError.message   = '';
        // A required checkbox must be in the checked state
        if (required && !isChecked.value) {
            isError.typeError = 'required';
            isError.error     = true;
            isError.message   = 'This field is required';
        }
    };

    // ─── Actions ───────────────────────────────────────────────────────────────

    const toggle = () => {
        if (input.disabled) return;
        isChecked.value = !isChecked.value;
        validateRules();
    };

    // ─── Public API (mirrors UIInputText interface) ────────────────────────────

    /**
     * Returns the backend value according to the current checked state.
     * Type matches whatever was passed as checkedValue / uncheckedValue.
     */
    const valueInput = () => {
        return isChecked.value ? input.checkedValue : input.uncheckedValue;
    };

    const buttonEl = ref(null);

    const focus = () => {
        if (buttonEl.value) {
            buttonEl.value.focus();
            if (typeof buttonEl.value.scrollIntoView === 'function') {
                buttonEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    /**
     * Runs all validations and returns true if there is an error.
     * Used by parent forms in the standard inputs-ref pattern.
     */
    const checkValidateError = (autoFocus = true) => {
        validateRules();
        if (isError.error && autoFocus) {
            focus();
        }
        return isError.error;
    };

    /**
     * Resets the checkbox to its initial value (prop `value`).
     */
    const reset = () => {
        isChecked.value = normalize(input.value) === normalize(input.checkedValue);
        isError.error   = false;
        isError.message = '';
    };

    /** Mirrors the `attribute` object exposed by UIInputText for form iteration. */
    const attribute = {
        name:          input.name,
        id:            input.id,
        field:         input.field,
        value:         input.value,
        required:      input.required,
        checkedValue:  input.checkedValue,
        uncheckedValue: input.uncheckedValue,
        ruleText:      input.ruleText,
    };

    defineExpose({ checkValidateError, valueInput, attribute, reset, focus });
</script>

<style scoped>
</style>
