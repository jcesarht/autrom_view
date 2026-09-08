import Provides from '@/module/provides/views/Provides.vue'
import Query from '@/module/provides/views/Query.vue'
import Update from '@/module/provides/views/Update.vue'


const routesProvides = [
    {
        path: '/',
        component: Provides,
        name: 'home'
    },
    {
        path: '/register',
        component: Provides,
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

export default routesProvides
