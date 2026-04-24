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
                     <UIInputText 
                        name="dri_country"
                        placeholder="País"
                        field="País"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_state"
                        placeholder="Estado / Departamento"
                        field="Estado / Departamento"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_city"
                        placeholder="Ciudad"
                        field="Ciudad"
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
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDrivers } from '../composables/useDrivers';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useDrivers()
    
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
        if (!response.error) {
            inputs.value.some((input)=>{
                data[input.attribute.name] = input.valueInput()
            })
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