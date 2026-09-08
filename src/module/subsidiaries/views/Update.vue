<script setup>
    import { ref } from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useSubSidiarieS } from '../composables/useSubSidiarieS';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useSubSidiarieS()
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
                     <UIInputText 
                        name="sub_name"
                        placeholder="Nombre de la sucursal"
                        field="Nombre de la sucursal"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_phone"
                        placeholder="Teléfono"
                        field="Teléfono"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_phone"
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
                        :modelValue="{ sub_country: props.dataForUpdate.sub_country, sub_state: props.dataForUpdate.sub_state, sub_city: props.dataForUpdate.sub_city }"
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
                        :value="props.dataForUpdate.sub_address"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputDate
                        name="sub_expiration_date"
                        id="sub_expiration_date_update"
                        placeholder="Fecha de expiración"
                        field="Fecha de expiración"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_expiration_date"
                        required="false"
                    />
                </div>

                <div class="w-30">
                    <UIButton textButton="Actualizar" />
                </div>
            </div>
        </form>
    </div>
</template>