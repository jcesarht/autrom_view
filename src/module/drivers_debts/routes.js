import Drivers_debts from './views/Drivers_debts.vue';

const routesDriversDebts = [
    {
        path: '/Drivers_debts',
        component: Drivers_debts,
        name: 'drivers_debts',
        meta: {requiresAuth: true},
    }
]

export default routesDriversDebts
