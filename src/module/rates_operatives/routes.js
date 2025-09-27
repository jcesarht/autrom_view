import Rates_operatives from '@/module/Rates_operatives/views/Rates_operatives.vue'
import  Query from '@/module/Rates_operatives/views/Query.vue'
import Update from '@/module/Rates_operatives/views/Update.vue'


const routesRates_operatives = [
    {
        path: '/',
        component: Rates_operatives,
        name: 'home'
    },
    {
        path: '/register',
        component: Rates_operatives,
        name: 'register'
    },
    {
        path:'/query',
        component: Query,
        name: 'query',
    },
    { 
        path:'/update',
        component: Update,
        name: 'update'
    },
]

export default routesRates_operatives