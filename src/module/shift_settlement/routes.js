import Shift_settlement from '@/module/Shift_settlement/views/Shift_settlement.vue'
import  Query from '@/module/Shift_settlement/views/Query.vue'
import Update from '@/module/Shift_settlement/views/Update.vue'


const routesShift_settlement = [
    {
        path: '/',
        component: Shift_settlement,
        name: 'home'
    },
    {
        path: '/register',
        component: Shift_settlement,
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

export default routesShift_settlement