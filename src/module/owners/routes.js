import Owners from '@/module/Owners/views/Owners.vue'
import  Query from '@/module/Owners/views/Query.vue'
import Update from '@/module/Owners/views/Update.vue'


const routesOwners = [
    {
        path: '/',
        component: Owners,
        name: 'home'
    },
    {
        path: '/register',
        component: Owners,
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

export default routesOwners