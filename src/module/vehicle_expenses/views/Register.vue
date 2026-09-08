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
                        name="veh"
                        placeholder="Buscar placa..."
                        field="Placa"
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
                <div>
                     <UIAutocomplete 
                        name="pro"
                        placeholder="Buscar proveedor..."
                        field="Proveedores"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :fetchSuggestions="fetchProviders"
                        :getLabel="p => `${p.pro_name} - ${p.pro_dni}`"
                        itemValue="pro_id"
                        :itemKey="p => p.pro_id"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.pro_name }}</span>
                                <small class="text-gray-400">{{ item.pro_dni }}</small>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>
                <div>
                     <UIInputText 
                        name="vehexp_amount"
                        placeholder="0.00"
                        field="Valor"
                        :ref="element => inputs.push(element)"
                        required="true"
                        rule="numeric"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="vehexp_concept"
                        placeholder="Descripción del concepto"
                        field="Concepto"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputDate
                        name="vehexp_date"
                        placeholder="Fecha"
                        field="Fecha"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="vehexp_discount"
                        placeholder="0.00"
                        field="Descuento"
                        :ref="element => inputs.push(element)"
                        required="false"
                        rule="numeric"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="vehexp_comments"
                        placeholder="Comentarios adicionales"
                        field="Comentarios"
                        :ref="element => inputs.push(element)"
                        required="false"
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
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UISelect from '@/components/UIComponents/UISelect.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useVehicle_expenses } from '../composables/useVehicle_expenses';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    import { vehiclesService } from '@/module/vehicles/services/vehiclesService';
    import { rates_operativesService } from '@/module/rates_operatives/services/rates_operativesService';
    import { providesService } from '@/module/provides/services/providesService';
    
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useVehicle_expenses()
    
    const rates_list = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await rates_operativesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            rates_list.value = res.result.data.filter(r => r.raop_status === 1 || r.raop_status === '1')
        }
    })

    const fetchVehicles = async (q) => {
        const { token } = useUserLoginStore()
        const res = await vehiclesService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }

    const fetchProviders = async (q) => {
        const { token } = useUserLoginStore()
        const res = await providesService.query({ search: q }, { token })
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
