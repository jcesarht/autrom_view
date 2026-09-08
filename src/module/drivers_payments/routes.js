import Drivers_payments from './views/Drivers_payments.vue';

const routesDriversPayments = [
    {
        path: '/Drivers_payments',
        component: Drivers_payments,
        name: 'drivers_payments',
        meta: {requiresAuth: true},
    }
]

export default routesDriversPayments
