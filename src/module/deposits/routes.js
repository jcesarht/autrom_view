import Deposits from './views/Deposits.vue';

const routesDeposits = [
    {
        path: '/Deposits',
        component: Deposits,
        name: 'deposits',
        meta: {requiresAuth: true},
    }
]

export default routesDeposits
