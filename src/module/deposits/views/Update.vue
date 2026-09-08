<script setup>
    import { ref, onMounted } from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDeposits } from '../composables/useDeposits';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { driversService } from '@/module/drivers/services/driversService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useDeposits()
    const autocomplete_branches = ref([])
    const selectedDriverInfo = ref(null)

    const onDriverSelect = (driver) => {
        selectedDriverInfo.value = driver
    }

    const fetchDrivers = async (q) => {
        const { token } = useUserLoginStore()
        const res = await driversService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }

    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await subsidiariesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            autocomplete_branches.value = res.result.data
        }
        if (props.dataForUpdate && props.dataForUpdate.dri) {
            const resDriver = await driversService.query(undefined, { token })
            if (!resDriver.error && resDriver.result.data) {
                const driver = Array.isArray(resDriver.result.data)
                    ? resDriver.result.data.find(d => String(d.dri_id) === String(props.dataForUpdate.dri))
                    : resDriver.result.data
                if (driver) {
                    selectedDriverInfo.value = driver
                }
            }
        }
    })
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
                data[input.attribute.name] = input.valueInput()
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
                      <UIAutocomplete 
                         name="dri"
                         placeholder="Buscar conductor..."
                         field="Conductor"
                         :ref="element => inputs.push(element)"
                         required="true"
                         :fetchSuggestions="fetchDrivers"
                         :getLabel="d => `${d.dri_firts_name} ${d.dri_last_name} - ${d.dri_dni}`"
                         itemValue="dri_id"
                         :itemKey="d => d.dri_id"
                         :modelValue="props.dataForUpdate.dri"
                         @select="onDriverSelect"
                     >
                         <template #item="{ item }">
                             <div class="flex justify-between w-full">
                                 <span>{{ item.dri_firts_name }} {{ item.dri_last_name }}</span>
                                 <small class="text-gray-400">{{ item.dri_dni }}</small>
                             </div>
                         </template>
                      </UIAutocomplete>
                </div>
                <div v-if="selectedDriverInfo" class="p-3 bg-gray-50 border rounded-lg mt-2 mb-4 space-y-1 text-sm text-gray-600">
                    <div><strong>Identificación:</strong> {{ selectedDriverInfo.dri_dni }}</div>
                    <div><strong>Teléfono:</strong> {{ selectedDriverInfo.dri_phone || 'N/A' }}</div>
                    <div><strong>Email:</strong> {{ selectedDriverInfo.dri_email || 'N/A' }}</div>
                </div>
                <div>
                     <UIInputText 
                        name="dep_amount"
                        placeholder="Valor depósito"
                        field="Valor depósito"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dep_amount"
                        required="true"
                        rule="numeric"
                    />
                </div>

                <div class="w-30">
                    <UIButton textButton="Actualizar" />
                </div>
            </div>
        </form>
    </div>
</template>
