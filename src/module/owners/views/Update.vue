<script setup>
    import {ref, onMounted} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UILocationPicker from '@/components/UIComponents/UILocationPicker.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useOwners } from '../composables/useOwners';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    
    //initialize reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const isUpdated = ref(false)
    const { update, error, message } = useOwners()
    const autocomplete_branches = ref([])
    onMounted(async () => {
        const { token } = useUserLoginStore()
        const res = await subsidiariesService.query(undefined, { token })
        if (!res.error && res.result.data) {
            const userData = JSON.parse(localStorage.getItem('userLogin'))
            const userCom = userData ? (userData.com_id || userData.com) : null
            const uniqueMap = new Map()
            for (const item of res.result.data) {
                const itemCom = item.com_id ?? (typeof item.com === 'object' ? item.com?.com_id : item.com)
                if (userCom && itemCom && String(itemCom) !== String(userCom)) {
                    continue
                }
                if (item.sub_id && !uniqueMap.has(item.sub_id)) {
                    uniqueMap.set(item.sub_id, item)
                }
            }
            autocomplete_branches.value = Array.from(uniqueMap.values())
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
                        name="own_first_name"
                        placeholder="Nombres del propietario"
                        field="Nombres del propietario"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_first_name"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_last_name"
                        placeholder="Apellidos del propietario"
                        field="Apellidos del propietario"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_last_name"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_dni"
                        placeholder="DNI / Cédula"
                        field="DNI / Cédula"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_dni"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_login"
                        placeholder="Usuario"
                        field="Usuario"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_login"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_password_hash"
                        placeholder="Contraseña"
                        field="Contraseña"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_password_hash"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_email"
                        placeholder="Correo electrónico"
                        field="Correo electrónico"
                        :ref="element => inputs.push(element)"
                        :value="props.dataForUpdate.own_email"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="own_phone"
                        placeholder="Teléfono"
                        field="Teléfono"
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
                        countryLabel="País"
                        stateLabel="Estado / Departamento"
                        cityLabel="Ciudad"
                        countryValueType="name"
                        :modelValue="{ own_country: props.dataForUpdate.own_country, own_state: props.dataForUpdate.own_state, own_city: props.dataForUpdate.own_city }"
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