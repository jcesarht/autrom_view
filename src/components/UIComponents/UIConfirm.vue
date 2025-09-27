<template>
    <div class="bg-white border-1 rounded-md w-100" v-if="show">
        <div class="text-center p-4">
            <slot name="message">{{ textContent }}</slot>
        </div>
        <div class="flex justify-end p-2">
            <div class="w-24 mr-1">
                <UIButton @click="confirmation(true)" :bgColor="bgColor" :textButton="buttonYesText" />
            </div>
            <div class="w-24 mr-1">
                <UIButton  @click="confirmation(false)" :textButton="buttonNoText" />
            </div>
        </div>
    </div>  
</template>
<script setup>
import { ref, computed } from 'vue';
import UIButton from '@/components/UIComponents/UIButton.vue';
import { useConfirm } from '../../stores/useUIConfirm';

const modal = useConfirm();
const bgColor = ref('bg-red-400');
const {
    toggletOverlayModal,
    responseConfirm,
    watchShowModal
} = modal;
const show = computed(()=>{
    return modal.watchShowUIConfirm;
});
const confirm = ref(false);
const confirmation = (confirm_param) => {
    responseConfirm(confirm_param); // Call the responseConfirm method with the confirmation status
};

defineProps({
    textContent: {
        type: String,
        default: 'Are you sure?'
    },
    buttonYesText: {
        type: String,
        default: 'Yes'
    },
    buttonNoText: {
        type: String,
        default: 'No'
    }
});
</script>
