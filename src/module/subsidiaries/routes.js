import Subsidiaries from '@/module/Subsidiaries/views/Subsidiaries.vue'
import  Query from '@/module/Subsidiaries/views/Query.vue'
import Update from '@/module/Subsidiaries/views/Update.vue'


const routesSubsidiaries = [
    {
        path: '/',
        component: Subsidiaries,
        name: 'home'
    },
    {
        path: '/register',
        component: Subsidiaries,
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

export default routesSubsidiaries