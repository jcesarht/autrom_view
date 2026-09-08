import {driversService } from "../services/driversService"; 
import { useUserLoginStore } from "../../userLogin/stores/useUserLoginStore";
import { subsidiariesService } from "@/module/subsidiaries/services/subsidiariesService";
import { useActionsTableRecord, formatDate } from "@/composables/useHelper";
import { ref, reactive } from "vue";

export function useDrivers(){
    const loading = ref(false);
    const error = ref(true);
    const message = ref('');
    const data = ref(null);
    const dataForUpdate = reactive({});

    const save = async ( param_data ) => {
        try{
            loading.value = true;
            error.value = true;
            message.value = '';
            const {token} = useUserLoginStore()
            const res = await driversService.save( param_data, {"token":token} )
            if (res.error){
                throw Error(res.result.message)
            }
            
            message.value = "Record "+res.result.data.data.dri_id+" Saved succesfully."
            error.value = res.error;
        }catch (err_catch) {
           message.value= "Something was wrong with saving process"
        } finally {
            loading.value = false;
        }

    }

    const query = async (filter = undefined)=>{
        try{
            loading.value = true;
            error.value = true;
            message.value = '';
            const {token} = useUserLoginStore()
            const res = await driversService.query( filter, {"token":token} )
            if (res.error){
                throw Error(res.result.message)
            }
            const sub_res = await subsidiariesService.query(undefined, {"token": token});
            let sub_map = {};
            let sub_count = 0;
            if (!sub_res.error && sub_res.result.data) {
                sub_count = sub_res.result.data.length;
                sub_res.result.data.forEach(s => {
                    sub_map[s.sub_id] = s.sub_name;
                });
            }

            const result_data = res.result.data
            const columns = []
            const titleMap = {
                dri_dni: 'DNI',
                dri_firts_name: 'Nombres',
                dri_last_name: 'Apellidos',
                dri_qualify: 'Calificación',
                dri_phone: 'Teléfono',
                dri_birthday: 'F. Nacimiento',
                dri_email: 'Email',
                dri_country: 'País',
                dri_state: 'Depto.',
                dri_city: 'Ciudad',
                dri_create_at: 'F. Creación',
                dri_update_at: 'F. Edición',
                sub: 'Sucursal'
            };

            for (const column in result_data[0]) {
                if (column === 'dri_id' || column === 'veh_id' || column === 'veh' || column === 'dri_status' || column === 'com') continue;
                if (column === 'sub') {
                    if (sub_count <= 1) continue;
                    columns.push( {data: column, title: 'Sucursal'} )
                    continue;
                }
                let colTitle = titleMap[column] || (column.charAt(0).toUpperCase() + column.slice(1)).replace("_"," ");
                columns.push( {data: column, title: colTitle} )
            }
            columns.push({data: "actions_buttons", title: "Acciones"})
            //add actions buttons to each row
            //useActionsTableRecord function will return a string with buttons
            for (let i = 0; i < result_data.length; i++) {
                if (result_data[i].dri_id) {
                    result_data[i].actions_buttons = useActionsTableRecord(result_data[i].dri_id);
                }

                // Format dates and sub
                for (const key in result_data[i]) {
                    if (key === 'sub') {
                        result_data[i][key] = sub_map[result_data[i][key]] || result_data[i][key];
                    } else {
                        result_data[i][key] = formatDate(result_data[i][key]);
                    }
                }

                dataForUpdate[result_data[i].dri_id] = result_data[i];
            }
            data.value = {columns: columns, rows: result_data }
            message.value = "Module data have been successfully obtained"
            error.value = res.error;
        }catch(err_catch){
            message.value= "Something was wrong with query process"
        } finally {
            loading.value = false;
        }

    }

    const update = async (id, param_data) => {
        try{
            if (!id || id === '' || id === null || id === undefined) {
                throw Error("ID is required for update operation");
            }
            if (!param_data || Object.keys(param_data).length === 0 || param_data === null || param_data === undefined) {
                throw Error("param_data or body-data is required for update operation");
            }
            loading.value = true;
            error.value = true;
            message.value = '';
            const {token} = useUserLoginStore()
            const res = await driversService.update( id, param_data, {"token":token} )
            if (res.error){
                throw Error(res.result.message)
            }
            message.value = `Record ${id} Updated succesfully.`
            error.value = res.error;
        }catch (err_catch) {
           message.value= "Something was wrong with updating process"
        } finally {
            loading.value = false;
        }
    }

    const remove = async (id) => {
        try{
            loading.value = true;
            const {token} = useUserLoginStore()
            const res = await driversService.remove( id, {"token":token} )
            if (res.error){
                throw Error(res.result.message)
            }
            if (res.error === false) {
                error.value = res.error;
                message.value = `Module data with id ${id} has been successfully deleted`
            }else {
                error.value = res.error;
                message.value = `Module data with id ${id} has not been deleted`
            }
        }catch(err_catch){
            error.value = true;
            message.value= "Something was wrong with removal process"
        } finally {
            loading.value = false;
        }
    }

    return { error, loading, data, dataForUpdate, message, query, save, update, remove }
}