
import axiosInstance from "@/services/axios.config"

export const ownersService = {
    async save( data , header_param = null) {
        const fields = {}
        for (const [key, value] of Object.entries(data)){
            fields[key] = value
        }
        
        const response={
            error:true, 
            result:{
                http_status: 500,
                message: "",
                data:null
            }
        }

        if (header_param != null){
            axiosInstance.setHeader(header_param)
        }
        try{
            const url_request = 'api/v1/owners_app/'
            response.result.data = await axiosInstance.post(url_request,fields)
            response.result.http_status = response.result.data.data.http_status
            response.result.message = "Responsed successfully in owners service."
            response.error = false

        }catch( error ){
            response.result.http_status = error.http_status ?? 500
            response.result.message = error.message ?? 'Unexpected error'
        }
        
        return response
    },
    async update( id, data , header_param = null) {
        if (!id || id === '' || id === null || id === undefined) {
            throw new Error("ID is required for update operation");
        }
        if (!data || Object.keys(data).length === 0 || data === null || data === undefined) {
            throw new Error("Data is required for update operation");
        }
        const fields = {}
        for (const [key, value] of Object.entries(data)){
            fields[key] = value
        }
        
        const response={
            error:true, 
            result:{
                http_status: 500,
                message: "",
                data:null
            }
        }

        if (header_param != null){
            axiosInstance.setHeader(header_param)
        }
        try{
            const url_request = 'api/v1/owners_app/' + id
            response.result.data = await axiosInstance.put(url_request,fields)
            response.result.http_status = response.result.data.data.http_status
            response.result.data = response.result.data.data.data
            response.result.message = "Responsed successfully in owners service."
            response.error = false

        }catch( error ){
            response.result.http_status = error.http_status ?? 500
            response.result.message = error.message ?? 'Unexpected error'
        }
        
        return response
    },

    async query( data = null , header_param = null) {
        const fields = {}
        
        if (data != null){
            for (const [key, value] of Object.entries(data)){
                fields[key] = value
            }
        }
        
        const response={
            error:true, 
            result:{
                http_status: 500,
                message: "",
                data:null
            }
        }

        if (header_param != null){
            axiosInstance.setHeader(header_param)
        }
        try{
            const url_request = 'api/v1/owners_app/'
            response.result.data = await axiosInstance.get(url_request,fields)
            response.result.http_status = response.result.data.data.http_status
            response.result.data = response.result.data.data.data
            response.result.message = "Responsed successfully in Module"
            response.error = false

        }catch( error ){
            response.result.http_status = error.http_status ?? 500
            response.result.message = error.message ?? 'Unexpected error'
        }
        
        return response
    },
    async remove( id = null , header_param = null) {
        const response={
            error:true, 
            result:{
                http_status: 500,
                message: "",
                data:null
            }
        }
        
        const fields = {}

        if (header_param != null){
            axiosInstance.setHeader(header_param)
        }
        try{
            if (id === null){
                throw new Error("Id is required for removal")
            }            
            const url_request = 'api/v1/owners_app/' + id
            response.result.data = await axiosInstance.delete(url_request,fields)
            response.result.http_status = response.result.data.data.http_status
            response.result.data = response.result.data.data.data
            response.result.message = (id == null) 
                                        ? `Deleted successfully in owners module with id ${id}`
                                        : "Deleted successfully in owners module"
            response.error = false
        }catch( error ){
            response.result.http_status = error.http_status ?? 500
            response.result.message = error.message ?? 'Unexpected error'
        }
        
        return response
    }
}