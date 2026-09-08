<script setup>
    import { ref, onMounted } from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIQuality from '@/components/UIComponents/UIQuality.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDrivers } from '../composables/useDrivers';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useDrivers()
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

            const userData = JSON.parse(localStorage.getItem('userLogin'))
            if (userData) {
                if (!data['sub']) data['sub'] = userData.sub_id
                data['com'] = userData.com_id
            }

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
                        name="dri_dni"
                        placeholder="DNI / Cédula"
                        field="DNI / Cédula"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_dni"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_firts_name"
                        placeholder="Nombres"
                        field="Nombres"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_firts_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_last_name"
                        placeholder="Apellidos"
                        field="Apellidos"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_last_name"
                        required="false"
                    />
                </div>
                <div>
                     <UIQuality 
                        name="dri_qualify"
                        field="Calificación del conductor"
                        :maxStars="5"
                        activeColor="bg-blue-500"
                        inactiveColor="bg-gray-200"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_qualify"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_phone"
                        placeholder="Teléfono"
                        field="Teléfono"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_phone"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_birthday"
                        placeholder="Fecha de nacimiento"
                        field="Fecha de nacimiento"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.dri_birthday"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="dri_email"
                        placeholder="Correo electrónico"
                        field="Correo electrónico"
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
                        countryLabel="País"
                        stateLabel="Estado / Departamento"
                        cityLabel="Ciudad"
                        countryValueType="name"
                        :modelValue="{ dri_country: props.dataForUpdate.dri_country, dri_state: props.dataForUpdate.dri_state, dri_city: props.dataForUpdate.dri_city }"
                        :ref="element => inputs.push(element)"
                        required="false"
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