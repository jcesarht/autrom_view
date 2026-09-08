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
                        @select="onDriverSelect"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.dri_firts_name }} {{ item.dri_last_name }}</span>
                                <small class="text-gray-400">{{ item.dri_dni }}</small>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>
                <div v-if="selectedDriverInfo" class="p-3 bg-gray-50 border rounded-lg mt-2 mb-4 space-y-1 text-sm text-gray-600">
                    <div><strong>Identificación:</strong> {{ selectedDriverInfo.dri_dni }}</div>
                    <div><strong>Teléfono:</strong> {{ selectedDriverInfo.dri_phone || 'N/A' }}</div>
                    <div><strong>Email:</strong> {{ selectedDriverInfo.dri_email || 'N/A' }}</div>
                </div>
                <div>
                     <UIInputText 
                        name="dep_amount"
                        placeholder="0.00"
                        field="Valor Depósito"
                        :ref="element => inputs.push(element)"
                        required="true"
                        rule="numeric"
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
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDeposits } from '../composables/useDeposits';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    import { driversService } from '@/module/drivers/services/driversService';
    
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useDeposits()
    
    const selectedDriverInfo = ref(null)
    const onDriverSelect = (driver) => {
        selectedDriverInfo.value = driver
    }
    
    const fetchDrivers = async (q) => {
        const { token } = useUserLoginStore()
        const res = await driversService.query({ search: q }, { token })
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

    const reset = ()=>{ 
        inputs.value.some((input)=>{ input.reset() }) 
        selectedDriverInfo.value = null
    }
</script>
