import axios from "axios";

const baseURL = 'http://127.0.0.1:8000' 
let contentType = 'application/json' 
let authToken = ''
let timeOut = 60000
const headerRequest = {
    'Content-Type': contentType
} 
const axiosInstance = axios.create({
    'baseURL': baseURL,
    'headers': headerRequest,
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const error_response = {
            error: true,
            code:"ERR_BAD_REQUEST",
            http_status: 500,
            message:"Error bad request"
        }
        let message=""
        if (!error.response) {
            if (error.code === 'ERR_NETWORK') {
                message = "We have lost the connection. Try again in a few minutes."
            }else if (error.code === 'ECONNABORTED') {
                message = "The request has taken too long. The response was rejected."
            }else if (error.code === 'ERR_BAD_REQUEST'){
                message = "Something was wrong with the request. Please check the information and try again"
            }else if(error.code === 'ERR_BAD_RESPONSE'){
                message = "Something was wrong with the service. We are fixing it as soon as possible"
            }else if (error.code === "ERR_CANCELED"){
                message = "The request has been canceled"
            }else{
                message = "Something went wrong. Try again in a moment or contact to support."
            }

        }else{
            message = error.response?.data?.message ?? error.response?.data?.detail ?? "Unexpected error"
        }
        error_response.code = error.code
        error_response.http_status = error.response?.status ?? 500
        error_response.message = message
        return Promise.reject(error_response)
    }
)

//set header
axiosInstance.setHeader = (header) =>{
    contentType = header['Content-Type']?? contentType
    authToken = header.token?? authToken
    timeOut = header.timeout?? timeOut

    axiosInstance.defaults.headers.common['Authorization'] = 'Token ' + authToken
    axiosInstance.defaults.headers.common['Content-Type'] = contentType
    axiosInstance.defaults.timeout = timeOut
}

axiosInstance.setBaseUrl = (baseUrlParam)=>{
    axiosInstance.baseURL = baseUrlParam
}
//ser baseUrl 
export default axiosInstance