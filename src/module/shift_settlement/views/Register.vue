<template>
    <div class="w-full">
        <div class="info mb-2">
            <base-info-sign :typeInfo="typeInfo" :showNotification="showSign" :timeShow="20" >
                {{ infoMessage }}  
            </base-info-sign>
        </div>
        <form novalidate @submit.prevent="saveEventButton()" v-if="!showTicket">
            <div class="w-12/12 space-y-4">
                <div class="w-30 mb-2">
                    <UIButton textButton="Guardar" />
                </div>
                
                <div>
                     <UIAutocomplete 
                        name="veh"
                        placeholder="Buscar placa..."
                        field="Placa"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :fetchSuggestions="fetchVehicles"
                        :getLabel="v => v.veh_license_plate"
                        itemValue="veh_id"
                        :itemKey="v => v.veh_id"
                        @select="onVehicleSelect"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.veh_license_plate }}</span>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>

                <div>
                    <UISelect
                        name="raop"
                        placeholder="Seleccionar tarifa..."
                        field="Tarifa"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :items="ratesList"
                        itemLabel="raop_name"
                        itemValue="raop_id"
                        v-model="selectedRate"
                    />
                </div>

                <div class="flex items-center gap-2 mb-2">
                    <input type="checkbox" id="relevo" v-model="isRelevo" class="w-4 h-4" />
                    <label for="relevo" class="text-sm font-semibold text-gray-700">Conductor Relevo</label>
                </div>

                <!-- Assigned driver (not editable) -->
                <div v-if="!isRelevo">
                    <div class="w-full mb-2">
                        <div class="px-1 text-gray-500">
                            <strong>Conductor Asignado</strong>
                        </div>
                        <input 
                            type="text" 
                            class="font-semibold w-full rounded px-3 py-2 border-2 border-gray-300 bg-gray-100 text-sm text-gray-500 focus:outline-none"
                            :value="assignedDriverDisplay"
                            readonly 
                        />
                    </div>
                </div>

                <!-- Autocomplete Conductor (only if isRelevo is true) -->
                <div v-else>
                     <UIAutocomplete 
                        name="dri"
                        placeholder="Buscar conductor..."
                        field="Conductor"
                        :ref="element => inputs.push(element)"
                        required="true"
                        :fetchSuggestions="fetchDrivers"
                        itemValue="dri_id"
                        :itemLabel="['dri_firts_name', 'dri_last_name', 'dri_dni']"
                        :getLabel="d => `${d.dri_firts_name} ${d.dri_last_name} - ${d.dri_dni}`"
                        :itemKey="d => d.dri_id"
                        v-model="selectedDriver"
                    >
                        <template #item="{ item }">
                            <div class="flex justify-between w-full">
                                <span>{{ item.dri_firts_name }} {{ item.dri_last_name }}</span>
                                <small class="text-gray-400">{{ item.dri_dni }}</small>
                            </div>
                        </template>
                    </UIAutocomplete>
                </div>

                <div class="flex items-start gap-2 w-full">
                    <div class="w-4/5">
                         <UIInputText 
                            name="shiset_km_new"
                            placeholder="Kilometraje nuevo"
                            field="Km nuevo"
                            :ref="element => inputs.push(element)"
                            required="true"
                            rule="numeric"
                        />
                    </div>
                    <div class="w-1/5 pt-6">
                        <button 
                            type="button" 
                            @click="fetchGPSMileage" 
                            :disabled="!hasGPS"
                            :class="[
                                'w-full py-2 rounded text-sm font-semibold flex items-center justify-center gap-1 transition-colors',
                                hasGPS ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            ]"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>GPS</span>
                        </button>
                    </div>
                </div>

                <div>
                     <UIInputText 
                        name="shiset_owners_fee"
                        placeholder="Valor tarifa"
                        field="Valor tarifa"
                        :ref="element => inputs.push(element)"
                        required="true"
                        rule="numeric"
                        v-model="ownersFee"
                    />
                </div>

                <div>
                     <UIInputText 
                        name="shiset_drivers_deposit"
                        placeholder="Depósito en garantía"
                        field="Depósito en Garantía"
                        :ref="element => inputs.push(element)"
                        required="true"
                        rule="numeric"
                        v-model="driversDeposit"
                    />
                </div>

                <div>
                     <UIInputDate 
                        name="shiset_settlement_date"
                        placeholder="Fecha de liquidación"
                        field="Fecha de liquidación"
                        :ref="element => inputs.push(element)"
                        required="true"
                        disable_future="true"
                        v-model="settlementDate"
                    />
                </div>

                <div>
                     <UIInputText 
                        name="shiset_comments"
                        placeholder="Comentarios adicionales"
                        field="Comentarios"
                        :ref="element => inputs.push(element)"
                        required="false"
                    />
                </div>

                <hr class="my-4" />

                <!-- Abono Section -->
                <div class="border p-4 rounded-lg bg-gray-50">
                    <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" id="has_abono" v-model="hasAbono" @change="onAbonoToggle" class="w-4 h-4" />
                        <label for="has_abono" class="text-sm font-semibold text-gray-700">Registrar Abono</label>
                    </div>
                    <div v-if="hasAbono" class="space-y-2">
                        <UIInputText 
                            name="abono_amount"
                            placeholder="0.00"
                            field="Valor Abono"
                            :ref="element => inputs.push(element)"
                            required="true"
                            rule="numeric"
                            v-model="abonoAmount"
                        />
                        <UISelect
                            name="abono_type"
                            placeholder="Seleccionar tipo..."
                            field="Tipo de Abono"
                            :ref="element => inputs.push(element)"
                            required="true"
                            :items="abonoDeudaTypes"
                            itemLabel="label"
                            itemValue="value"
                        />
                        <UIInputDate
                            name="abono_date"
                            placeholder="Fecha de Abono"
                            field="Fecha de Abono"
                            :ref="element => inputs.push(element)"
                            required="true"
                        />
                    </div>
                </div>

                <!-- Deuda Section -->
                <div class="border p-4 rounded-lg bg-gray-50">
                    <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" id="has_deuda" v-model="hasDeuda" @change="onDeudaToggle" class="w-4 h-4" />
                        <label for="has_deuda" class="text-sm font-semibold text-gray-700">Registrar Deuda</label>
                    </div>
                    <div v-if="hasDeuda" class="space-y-2">
                        <UIInputText 
                            name="deuda_amount"
                            placeholder="0.00"
                            field="Valor Deuda"
                            :ref="element => inputs.push(element)"
                            required="true"
                            rule="numeric"
                            v-model="deudaAmount"
                        />
                        <UISelect
                            name="deuda_type"
                            placeholder="Seleccionar tipo..."
                            field="Tipo de Deuda"
                            :ref="element => inputs.push(element)"
                            required="true"
                            :items="abonoDeudaTypes"
                            itemLabel="label"
                            itemValue="value"
                        />
                        <UIInputDate
                            name="deuda_date"
                            placeholder="Fecha de Deuda"
                            field="Fecha de Deuda"
                            :ref="element => inputs.push(element)"
                            required="true"
                        />
                    </div>
                </div>

                <div class="p-4 bg-blue-100 rounded-lg text-lg font-bold text-blue-900">
                    Totalizado en Vivo: ${{ liveTotal }}
                </div>

                <div class="w-30">
                    <UIButton textButton="Guardar" />
                </div>
            </div>
        </form>

        <!-- Printable Ticket Section -->
        <div v-if="showTicket" class="p-6 bg-white border rounded shadow-md max-w-md mx-auto space-y-4 printable-area">
            <h2 class="text-center font-bold text-xl">TICKET DE LIQUIDACIÓN</h2>
            <div class="text-sm space-y-1">
                <div><strong>Folio:</strong> {{ ticketData.shiset_sequence }}</div>
                <div><strong>Fecha:</strong> {{ ticketData.shiset_settlement_date }}</div>
                <div><strong>Conductor:</strong> {{ ticketData.dri_name }}</div>
                <div><strong>Placa:</strong> {{ ticketData.veh_plate }}</div>
                <div><strong>Tarifa:</strong> {{ ticketData.raop_name }} (${{ ticketData.shiset_owners_fee }})</div>
                <div><strong>Depósito en Garantía:</strong> ${{ ticketData.shiset_drivers_deposit }}</div>
                <div v-if="ticketData.abono_amount"><strong>Abono:</strong> ${{ ticketData.abono_amount }}</div>
                <div v-if="ticketData.deuda_amount"><strong>Deuda:</strong> ${{ ticketData.deuda_amount }}</div>
                <div class="text-base font-bold border-t pt-1 mt-2"><strong>Total a Pagar:</strong> ${{ ticketData.total_to_pay }}</div>
            </div>
            
            <div class="border-t pt-2 mt-4 text-xs space-y-1 bg-gray-50 p-2 rounded">
                <h3 class="font-bold text-center mb-1">ESTADO DE CUENTA</h3>
                <div><strong>Deuda Acumulada:</strong> ${{ ticketData.deuda_acumulada || 0 }}</div>
                <div><strong>Depósito Total:</strong> ${{ ticketData.deposito_total || 0 }}</div>
            </div>

            <div class="flex justify-between mt-6 no-print">
                <button @click="printTicket" class="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Imprimir</button>
                <button @click="resetForm" class="px-4 py-2 bg-gray-600 text-white rounded font-semibold hover:bg-gray-700">Nueva Liquidación</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import UIInputText from '@/components/UIComponents/UIInputText.vue';
    import UIInputDate from '@/components/UIComponents/UIInputDate.vue';
    import UIAutocomplete from '@/components/UIComponents/UIAutocomplete.vue';
    import UISelect from '@/components/UIComponents/UISelect.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useShift_Settlement } from '../composables/useShift_Settlement';
    import { subsidiariesService } from '@/module/subsidiaries/services/subsidiariesService';
    import { useUserLoginStore } from '@/module/userLogin/stores/useUserLoginStore';
    import { vehiclesService } from '@/module/vehicles/services/vehiclesService';
    import { rates_operativesService } from '@/module/rates_operatives/services/rates_operativesService';
    import { driversService } from '@/module/drivers/services/driversService';
    import { drivers_vehiclesService } from '@/module/drivers_vehicles/services/drivers_vehiclesService';

    const inputs = ref([])
    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const disableButton = ref(false)
    const { save, error, message } = useShift_Settlement()

    const autocomplete_branches = ref([])
    const ratesList = ref([])
    
    // Form fields/states
    const selectedRate = ref('')
    const selectedDriver = ref('')
    const isRelevo = ref(false)
    const hasGPS = ref(false)
    const activeVehicle = ref(null)
    const ownersFee = ref('')
    const driversDeposit = ref('')
    const settlementDate = ref(new Date().toISOString().slice(0, 10))
    
    const assignedDriverDisplay = ref('')
    const assignedDriverId = ref(null)
    
    const hasAbono = ref(false)
    const abonoAmount = ref('0')
    const hasDeuda = ref(false)
    const deudaAmount = ref('0')
    
    const showTicket = ref(false)
    const ticketData = ref({})

    const abonoDeudaTypes = [
        { label: 'Tarifa', value: '1' },
        { label: 'Otros', value: '2' }
    ]

    onMounted(async () => {
        const { token } = useUserLoginStore()
        const resBranches = await subsidiariesService.query(undefined, { token })
        if (!resBranches.error && resBranches.result.data) {
            autocomplete_branches.value = resBranches.result.data
        }
        
        const resRates = await rates_operativesService.query(undefined, { token })
        if (!resRates.error && resRates.result.data) {
            ratesList.value = resRates.result.data.filter(r => r.raop_status === 1 || r.raop_status === '1')
        }
    })

    const fetchVehicles = async (q) => {
        const { token } = useUserLoginStore()
        const res = await vehiclesService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }

    const fetchDrivers = async (q) => {
        const { token } = useUserLoginStore()
        const res = await driversService.query({ search: q }, { token })
        if (res.error) return []
        return res.result.data
    }

    const onVehicleSelect = (vehicle) => {
        activeVehicle.value = vehicle
        hasGPS.value = vehicle ? (vehicle.veh_tracker === 1 || vehicle.veh_tracker === '1' || vehicle.veh_tracker === true) : false
        
        if (vehicle && vehicle.raop) {
            selectedRate.value = vehicle.raop
        }
    }

    const checkAssignedDriver = async () => {
        if (activeVehicle.value && selectedRate.value) {
            const { token } = useUserLoginStore()
            const res = await drivers_vehiclesService.query({
                veh: activeVehicle.value.veh_id,
                raop: selectedRate.value
            }, { token })
            
            if (!res.error && res.result.data && res.result.data.length > 0) {
                const relation = res.result.data[0]
                const resDriver = await driversService.query(undefined, { token })
                if (!resDriver.error && resDriver.result.data) {
                    const driver = Array.isArray(resDriver.result.data) ? resDriver.result.data.find(d => d.dri_id === relation.dri) : resDriver.result.data
                    if (driver) {
                        assignedDriverDisplay.value = `${driver.dri_firts_name} ${driver.dri_last_name} - ${driver.dri_dni}`
                        assignedDriverId.value = driver.dri_id
                        if (!isRelevo.value) {
                            selectedDriver.value = driver
                        }
                    }
                }
            } else {
                assignedDriverDisplay.value = 'Sin conductor asignado'
                assignedDriverId.value = null
                if (!isRelevo.value) {
                    selectedDriver.value = null
                }
            }
        } else {
            assignedDriverDisplay.value = ''
            assignedDriverId.value = null
            if (!isRelevo.value) {
                selectedDriver.value = null
            }
        }
    }

    watch([activeVehicle, selectedRate], async () => {
        await checkAssignedDriver()
    })

    watch(selectedRate, (newRateId) => {
        const rate = ratesList.value.find(r => r.raop_id === newRateId)
        if (rate) {
            ownersFee.value = String(rate.raop_value || '')
            driversDeposit.value = String(rate.raop_drivers_save_value_default || '')
            if (rate.raop_before_date_deafult === 1 || rate.raop_before_date_deafult === '1') {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                settlementDate.value = yesterday.toISOString().slice(0, 10)
            } else {
                settlementDate.value = new Date().toISOString().slice(0, 10)
            }
        }
    })

    const onAbonoToggle = () => {
        if (hasAbono.value) {
            hasDeuda.value = false
            deudaAmount.value = '0'
        } else {
            abonoAmount.value = '0'
        }
    }

    const onDeudaToggle = () => {
        if (hasDeuda.value) {
            hasAbono.value = false
            abonoAmount.value = '0'
        } else {
            deudaAmount.value = '0'
        }
    }

    const liveTotal = computed(() => {
        const fee = parseFloat(ownersFee.value) || 0
        const dep = parseFloat(driversDeposit.value) || 0
        const abono = hasAbono.value ? (parseFloat(abonoAmount.value) || 0) : 0
        const deuda = hasDeuda.value ? (parseFloat(deudaAmount.value) || 0) : 0
        return fee + dep + abono - deuda
    })

    const fetchGPSMileage = () => {
        alert('Obteniendo kilometraje GPS... MOCK: 154320')
    }

    const overlay = useOverlay()
    const { showOverlay, hiddenOverlay } = overlay

    const saveEventButton = async () => {
        showSign.value = false
        infoMessage.value = ''
        disableButton.value = true
        showOverlay()
        try {
            const validate = validateInput()
            if (!validate.error) {
                typeInfo.value = "alert"
                
                const payload = { ...validate.data }
                payload.shiset_type = 1
                
                await save(payload);
                if (!error.value) {
                    typeInfo.value = "success"
                    
                    let finalDriverName = 'Conductor'
                    if (isRelevo.value && selectedDriver.value) {
                        finalDriverName = typeof selectedDriver.value === 'object'
                            ? `${selectedDriver.value.dri_firts_name} ${selectedDriver.value.dri_last_name}`
                            : String(selectedDriver.value)
                    } else if (assignedDriverDisplay.value && assignedDriverDisplay.value !== 'Sin conductor asignado') {
                        finalDriverName = assignedDriverDisplay.value.split(' - ')[0]
                    }

                    ticketData.value = {
                        shiset_sequence: save.data?.shiset_sequence || Math.floor(Math.random() * 10000),
                        shiset_settlement_date: validate.data.shiset_settlement_date || new Date().toLocaleString(),
                        dri_name: finalDriverName,
                        veh_plate: activeVehicle.value?.veh_license_plate || 'S/P',
                        raop_name: ratesList.value.find(r => r.raop_id === selectedRate.value)?.raop_name || 'Tarifa',
                        shiset_owners_fee: ownersFee.value,
                        shiset_drivers_deposit: driversDeposit.value,
                        abono_amount: hasAbono.value ? abonoAmount.value : null,
                        deuda_amount: hasDeuda.value ? deudaAmount.value : null,
                        total_to_pay: liveTotal.value,
                        deuda_acumulada: 120, 
                        deposito_total: 450 
                    }
                    showTicket.value = true
                } else {
                    showSign.value = true
                    infoMessage.value = message.value || message || 'Error al guardar la liquidación'
                }
            }
        } catch (err) {
            console.error('Error in saveEventButton:', err)
            showSign.value = true
            infoMessage.value = 'Ocurrió un error inesperado al procesar la solicitud'
        } finally {
            hiddenOverlay()
            disableButton.value = false
        }
    }

    const validateInput = () => {
        const response = { error: true, data: {} };
        
        // Clean nulls, unmounted refs, and keep unique valid component inputs
        const validInputsMap = new Map()
        inputs.value.forEach(input => {
            if (input && typeof input.checkValidateError === 'function' && input.attribute && input.attribute.name) {
                validInputsMap.set(input.attribute.name, input)
            }
        })
        const activeInputs = Array.from(validInputsMap.values())
        inputs.value = activeInputs

        if (!isRelevo.value && !assignedDriverId.value) {
            showSign.value = true
            infoMessage.value = 'El vehículo seleccionado no tiene un conductor asignado. Por favor active "Conductor Relevo" y seleccione un conductor.'
            return response
        }

        let hasError = false
        activeInputs.forEach(input => {
            if (input.attribute.name === 'dri' && !isRelevo.value) {
                return
            }
            if (input.checkValidateError()) {
                hasError = true
            }
        })
        response.error = hasError

        const data = {}
        if (!response.error) {
            activeInputs.forEach((input) => { 
                if (input.attribute.name === 'dri' && !isRelevo.value) {
                    return
                }
                data[input.attribute.name] = input.valueInput() 
            })
            
            if (!isRelevo.value) {
                data['dri'] = assignedDriverId.value
            }

            const userData = JSON.parse(localStorage.getItem('userLogin'))
            if (userData) {
                if (!data['sub']) data['sub'] = userData.sub_id
                data['com'] = userData.com_id
            }
            response.data = data;
        }
        return response
    }

    const resetForm = () => {
        showTicket.value = false
        ticketData.value = {}
        inputs.value.some((input) => { input.reset() })
        isRelevo.value = false
        hasGPS.value = false
        activeVehicle.value = null
        selectedRate.value = ''
        selectedDriver.value = ''
        ownersFee.value = ''
        driversDeposit.value = ''
        settlementDate.value = new Date().toISOString().slice(0, 10)
        hasAbono.value = false
        abonoAmount.value = '0'
        hasDeuda.value = false
        deudaAmount.value = '0'
        assignedDriverDisplay.value = ''
        assignedDriverId.value = null
    }

    const printTicket = () => {
        window.print()
    }
</script>

<style scoped>
@media print {
    body * {
        visibility: hidden;
    }
    .printable-area, .printable-area * {
        visibility: visible;
    }
    .printable-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
    .no-print {
        display: none;
    }
}
</style>