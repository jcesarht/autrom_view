import Dashboard from "./views/Dashboard.vue";
import Shift_settlement from "@/module/Shift_settlement/views/Shift_settlement.vue";
import Drivers from "@/module/Drivers/views/Drivers.vue";
import Vehicles from "@/module/Vehicles/views/Vehicles.vue";
import Owners from "@/module/Owners/views/Owners.vue";
import Rates_operatives from "@/module/Rates_operatives/views/Rates_operatives.vue";
import Subsidiaries from "@/module/Subsidiaries/views/Subsidiaries.vue";
import Companies from "@/module/Companies/views/Companies.vue";
import Vehicle_expenses from "@/module/vehicle_expenses/views/Vehicle_expenses.vue";
import Provides from "@/module/provides/views/Provides.vue";
import Deposits from "@/module/deposits/views/Deposits.vue";
import Drivers_vehicles from "@/module/drivers_vehicles/views/Drivers_vehicles.vue";
import Drivers_debts from "@/module/drivers_debts/views/Drivers_debts.vue";
import Drivers_payments from "@/module/drivers_payments/views/Drivers_payments.vue";

const routesDashboard = [
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'dashboard',
        meta: {requiresAuth: true},
        children: [
             {
                path: '/Shift_settlement',
                component: Shift_settlement,
                name: 'shift_settlement',
            },
                                    
             {
                path: '/Drivers',
                component: Drivers,
                name: 'drivers',
            },
                                    
             {
                path: '/Vehicles',
                component: Vehicles,
                name: 'vehicles',
            },
                                    
             {
                path: '/Owners',
                component: Owners,
                name: 'owners',
            },
                                    
             {
                path: '/Rates_operatives',
                component: Rates_operatives,
                name: 'rates_operatives',
            },
                                    
             {
                path: '/Subsidiaries',
                component: Subsidiaries,
                name: 'subsidiaries',
            },
                                    
             {
                path: '/Companies',
                component: Companies,
                name: 'companies',
            },

             {
                path: '/Vehicle_expenses',
                component: Vehicle_expenses,
                name: 'vehicle_expenses',
            },

             {
                path: '/Provides',
                component: Provides,
                name: 'provides',
            },

             {
                path: '/Deposits',
                component: Deposits,
                name: 'deposits',
            },

             {
                path: '/Drivers_vehicles',
                component: Drivers_vehicles,
                name: 'drivers_vehicles',
            },

             {
                path: '/Drivers_debts',
                component: Drivers_debts,
                name: 'drivers_debts',
            },

             {
                path: '/Drivers_payments',
                component: Drivers_payments,
                name: 'drivers_payments',
            },
                                    
        ]
    }
]

export default routesDashboard