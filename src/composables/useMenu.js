import { menuService } from "../services/menuService"; 

export async function useGetMenu(){
    let error= true
    let response = {}
    let loading = true
    const fetchMenu = async () => {
        try {
            
            response = await menuService.getMenu()
            error = response.error
        } catch (err) {
            response = {
                error: true,
                message: err.message
            }
        }finally{
            loading = false
        }
    };
    
    await fetchMenu();
    
    return { response, loading ,error, fetchMenu };
}

export async function useSignin(userDataParam){
    let error = false;
    let response = null
    let loading = false
    const userData = userDataParam
    const fetchSignin = async ()=>{
        try {
            if (userData == {}){
                throw Error("Please check the param username")
            }
            loading = true;
            const res = await userLoginService.signin(userData)
            response = {
                data: res.data.data.data,
                error: res.error,
                message: res.data.data.message
            }
        } catch (err) {
            error = true;
            response = {
                error: true,
                message: err.message
            }
        } finally {
            loading = false;
        }
    }

    await fetchSignin()

    return {error, response, loading}
}
