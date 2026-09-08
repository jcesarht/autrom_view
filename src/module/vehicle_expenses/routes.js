import Vehicle_expenses from './views/Vehicle_expenses.vue';

const routesVehicleExpenses = [
    {
        path: '/Vehicle_expenses',
        component: Vehicle_expenses,
        name: 'vehicle_expenses',
        meta: {requiresAuth: true},
    }
]

export default routesVehicleExpenses
