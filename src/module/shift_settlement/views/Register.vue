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
                        name="shiset_sequence"
                        placeholder="Shiset sequence"
                        field="Shiset sequence"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_owners_fee"
                        placeholder="Shiset owners fee"
                        field="Shiset owners fee"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_settlement_date"
                        placeholder="Shiset settlement date"
                        field="Shiset settlement date"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_type"
                        placeholder="Shiset type"
                        field="Shiset type"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_comments"
                        placeholder="Shiset comments"
                        field="Shiset comments"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop"
                        placeholder="Raop"
                        field="Raop"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri"
                        placeholder="Dri"
                        field="Dri"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>

                <div v-if="autocomplete_branches.length > 1">
                     <UIAutocomplete 
                        name="sub"
                        placeholder="Sucursal"
                        field="Sucursal"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :items="autocomplete_branches"
                        :getLabel="s => s.sub_name"
                        itemValue="sub_id"
                        :itemKey="s => s.sub_id"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.sub_name }}</span>
                            </div>
                        </template>
                    </UIAutocomplete>
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
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useShift_Settlement } from '../composables/useShift_Settlement';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useShift_Settlement()
    
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
        if (!response.error) {
            inputs.value.some((input)=>{
                data[input.attribute.name] = input.valueInput()
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