<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useRates_opeRatives } from '../composables/useRates_opeRatives';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { update, error, message } = useRates_opeRatives()
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
                        name="raop_name"
                        placeholder="Nombre de la Tarifa"
                        field="Nombre de la Tarifa"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop_value"
                        placeholder="Valor de la Tarifa"
                        field="Valor de la Tarifa"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop_value"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop_drivers_save_value_default"
                        placeholder="Valor del Depositos"
                        field="Valor del Depositos"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop_drivers_save_value_default"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop_before_date_deafult"
                        placeholder="Inicializar la Liquidación con la fecha del día anterior a la fecha actual"
                        field="Fecha Anterior por Defecto"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop_before_date_deafult"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop_comment"
                        placeholder="Comentarios"
                        field="Comentarios"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop_comment"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com"
                        placeholder="Com"
                        field="Com"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.com"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub"
                        placeholder="Sub"
                        field="Sub"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub"
                        required="false"
                    />
                </div>
                <div class="w-30">
                    <UIButton textButton="Update" />
                </div>
            </div>
        </form>
    </div>
</template>