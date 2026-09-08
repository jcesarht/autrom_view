<script setup>
    import { ref, onMounted } from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useShift_Settlement } from '../composables/useShift_Settlement';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useShift_Settlement()
    const autocomplete_branches = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await subsidiariesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            autocomplete_branches.value = res.result.data
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
                     <UIInputText 
                        name="shiset_sequence"
                        placeholder="Secuencia de liquidación"
                        field="Secuencia de liquidación"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_sequence"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_owners_fee"
                        placeholder="Cuota de propietario"
                        field="Cuota de propietario"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_owners_fee"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputDate 
                        name="shiset_settlement_date"
                        placeholder="Fecha de liquidación"
                        field="Fecha de liquidación"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_settlement_date"
                        required="true"
                        disable_future="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_type"
                        placeholder="Tipo de liquidación"
                        field="Tipo de liquidación"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_type"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="shiset_comments"
                        placeholder="Comentarios"
                        field="Comentarios"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.shiset_comments"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="raop"
                        placeholder="Tarifa"
                        field="Tarifa"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.raop"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri"
                        placeholder="Conductor"
                        field="Conductor"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri"
                        required="true"
                    />
                </div>
                <div v-if="autocomplete_branches.length > 1">
                     <UIAutocomplete 
                        name="sub"
                        placeholder="Sucursal"
                        field="Sucursal"
                        :ref="element => inputs.push(element)"
                        :modelValue="props.dataForUpdate.sub"
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
                    <UIButton textButton="Actualizar" />
                </div>
            </div>
        </form>
    </div>
</template>