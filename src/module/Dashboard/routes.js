import Dashboard from "./views/Dashboard.vue";
import Shift_settlement from "@/module/Shift_settlement/views/Shift_settlement.vue";
import Drivers from "@/module/Drivers/views/Drivers.vue";
import Vehicles from "@/module/Vehicles/views/Vehicles.vue";
import Owners from "@/module/Owners/views/Owners.vue";
import Rates_operatives from "@/module/Rates_operatives/views/Rates_operatives.vue";
import Subsidiaries from "@/module/Subsidiaries/views/Subsidiaries.vue";
import Companies from "@/module/Companies/views/Companies.vue";

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
                                    
        ]
    }
]

export default routesDashboard