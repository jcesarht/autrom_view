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
                    <UIButton textButton="Save" />
                </div>
                
                <div>
                     <UIInputText 
                        name="dri_dni"
                        placeholder="DNI/Identification"
                        field="DNI/Identification"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_firts_name"
                        placeholder="Nombres"
                        field="Nombres"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_last_name"
                        placeholder="Apellidos"
                        field="Apellidos"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_qualify"
                        placeholder="Calificación"
                        field="Calificación"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_phone"
                        placeholder="Telefóno"
                        field="Telefóno"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputDate 
                        name="dri_birthday"
                        placeholder="Cumpleaños"
                        field="Cumpleaños"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_email"
                        placeholder="Email"
                        field="Email"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                    <UILocationPicker
                        countryField="dri_country"
                        stateField="dri_state"
                        cityField="dri_city"
                        countryLabel="País"
                        stateLabel="Estado / Departamento"
                        cityLabel="Ciudad"
                        countryValueType="name"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div class="w-30">
                    <UIButton textButton="Save" />
                </div>
            </div>
        </form>
    </div>
</template>
<script setup>
    import {ref, onMounted} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDrivers } from '../composables/useDrivers';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useDrivers()
    
    const autocomplete_branches = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await subsidiariesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            autocomplete_branches.value = res.result.data
        }
    })
    
    //overlay function
    const overlay = useOverlay()
    const { showOverlay, hiddenOverlay } = overlay
    //composable functions

    //event save function
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
    
    /**
     * validate all inputs
     */
    const validateInput = ()=>{
        const response = {
            error: true,
            data: {}
        };

        response.error = inputs.value.some(input => input.checkValidateError())
        const data = []
        debugger
        if (!response.error) {
            inputs.value.some((input)=>{
                if (input.attribute.isLocationPicker) {
                    Object.assign(data, input.valueInput())
                } else {
                    data[input.attribute.name] = input.valueInput()
                }
            })
            
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
        inputs.value.some((input)=>{
            input.reset()
        })
    }

</script>