export const menuService = {
    async getMenu(){
        const response = {
            "error": true,
            "message": "",
            "data": []
        }
        response.data.push(
                {
                    id:0,
                    module_name:"Dashboard",
                    route:"dashboard"
                },
                {
                    id:"1",
                    module_name:"Tarifas",
                    route:"rates_operatives"
                },
                {
                    id:"2",
                    module_name:"Propietarios",
                    route:"owners"
                },
                {
                    id:"3",
                    module_name:"Vehículos",
                    route:"vehicles"
                },
                {
                    id:"4",
                    module_name:"Conductores",
                    route:"drivers"
                },
                {
                    id:"5",
                    module_name:"Liquidación",
                    route:"shift_settlement"
                },
                {
                    id:"6",
                    module_name:"Gastos Vehículos",
                    route:"vehicle_expenses"
                },
                {
                    id:"7",
                    module_name:"Proveedores",
                    route:"provides"
                },
                {
                    id:"8",
                    module_name:"Depósitos",
                    route:"deposits"
                },
                {
                    id:"9",
                    module_name:"Conductores-Vehículos",
                    route:"drivers_vehicles"
                },
                {
                    id:"10",
                    module_name:"Deudas",
                    route:"drivers_debts"
                },
                {
                    id:"11",
                    module_name:"Abonos",
                    route:"drivers_payments"
                },
        )
        response.error = false

        return response
    }
}