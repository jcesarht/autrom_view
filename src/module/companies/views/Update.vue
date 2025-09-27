<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useCompanies } from '../composables/useCompanies';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { update, error, message } = useCompanies()
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
                await update(props.id,validate.data);
                if (!error.value){
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

    const showUpdateForm = ()=>{
        emit('showUpdateForm', false)
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
                    <UIButton textButton="Go Back" @click="showUpdateForm()" />
                </div>
                
                <div>
                     <UIInputText 
                        name="com_name"
                        placeholder="Compañia"
                        field="Compañia"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_itim"
                        placeholder="Itim"
                        field="Itim"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_itim"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_logo"
                        placeholder="Logo"
                        field="Logo"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_logo"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_total_number_of_car"
                        placeholder="Numbero de Carros"
                        field="Numbero de Carros"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_total_number_of_car.toString()"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_base_price"
                        placeholder="Precio Base"
                        field="Precio Base"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_base_price"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_price_sales"
                        placeholder="Precio"
                        field="Precio"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_price_sales"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_currency"
                        placeholder="Moneda"
                        field="Moneda"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_currency"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_taxes"
                        placeholder="Impuesto"
                        field="Impuesto"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_taxes"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_withholding_tax"
                        placeholder="Retenciones"
                        field="Retenciones"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_withholding_tax"
                        required="false"
                    />
                </div>
                <div>
                    <UIInputDate
                        name="com_expiration_date"
                        id="com_expiration_date_updated"
                        placeholder="Fecha de Expiración"
                        field="Fecha de Expiración"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com_expiration_date"
                        required="true"
                    />
                </div>
                <div class="w-30">
                    <UIButton textButton="Update" />
                </div>
            </div>
        </form>
    </div>
</template>