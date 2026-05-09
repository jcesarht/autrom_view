<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
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
    const { update, error, message } = useDrivers()
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
                        name="dri_dni"
                        placeholder="Dri dni"
                        field="Dri dni"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_dni"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_firts_name"
                        placeholder="Dri firts name"
                        field="Dri firts name"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_firts_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_last_name"
                        placeholder="Dri last name"
                        field="Dri last name"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_last_name"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_qualify"
                        placeholder="Dri qualify"
                        field="Dri qualify"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_qualify"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_phone"
                        placeholder="Dri phone"
                        field="Dri phone"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_phone"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_birthday"
                        placeholder="Dri birthday"
                        field="Dri birthday"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_birthday"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_email"
                        placeholder="Dri email"
                        field="Dri email"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_email"
                        required="false"
                    />
                </div>
                <div>
                    <UILocationPicker
                        countryField="dri_country"
                        stateField="dri_state"
                        cityField="dri_city"
                        countryLabel="Dri country"
                        stateLabel="Dri state"
                        cityLabel="Dri city"
                        countryValueType="name"
                        :modelValue="{ dri_country: props.dataForUpdate.dri_country, dri_state: props.dataForUpdate.dri_state, dri_city: props.dataForUpdate.dri_city }"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_create_at"
                        placeholder="Dri create at"
                        field="Dri create at"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_create_at"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_update_at"
                        placeholder="Dri update at"
                        field="Dri update at"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_update_at"
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