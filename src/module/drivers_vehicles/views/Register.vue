<template>
    <div class="w-full">
        <div class="info mb-2">
            <base-info-sign :typeInfo="typeInfo" :showNotification="showSign" :timeShow="20" >
                {{ infoMessage }}  
            </base-info-sign>
        </div>
        <form novalidate @submit.prevent="saveEventButton()">
            <div class="w-12/12">
                <div class="w-30 mb-2">
                    <UIButton textButton="Guardar" />
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
                    />
                </div>

                <div class="w-30">
                    <UIButton textButton="Guardar" />
                </div>
            </div>
        </form>
    </div>
</template>
<script setup>
    import {ref, onMounted} from 'vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UISelect from '@/components/UIComponents/UISelect.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDrivers_vehicles } from '../composables/useDrivers_vehicles';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    import { driversService } from '@/module/drivers/services/driversService';
    import { vehiclesService } from '@/module/vehicles/services/vehiclesService';
    import { rates_operativesService } from '@/module/rates_operatives/services/rates_operativesService';

    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useDrivers_vehicles()

    const rates_list = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await rates_operativesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            rates_list.value = res.result.data.filter(r => r.raop_status === 1 || r.raop_status === '1')
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

    const overlay = useOverlay()
    const { showOverlay, hiddenOverlay } = overlay

    const saveEventButton = async()=>{
        showSign.value = false
        infoMessage.value = ''
        disableButton.value = true
        if (disableButton.value){
            showOverlay()
            const validate = validateInput()
            if (!validate.error){
                typeInfo.value = "alert"
                await save(validate.data);
                if (!error.value){
                    reset();
                    typeInfo.value = "success"
                }
                showSign.value = true
                infoMessage.value = message
            }
            hiddenOverlay()
            disableButton.value = false
        }
    }

    const validateInput = ()=>{
        const response = { error: true, data: {} };
        response.error = inputs.value.some(input => input.checkValidateError())
        const data = {}
        if (!response.error) {
            inputs.value.some((input)=>{ data[input.attribute.name] = input.valueInput() })
            const userData = JSON.parse(localStorage.getItem('userLogin'))
            if (userData) {
                if (!data['sub']) data['sub'] = userData.sub_id
                data['com'] = userData.com_id
            }
            response.data = data;
        }
        return response
    }

    const reset = ()=>{ inputs.value.some((input)=>{ input.reset() }) }
</script>
