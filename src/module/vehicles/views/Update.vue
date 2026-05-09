<script setup>
    import {ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useVehicles } from '../composables/useVehicles';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    import { ownersService } from '@/module/owners/services/ownersService';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { update, error, message } = useVehicles()
    
    const fetchOwners = async (q) => {
        const { token } = useUserLoginStore()
        const res = await ownersService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }
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
            
            // Add hidden sub and com fields
            const userData = JSON.parse(localStorage.getItem('userLogin'))
            if (userData) {
                data['sub'] = userData.sub_id
                data['com'] = userData.com_id
            }

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
                        name="veh_license_plate"
                        placeholder="Veh license plate"
                        field="Veh license plate"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_license_plate"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_initial_milealge"
                        placeholder="Veh initial milealge"
                        field="Veh initial milealge"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_initial_milealge"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_brand"
                        placeholder="Veh brand"
                        field="Veh brand"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_brand"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_model"
                        placeholder="Veh model"
                        field="Veh model"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_model"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_chassis"
                        placeholder="Veh chassis"
                        field="Veh chassis"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_chassis"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_engine"
                        placeholder="Veh engine"
                        field="Veh engine"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_engine"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_show_owner_report_from"
                        placeholder="Veh show owner report from"
                        field="Veh show owner report from"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_show_owner_report_from"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="veh_tracker"
                        placeholder="Veh tracker"
                        field="Veh tracker"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.veh_tracker"
                        required="false"
                    />
                </div>
                <div>
                    <UILocationPicker
                        countryField="veh_country"
                        stateField="veh_state"
                        cityField="veh_city"
                        countryLabel="Veh country"
                        stateLabel="Veh state"
                        cityLabel="Veh city"
                        countryValueType="name"
                        :modelValue="{ veh_country: props.dataForUpdate.veh_country, veh_state: props.dataForUpdate.veh_state, veh_city: props.dataForUpdate.veh_city }"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIAutocomplete 
                        name="own"
                        placeholder="Propietario"
                        field="Own"
                        :ref="element => inputs.push(element)"
                        :modelValue="props.dataForUpdate.own"
                        required="true"
                        :fetchSuggestions="fetchOwners"
                        :getLabel="o => `${o.own_first_name} ${o.own_last_name} - ${o.own_dni}`"
                        itemValue="own_id"
                        :itemKey="o => o.own_id"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.own_first_name }} {{ item.own_last_name }}</span>
                                <small class="text-gray-400">{{ item.own_dni }}</small>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>
                
                <div class="w-30">
                    <UIButton textButton="Update" />
                </div>
            </div>
        </form>
    </div>
</template>