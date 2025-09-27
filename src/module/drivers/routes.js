import Drivers from '@/module/Drivers/views/Drivers.vue'
import  Query from '@/module/Drivers/views/Query.vue'
import Update from '@/module/Drivers/views/Update.vue'


const routesDrivers = [
    {
        path: '/',
        component: Drivers,
        name: 'home'
    },
    {
        path: '/register',
        component: Drivers,
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

export default routesDrivers