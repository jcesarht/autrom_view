<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useSubSidiarieS } from '../composables/useSubSidiarieS';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
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
                        name="sub_name"
                        placeholder="Name"
                        field="Name"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_phone"
                        placeholder="Phone"
                        field="Phone"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_phone"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_country"
                        placeholder="Country"
                        field="Country"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_country"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_state"
                        placeholder="State"
                        field="State"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_state"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_city"
                        placeholder="City"
                        field="City"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_city"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="sub_address"
                        placeholder="Address"
                        field="Address"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_address"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputDate
                        name="sub_expiration_date"
                        id="sub_expiration_date_update"
                        placeholder="Expiration date"
                        field="Expiration date"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.sub_expiration_date"
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