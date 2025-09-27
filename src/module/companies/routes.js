import Companies from '@/module/Companies/views/Companies.vue'
import  Query from '@/module/Companies/views/Query.vue'
import Update from '@/module/Companies/views/Update.vue'


const routesCompanies = [
    {
        path: '/',
        component: Companies,
        name: 'home'
    },
    {
        path: '/register',
        component: Companies,
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

export default routesCompanies