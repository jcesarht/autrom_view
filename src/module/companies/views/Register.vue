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
                        name="com_name"
                        placeholder="Company name"
                        field="Company name"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_itim"
                        placeholder="Itim"
                        field="Itim"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_logo"
                        placeholder="Logo"
                        field="Logo"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_total_number_of_car"
                        placeholder="Number of cars"
                        field="Number of cars"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_base_price"
                        placeholder="Base Price"
                        field="Base Price"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_price_sales"
                        placeholder="Price Sales"
                        field="Price Sales"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_currency"
                        placeholder="Currency"
                        field="Currency"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div>
                     <UIInputText 
                        name="com_taxes"
                        placeholder="Taxes"
                        field="Taxes"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                    <UIAutocomplete
                        v-model="selected"
                        :items="countries"
                        :getLabel="c => c.name"
                        :itemKey="c => c.code"
                        required="true"
                        field ="País"
                        placeholder ="País"
                        @select="onSelect"
                        :ref="element => inputs.push(element)"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.name }}</span>
                                <small class="text-gray-400">{{ item.code }}</small>
                            </div>
                        </template>
                    </UIAutocomplete>

                </div>
                <div>
                     <UIInputText 
                        name="com_withholding_tax"
                        placeholder="Com withholding tax"
                        field="Com withholding tax"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>
                <div>
                     <UIInputDate 
                        name="com_expiration_date"
                        placeholder="Expiration Date"
                        field="Expiration Date"
                        :ref="element => inputs.push(element)"
                        required="true"
                    />
                </div>
                <div class="w-30">
                    <UIButton textButton="Save" />
                </div>
            </div>
        </form>
    </div>
</template>
<script setup>
    import {onMounted, ref} from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useCompanies } from '../composables/useCompanies';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    
    //initialize  reactive variable
    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const countries = ref(false)
    const { save, error, message, autocompleteData } = useCompanies()
    
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
            response.data = data;
        }
        
        return response
    }

    const reset = ()=>{
        inputs.value.some((input)=>{
            input.reset()
        })
    }

    const selected = ref(null)

    onMounted(async()=>{
        countries.value = await autocompleteData()
    });
    function onSelect(item) {
    console.log('Seleccionado:', item)
    }

</script>