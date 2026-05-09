<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useOwners } from '../composables/useOwners';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { update, error, message } = useOwners()
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
                        name="own_first_name"
                        placeholder="Own first name"
                        field="Own first name"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_first_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_last_name"
                        placeholder="Own last name"
                        field="Own last name"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_last_name"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_dni"
                        placeholder="Own dni"
                        field="Own dni"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_dni"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_login"
                        placeholder="Own login"
                        field="Own login"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_login"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_password_hash"
                        placeholder="Own password hash"
                        field="Own password hash"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_password_hash"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_email"
                        placeholder="Own email"
                        field="Own email"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_email"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_phone"
                        placeholder="Own phone"
                        field="Own phone"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_phone"
                        required="false"
                    />
                </div>
                <div>
                    <UILocationPicker
                        countryField="own_country"
                        stateField="own_state"
                        cityField="own_city"
                        countryLabel="Own country"
                        stateLabel="Own state"
                        cityLabel="Own city"
                        countryValueType="name"
                        :modelValue="{ own_country: props.dataForUpdate.own_country, own_state: props.dataForUpdate.own_state, own_city: props.dataForUpdate.own_city }"
                        :ref="element => inputs.push(element)"
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
                        name="own_create_at"
                        placeholder="Own create at"
                        field="Own create at"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_create_at"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_update_at"
                        placeholder="Own update at"
                        field="Own update at"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_update_at"
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