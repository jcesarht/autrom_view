import {subsidiariesService } from "../services/subsidiariesService"; 
import { useUserLoginStore } from "../../userLogin/stores/useUserLoginStore";
import { useActionsTableRecord } from "@/composables/useHelper";
import { ref, reactive } from "vue";

export function useSubSidiarieS(){
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
            const res = await subsidiariesService.save( param_data, {"token":token} )
            if (res.error){
                throw Error(res.result.message)
            }
            
            message.value = "Record "+res.result.data.data.sub_id+" Saved succesfully."
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
            const res = await subsidiariesService.query( filter, {"token":token} )
            if (res.error){
                throw Error(res.result.message)
            }
            const result_data = res.result.data
            const columns = []
            const title = ["Id","Name","Phone","Country","State","City","Postal Address","Expiration Date","Company","Create at","Update at"]
            let index = 0
            for (const column in result_data[0]) {
                columns.push( {data: column,title: title[index]} )
                index++
            }
            columns.push({data: "actions_buttons", title: "Actions"})
            //add actions buttons to each row
            //useActionsTableRecord function will return a string with buttons
            for (let i = 0; i < result_data.length; i++) {
                if (result_data[i].sub_id) {
                    result_data[i].actions_buttons = useActionsTableRecord(result_data[i].sub_id);
                }

                dataForUpdate[result_data[i].sub_id] = result_data[i];
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
            const res = await subsidiariesService.update( id, param_data, {"token":token} )
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
            const res = await subsidiariesService.remove( id, {"token":token} )
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