<script setup>
    import { ref, onMounted } from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UISelect from '@/components/UIComponents/UISelect.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useVehicle_expenses } from '../composables/useVehicle_expenses';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { rates_operativesService } from '@/module/rates_operatives/services/rates_operativesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useVehicle_expenses()
    const autocomplete_branches = ref([])
    const rates_list = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await subsidiariesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            autocomplete_branches.value = res.result.data
        }
        const resRates = await rates_operativesService.query(undefined, { token })
        if (!resRates.error && resRates.result.data) {
            rates_list.value = resRates.result.data.filter(r => r.raop_status === 1 || r.raop_status === '1')
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
                        name="vehexp_amount"
                        placeholder="Valor"
                        field="Valor"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.vehexp_amount"
                        required="true"
                        rule="numeric"
                    />
                </div>
                <div>
                    <UISelect
                        name="raop"
                        placeholder="Seleccionar tarifa..."
                        field="Tarifa"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :items="rates_list"
                        itemLabel="raop_name"
                        itemValue="raop_id"
                        :value="props.dataForUpdate.raop"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="vehexp_concept"
                        placeholder="Concepto"
                        field="Concepto"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.vehexp_concept"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="vehexp_comments"
                        placeholder="Comentarios"
                        field="Comentarios"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.vehexp_comments"
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
