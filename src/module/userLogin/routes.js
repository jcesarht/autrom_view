import userLogin from '@/module/userLogin/views/userLogin.vue'
import PasswordRecovery from '@/module/userLogin/views/PasswordRecovery.vue'
import SigninUser from '@/module/userLogin/views/SigninUser.vue'


const routesLoginUser = [
    {
        path: '/',
        component: userLogin,
        name: 'home'
    },
    {
        path: '/login',
        component: userLogin,
        name: 'login'
    },
    {
        path:'/password_recovery',
        component: PasswordRecovery,
        name: 'password_recovery',
    },
    { 
        path:'/signin',
        component: SigninUser,
        name: 'signin'
    },
]

export default routesLoginUser