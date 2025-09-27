<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useShift_Settlement } from '../composables/useShift_Settlement';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { update, error, message } = useShift_Settlement()
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
                        name="shiset_sequence"
                        placeholder="Shiset sequence"
                        field="Shiset sequence"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_sequence"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_owners_fee"
                        placeholder="Shiset owners fee"
                        field="Shiset owners fee"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_owners_fee"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_settlement_date"
                        placeholder="Shiset settlement date"
                        field="Shiset settlement date"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_settlement_date"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_type"
                        placeholder="Shiset type"
                        field="Shiset type"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_type"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_comments"
                        placeholder="Shiset comments"
                        field="Shiset comments"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_comments"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop"
                        placeholder="Raop"
                        field="Raop"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri"
                        placeholder="Dri"
                        field="Dri"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri"
                        required="true"
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
                        name="shiset_create_at"
                        placeholder="Shiset create at"
                        field="Shiset create at"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_create_at"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_update_at"
                        placeholder="Shiset update at"
                        field="Shiset update at"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_update_at"
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