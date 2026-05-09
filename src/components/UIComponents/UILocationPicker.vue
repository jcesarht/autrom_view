<template>
    <div class="w-full">
        <!-- Country -->
        <UIAutocomplete
            ref="countryRef"
            :items="countryItems"
            :field="props.countryLabel"
            :placeholder="props.countryLabel"
            :required="props.required"
            :getLabel="(item) => item.name"
            :itemKey="(item, idx) => item.alpha2 ?? idx"
            @select="onCountrySelect"
            v-model="countryModel"
        />
        <!-- State -->
        <UIAutocomplete
            ref="stateRef"
            :items="stateItems"
            :field="props.stateLabel"
            :placeholder="props.stateLabel"
            :required="props.required"
            :getLabel="(item) => item.name"
            :itemKey="(item, idx) => item.name + idx"
            @select="onStateSelect"
            v-model="stateModel"
        />
        <!-- City -->
        <UIAutocomplete
            ref="cityRef"
            :items="cityItems"
            :field="props.cityLabel"
            :placeholder="props.cityLabel"
            :required="props.required"
            :getLabel="(item) => item.name"
            :itemKey="(item, idx) => item.name + idx"
            @select="onCitySelect"
            v-model="cityModel"
        />
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue'
    import worldData from '@/assets/data/world-data.json'

    // ----------------------
    // Props
    // ----------------------
    const props = defineProps({
        countryField: { type: String, default: 'country' },
        stateField: { type: String, default: 'state' },
        cityField: { type: String, default: 'city' },
        countryLabel: { type: String, default: 'Country' },
        stateLabel: { type: String, default: 'State' },
        cityLabel: { type: String, default: 'City' },
        countryValueType: { type: String, default: 'name' }, // 'name' | 'alpha2' | 'alpha3'
        required: { type: String, default: 'false' },
        dataSource: { type: [Object, String], default: null },
        modelValue: { type: Object, default: () => ({}) },
    })

    const emit = defineEmits(['update:modelValue'])

    // ----------------------
    // Refs for child UIAutocomplete instances
    // ----------------------
    const countryRef = ref(null)
    const stateRef = ref(null)
    const cityRef = ref(null)

    // ----------------------
    // Internal state
    // ----------------------
    const locationData = ref({ countries: [], states: [], cities: [] })
    const selectedCountry = ref(null)
    const selectedState = ref(null)
    const selectedCity = ref(null)
    const countryModel = ref('')
    const stateModel = ref('')
    const cityModel = ref('')

    // ----------------------
    // Computed filtered lists
    // ----------------------
    const countryItems = computed(() => locationData.value.countries ?? [])

    const stateItems = computed(() => {
        if (!selectedCountry.value) return []
        return (locationData.value.states ?? []).filter(
            s => s.country_alpha2 === selectedCountry.value.alpha2
        )
    })

    const cityItems = computed(() => {
        if (!selectedState.value || !selectedCountry.value) return []
        return (locationData.value.cities ?? []).filter(
            c => c.country_alpha2 === selectedCountry.value.alpha2
                && c.state === selectedState.value.name
        )
    })

    // ----------------------
    // Selection handlers
    // ----------------------
    function onCountrySelect(item) {
        selectedCountry.value = item
        // Reset dependent fields
        selectedState.value = null
        selectedCity.value = null
        stateModel.value = ''
        cityModel.value = ''
        emitValue()
    }

    function onStateSelect(item) {
        selectedState.value = item
        // Reset city
        selectedCity.value = null
        cityModel.value = ''
        emitValue()
    }

    function onCitySelect(item) {
        selectedCity.value = item
        emitValue()
    }

    // ----------------------
    // Get country value based on countryValueType
    // ----------------------
    function getCountryValue() {
        if (!selectedCountry.value) return ''
        switch (props.countryValueType) {
            case 'alpha2': return selectedCountry.value.alpha2 ?? ''
            case 'alpha3': return selectedCountry.value.alpha3 ?? ''
            case 'name':
            default: return selectedCountry.value.name ?? ''
        }
    }

    // ----------------------
    // Emit combined value
    // ----------------------
    function emitValue() {
        const val = {
            [props.countryField]: getCountryValue(),
            [props.stateField]: selectedState.value?.name ?? '',
            [props.cityField]: selectedCity.value?.name ?? '',
        }
        emit('update:modelValue', val)
    }

    // ----------------------
    // Load data source
    // ----------------------
    async function loadData() {
        if (props.dataSource && typeof props.dataSource === 'object') {
            if (props.dataSource.type === 'url') {
                try {
                    const res = await fetch(props.dataSource.src)
                    locationData.value = await res.json()
                } catch (e) {
                    console.error('UILocationPicker: Error fetching data from URL', e)
                    locationData.value = worldData
                }
            } else if (props.dataSource.type === 'json') {
                locationData.value = props.dataSource.data
            }
        } else {
            locationData.value = worldData
        }
    }

    // ----------------------
    // Pre-fill from modelValue (for update/edit scenarios)
    // ----------------------
    function prefillFromModelValue() {
        const mv = props.modelValue
        if (!mv) return

        const countryVal = mv[props.countryField] ?? mv.country ?? ''
        const stateVal = mv[props.stateField] ?? mv.state ?? ''
        const cityVal = mv[props.cityField] ?? mv.city ?? ''

        if (countryVal) {
            // Find country by name, alpha2, or alpha3 depending on countryValueType
            const found = locationData.value.countries.find(c => {
                if (props.countryValueType === 'alpha2') return c.alpha2 === countryVal
                if (props.countryValueType === 'alpha3') return c.alpha3 === countryVal
                return c.name === countryVal
            })
            if (found) {
                selectedCountry.value = found
                countryModel.value = found.name
            } else {
                countryModel.value = countryVal
            }
        }

        if (stateVal && selectedCountry.value) {
            const foundState = locationData.value.states.find(
                s => s.name === stateVal && s.country_alpha2 === selectedCountry.value.alpha2
            )
            if (foundState) {
                selectedState.value = foundState
                stateModel.value = foundState.name
            } else {
                stateModel.value = stateVal
            }
        }

        if (cityVal && selectedState.value && selectedCountry.value) {
            const foundCity = locationData.value.cities.find(
                c => c.name === cityVal
                    && c.country_alpha2 === selectedCountry.value.alpha2
                    && c.state === selectedState.value.name
            )
            if (foundCity) {
                selectedCity.value = foundCity
                cityModel.value = foundCity.name
            } else {
                cityModel.value = cityVal
            }
        }
    }

    // ----------------------
    // Lifecycle
    // ----------------------
    onMounted(async () => {
        await loadData()
        prefillFromModelValue()
    })

    // ----------------------
    // Exposed API (inputs pattern compatibility)
    // ----------------------
    const checkValidateError = () => {
        const refs = [countryRef.value, stateRef.value, cityRef.value]
        return refs.some(r => r && r.checkValidateError())
    }

    const valueInput = () => {
        return {
            [props.countryField]: getCountryValue(),
            [props.stateField]: selectedState.value?.name ?? (stateModel.value ?? ''),
            [props.cityField]: selectedCity.value?.name ?? (cityModel.value ?? ''),
        }
    }

    const attribute = {
        name: 'location_picker',
        isLocationPicker: true,
    }

    const reset = () => {
        selectedCountry.value = null
        selectedState.value = null
        selectedCity.value = null
        countryModel.value = ''
        stateModel.value = ''
        cityModel.value = ''
        if (countryRef.value) countryRef.value.reset()
        if (stateRef.value) stateRef.value.reset()
        if (cityRef.value) cityRef.value.reset()
    }

    defineExpose({ checkValidateError, valueInput, attribute, reset })
</script>

<style scoped>
/* Uses UIAutocomplete internally — no extra styles needed */
</style>
