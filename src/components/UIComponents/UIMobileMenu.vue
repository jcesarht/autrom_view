<template>
    <div
        :class="[
            'relative',
            'top-0',
            'w-3/4',
            '-translate-x-full',
            'p-1',
            'h-full',
            'rounded-r-md',
            'shadow-md',
            'bg-white',
            activate ? 'active' : ''
        ]"
        @click.stop
        v-if="showMobileMenu"
    >
        <div class="flex flex-col h-screen ">
            <div class="hidden xs:flex justify-center items-center py-6 sm:py-2 max-h-20 sm:h-16">
                <img src="@/assets/vue.svg" alt="logo" />
            </div>
            <div class="overflow-y-auto">
                <div>
                    <UIMenu 
                        @hideMenu="(responseHideMenu) => { setShowMobileMenu( !responseHideMenu ) }"
                        :data_module="props.menu"
                    />
                </div>
                <div class="flex items-end h-14">
                    <UIButton 
                        textButton="Logout" 
                        :disable="disableButton"
                        @click="props.logoutButton()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import UIMenu from '@/components/UIComponents/UIMenu.vue';
    import UIButton from '@/components/UIComponents/UIButton.vue';

    const activate = ref(false)
    const show = ref(false)

    const props = defineProps({
       
        logoutButton: {
            type: Function,
            default: () => {}
        },
        disableButton: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            default: true
        },
        menu: {
            type: Object,
            default: () => ({})
        }
    });

    
    //modify the show variable to control the visibility of the menu
    const setShowMobileMenu = (value) => {
        show.value = value;
        emit('showStatus', show.value);
    };

    const showMobileMenu = computed(() => {
        activate.value = false
        setShowMobileMenu(props.show);
        if (show.value) {
            menuEffectDelay();
        }

        return props.show;
    });

    const menuEffectDelay = ()=>{
        setTimeout(()=>{
            activate.value = true
        }, 50);
    }

    //define Emits
    const emit = defineEmits(['showStatus']);
    
</script>