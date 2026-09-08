<script setup>
    import { ref, computed, reactive } from 'vue';
    import DataTable from 'datatables.net-vue3';
    import DataTablesCore from 'datatables.net';
    import 'datatables.net-responsive-dt';
    import baseInfoSign from '@/components/base/baseInfoSign.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';
    import Spinner from '../../../components/base/Spinner.vue';
    import { useRates_opeRatives } from '../composables/useRates_opeRatives';
    import { useConfirm } from '@/stores/useUIConfirm';
    import { sleep } from '@/composables/useHelper';
    import Update from './Update.vue';

    //creattin rective variable
    const idKey = ref(Math.random())
    const showSpinner = ref(false);
    const showEditionForm = ref(false);
    const id_record = ref(null);
    const dataForUpdateRecord = ref({});

    //initializying composables
    const confirm = useConfirm();
    
    //Reactive object for control sign
    const control_sign = reactive({
        showSign: false,
        typeInfo: 'alert',
        message: ''
    });   
    const search_button = reactive({
        disable: false
    });
    // setup confirm element
    confirm.textContentUIConfirm = "¿Desea eliminar esta fila?";
    let columns = ref([
        {data:"Column1",title:"Column 1"},
    ])

    
    //computed variables
    const showInfo = computed(() => {
        return (control_sign.typeInfo && control_sign.message !== null && control_sign.message !== '');
    });
    //elemnts for data table
    const {error, message, query, dataForUpdate, remove, data} = useRates_opeRatives()
    
    DataTable.use(DataTablesCore);
    
    const rows =ref([
        {Column1:""}
    ]);

    const options = {
        responsive: true,
        order: []
    }
    //funtions
    const chargeTableInformation = async()=>{
        showSpinner.value = true;
        if (search_button.disable) return;
        rows.value = [];
        idKey.value = Math.random()
        search_button.disable = true;
        await query()
        if (!error.value) {
            columns.value = data.value.columns
            rows.value = data.value.rows
            idKey.value = Math.random()
        }else{
            control_sign.showSign = false;
            await sleep(100)
            control_sign.typeInfo = "alert"
            control_sign.showSign = error.value;
            control_sign.message = message.value;
        }
        showSpinner.value = false;
        search_button.disable = false;
    }
    
    // Implement delete logic here
    const deleteRecord = async (id) => {
        const res = await confirm.confirm();
        if (res) {
            // Call the delete function from the composable
            control_sign.showSign = false
            await remove(id);
            if (error.value) {
                control_sign.typeInfo = "alert"
            } else {
                control_sign.message = message.value;
                control_sign.typeInfo = "success"
                chargeTableInformation();
            }
            control_sign.showSign = true;
            control_sign.message = message.value;
        }
    }

    const editRecord = (id) => {
        dataForUpdateRecord.value = dataForUpdate[id];
        id_record.value = id
        showEditionForm.value = true;
        showSpinner.value = false;
        control_sign.message = null;
    }

    const handleCloseUpdate = (shouldReload = false) => {
        showEditionForm.value = false;
        if (shouldReload) {
            chargeTableInformation();
        }
    };

    // Action Events buttons for each row
    document.addEventListener('click', (event) => {
        if (event.target.matches('.datatable-action-delete')) {
            const id = event.target.getAttribute('data-id');
            deleteRecord(id);
        }
        if (event.target.matches('.datatable-action-edit')) {
            const id = event.target.getAttribute('data-id');
            editRecord(id);
        }
    });

</script>
<style>
</style>
<template>
    <div class="container">
        <div class="bg-white d-block p-1 mt-1" v-if="showEditionForm">
            <Update 
                :id="id_record"
                :dataForUpdate="dataForUpdateRecord"
                @showUpdateForm="handleCloseUpdate"
            />
        </div>
        <div class="flex justify-center bg-white d-block p-1 mt-1 " v-if="showSpinner">
            <Spinner :show="showSpinner" />
        </div>
        <div v-if="(!showSpinner && !showEditionForm)">
            <baseInfoSign :typeInfo="control_sign.typeInfo" :showNotification="showInfo" :timeShow="20" >
                {{control_sign.message}}
            </baseInfoSign>
            <div class="bg-white d-block p-1 mt-1">
                <UIButton textButton="Buscar" @click="chargeTableInformation()" :disable="search_button.disable" />
            </div>
            <div class="bg-white d-block p-1 mt-1">
                <DataTable
                    class="display"
                    :columns="columns"
                    :data="rows"
                    :options="options"
                    :key="idKey"
                >
                </DataTable>
            </div>
        </div>
    </div>
</template>