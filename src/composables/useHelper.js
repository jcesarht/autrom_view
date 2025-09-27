export function useActionsTableRecord(key_id){
    let error= true
    const button_setup = {
        edit: {
            title: "Edit",
            class: "btn btn-info datatable-action-edit mb-1 w-full sm:w-auto",
            key_id: key_id
        },
        delete: {
            title: "Delete",
            class: "btn btn-danger datatable-action-delete mb-1 w-full sm:w-auto",
            key_id: key_id
        }
    }

    function actionButton(button) {
        return ` <button 
            class="${button.class}" 
            data-id="${button.key_id}"
            > 
                ${button.title} 
            </button>`;
    }
    
    const buttons = actionButton(button_setup.edit) + actionButton(button_setup.delete);
    
    return buttons;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}