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
                     <UIInputText 
                        name="sub_name"
                        placeholder="Nombre de la sucursal"
                        field="Nombre de la sucursal"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_phone"
                        placeholder="Teléfono"
                        field="Teléfono"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                    <UILocationPicker
                        countryField="sub_country"
                        stateField="sub_state"
                        cityField="sub_city"
                        countryLabel="País"
                        stateLabel="Estado / Departamento"
                        cityLabel="Ciudad"
                        countryValueType="name"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_address"
                        placeholder="Dirección postal"
                        field="Dirección postal"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputDate 
                        name="sub_expiration_date"
                        placeholder="Fecha de expiración"
                        field="Fecha de expiración"
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
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import UIAutocomplete from '../../../components/UIComponents/UIAutocomplete.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useSubSidiarieS } from '../composables/useSubSidiarieS';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message, autocompleteDataCompany } = useSubSidiarieS()
    const autocomplete_companies = ref([])
    
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
        const data = {}
        if (!response.error) {
            inputs.value.some((input)=>{
                if (input.attribute.isLocationPicker) {
                    Object.assign(data, input.valueInput())
                } else {
                    data[input.attribute.name] = input.valueInput()
                }
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

    const selected_company = ref(null)

    function onSelect(item) {
        console.log('Seleccionado:', item)
    }

    onMounted(async()=>{
        autocomplete_companies.value = await autocompleteDataCompany()
    });

</script>