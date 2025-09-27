import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useConfirm = defineStore('modal',()=>{
    const toggletOverlayModal = ref(false)
    const textContentUIConfirm = ref("Are you sure?")
    let resovelModal = null;
    
    function showUIConfirm (){
        toggletOverlayModal.value = true
    }
    
    function hiddenUIConfirm (){
        toggletOverlayModal.value = false
    }
    
    // This function is used to confirm the modal action
    // It returns a promise that resolves when the modal is confirmed   
    const confirm = () => {
        showUIConfirm()
        return new Promise((resolve) => {
            resovelModal = resolve;
        });
    }
    
    /**
     * This function is used to resolve the modal with a response
     * It is called when the user confirms the modal action 
     * @param {boolean} resp 
     */
    function responseConfirm (resp) {
        if (resovelModal) {
            resovelModal(resp);
            resovelModal = null;
        }
        hiddenUIConfirm();
    }

    const watchShowUIConfirm = computed(()=>{
        return toggletOverlayModal.value
    })

    return { showUIConfirm, hiddenUIConfirm, confirm, responseConfirm, watchShowUIConfirm, textContentUIConfirm }
})