<template>
    <div class="w-full">
        <div class="info mb-2">
            <base-info-sign :typeInfo="typeInfo" :showNotification="showSign" :timeShow="20" >
                {{ infoMessage }}  
            </base-info-sign>
        </div>
        <div class="mb-4">
            <UIButton textButton="Buscar" @click="queryData()" />
        </div>
        <div v-if="tableData && tableData.length > 0" class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Secuencia</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Conductor</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="row in tableData" :key="row.dripay_id">
                        <td class="px-4 py-2 text-sm">{{ row.dripay_sequence }}</td>
                        <td class="px-4 py-2 text-sm">{{ row.dri }}</td>
                        <td class="px-4 py-2 text-sm">{{ row.dripay_amount }}</td>
                        <td class="px-4 py-2 text-sm">{{ row.dripay_type == '1' ? 'Tarifa' : 'Otros' }}</td>
                        <td class="px-4 py-2 text-sm">{{ row.dripay_date }}</td>
                        <td class="px-4 py-2 text-sm">{{ row.dripay_details }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="searched" class="text-gray-500 text-sm">
            No se encontraron registros.
        </div>
    </div>
</template>
<script setup>
    import {ref} from 'vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import { useOverlay } from '@/stores/useOverlay';
    import { useDriversPayments } from '../composables/useDriversPayments';

    const showSign = ref(false)
    const typeInfo = ref("error")
    const infoMessage = ref(null)
    const tableData = ref([])
    const searched = ref(false)
    const { query, data, error, message } = useDriversPayments()

    const overlay = useOverlay()
    const { showOverlay, hiddenOverlay } = overlay

    const queryData = async () => {
        showOverlay()
        await query()
        if (!error.value) {
            tableData.value = data.value || []
        } else {
            showSign.value = true
            typeInfo.value = "error"
            infoMessage.value = message
        }
        searched.value = true
        hiddenOverlay()
    }
</script>
