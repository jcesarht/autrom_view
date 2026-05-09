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

export function formatDate(dateString) {
    if (!dateString || typeof dateString !== 'string') return dateString;
    
    // Check if it looks like an ISO date string
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (!isoDatePattern.test(dateString)) return dateString;

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
        return dateString;
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}