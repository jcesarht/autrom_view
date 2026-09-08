<script setup>
    import { ref, onMounted } from 'vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UISelect from '@/components/UIComponents/UISelect.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDrivers_vehicles } from '../composables/useDrivers_vehicles';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    import { driversService } from '@/module/drivers/services/driversService';
    import { vehiclesService } from '@/module/vehicles/services/vehiclesService';
    import { rates_operativesService } from '@/module/rates_operatives/services/rates_operativesService';

    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useDrivers_vehicles()
    const autocomplete_branches = ref([])
    
    const rates_list = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const resBranches = await subsidiariesService.query(undefined, { token })
        if (!resBranches.error && resBranches.result.data) {
            autocomplete_branches.value = resBranches.result.data
        }
        const resRates = await rates_operativesService.query(undefined, { token })
        if (!resRates.error && resRates.result.data) {
            rates_list.value = resRates.result.data.filter(r => r.raop_status === 1 || r.raop_status === '1')
        }
    })

    const fetchDrivers = async (q) => {
        const { token } = useUserLoginStore()
        const res = await driversService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }

    const fetchVehicles = async (q) => {
        const { token } = useUserLoginStore()
        const res = await vehiclesService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }
    //props
    const props = defineProps({
        id: {
            type: [String, Number],
            required: true
        },
        dataForUpdate: {
            type: [Object],
            default: () => null
        },
        inputs: {
            type: Array,
            default: () => []
        }
    });
    //overlay function
    const overlay = useOverlay()
    //composable functions
    const { showOverlay, hiddenOverlay } = overlay

    //event save function
    const updateEventButton = async()=>{
        showSign.value = false
        infoMessage.value = ''
        disableButton.value = true
        if (disableButton.value){
            showOverlay()
            const validate = validateInput()
            if (!validate.error){
                typeInfo.value = "alert"
                await update(props.id, validate.data);
                if (!error.value){
                    typeInfo.value = "success"
                    isUpdated.value = true
                }
                showSign.value = true
                infoMessage.value = message
            }
            hiddenOverlay()
            disableButton.value = false
        }
    }
    
    /**
     * validate all inputs
     */
    const validateInput = ()=>{
        const response = {
            error: true,
            data: {}
        };

        response.error = inputs.value.some(input => input.checkValidateError())
        const data = {}
        if (!response.error) {
            inputs.value.some((input)=>{
                data[input.attribute.name] = input.valueInput()
            })
            response.data = data;
        }
        
        return response
    }

    const showUpdateForm = ()=>{
        emit('showUpdateForm', isUpdated.value)
    }
    const emit = defineEmits(['showUpdateForm'])

</script>
<template>
    <div class="w-full">
        <div class="info mb-2">
            <base-info-sign :typeInfo="typeInfo" :showNotification="showSign" :timeShow="20" >
                {{ infoMessage }}  
            </base-info-sign>
        </div>
        <form novalidate @submit.prevent="updateEventButton()">
            <div class="w-12/12">
                <div class="w-30 mb-2">
                    <UIButton textButton="Atrás" @click="showUpdateForm()" />
                </div>
                
                <div>
                     <UIAutocomplete 
                        name="dri"
                        placeholder="Buscar conductor..."
                        field="Conductor"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :fetchSuggestions="fetchDrivers"
                        :getLabel="d => `${d.dri_firts_name} ${d.dri_last_name} - ${d.dri_dni}`"
                        itemValue="dri_id"
                        :itemKey="d => d.dri_id"
                        :modelValue="props.dataForUpdate.dri"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.dri_firts_name }} {{ item.dri_last_name }}</span>
                                <small class="text-gray-400">{{ item.dri_dni }}</small>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>
                <div>
                     <UIAutocomplete 
                        name="veh"
                        placeholder="Buscar placa..."
                        field="Vehículo"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :fetchSuggestions="fetchVehicles"
                        :getLabel="v => v.veh_license_plate"
                        itemValue="veh_id"
                        :itemKey="v => v.veh_id"
                        :modelValue="props.dataForUpdate.veh"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.veh_license_plate }}</span>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>
                <div>
                    <UISelect
                        name="raop"
                        placeholder="Seleccionar tarifa..."
                        field="Tarifa"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :items="rates_list"
                        itemLabel="raop_name"
                        itemValue="raop_id"
                        :value="props.dataForUpdate.raop"
                    />
                </div>

                <div class="w-30">
                    <UIButton textButton="Actualizar" />
                </div>
            </div>
        </form>
    </div>
</template>
