import Vehicles from '@/module/Vehicles/views/Vehicles.vue'
import  Query from '@/module/Vehicles/views/Query.vue'
import Update from '@/module/Vehicles/views/Update.vue'


const routesVehicles = [
    {
        path: '/',
        component: Vehicles,
        name: 'home'
    },
    {
        path: '/register',
        component: Vehicles,
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

export default routesVehicles