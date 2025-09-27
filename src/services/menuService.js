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
                        module_name:"Companies",
                        route:"companies"
                    },
                {
                        id:"2",
                        module_name:"Subsidiaries",
                        route:"subsidiaries"
                    },
                {
                        id:"3",
                        module_name:"Rates_operatives",
                        route:"rates_operatives"
                    },
                {
                        id:"4",
                        module_name:"Owners",
                        route:"owners"
                    },
                {
                        id:"5",
                        module_name:"Vehicles",
                        route:"vehicles"
                    },
                {
                        id:"6",
                        module_name:"Drivers",
                        route:"drivers"
                    },
                {
                        id:"7",
                        module_name:"Shift_settlement",
                        route:"shift_settlement"
                    },
        )
        response.error = false

        return response
    }
}