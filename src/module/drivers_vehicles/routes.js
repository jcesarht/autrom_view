import Drivers_vehicles from './views/Drivers_vehicles.vue';

const routesDriversVehicles = [
    {
        path: '/Drivers_vehicles',
        component: Drivers_vehicles,
        name: 'drivers_vehicles',
        meta: {requiresAuth: true},
    }
]

export default routesDriversVehicles
