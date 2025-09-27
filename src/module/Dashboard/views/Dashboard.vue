<template>
    <div class="px-2 py-2 sm:px-4 sm:py-5 bg-blue-200 min-h-full ">
        <div class="min-h-full flex w-full ">
            <div class="hidden sm:block w-1/3 rounded-md shadow-md bg-white p-1 mr-3">
                <div class="flex flex-col min-h-full">
                    <div class=" flex justify-center items-center h-20 border-b border-blue-500">
                        <img src="@/assets/vue.svg" alt="logo" />
                    </div>
                    <div class="grow h-full max-h-3/4 mt-3">
                        <UIMenu
                            @hiddeMenu="hiddingMenu"
                            :data_module="menuContent"
                        />
                    </div>
                    <div class="flex items-end w-full">
                        <UIButton 
                            textButton="Logout" 
                            @click="logoutButton"
                            :disable="disableButton"
                        />
                    </div>
                </div> 
            </div>
            <div class="flex flex-col w-full ">
                <div class="grid grid-cols-2 col-span-12 rounded-md shadow-md bg-white px-4 py-2 sm:py-2 h-16 mb-6">
                    <div class="flex justify-start items-center">
                        <Bars3Icon class="
                            sm:hidden
                            self-center
                            size-8
                            sm:size-9
                            text-blue-500
                            hover:text-blue-900
                            cursor-pointer"
                            @click="toggleMobileMenu()"
                        />
                    </div>
                    <div class="flex justify-end items-center">
                        <div class="flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-300 bg-blue-100">
                            <span class="flex justify-center">
                                <UserIcon class="size-6 text-blue-500 cursor-pointer" />
                            </span>
                        </div>
                    </div>
                </div>
                <div class="rounded-md shadow-md bg-white flex-1 px-3 py-3 h-full">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
    //import base library
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    //import composables
    import { UserIcon, Bars3Icon } from '@heroicons/vue/24/solid'
    import UIButton from '@/components/UIComponents/UIButton.vue'
    import UIMenu from '@/components/UIComponents/UIMenu.vue';
    //start import stores
    import {useUserLoginStore} from '@/module/userLogin/stores/useUserLoginStore.js'

    //end import stores
    import { useUIMobileMenu } from '@/stores/useUIMobileMenu.js';
    
    const disableButton = ref(false)
    const router = useRouter()
    const menuContent = ref([])
    const showMenu = ref(false)
    
    //start implement stores function
    const {isAuthenticated, logoutAction, userData} = useUserLoginStore()
    //end implement stores function
    
    //The store is called for blocking the main scroll
    const { showMobileMenu, hideMobileMenu, isMobileMenuVisible, getMenu } = useUIMobileMenu();
     //hidde the menu from click on tab of the menu
    const hiddingMenu = ()=>{
        showMenu.value = false
    }
    

    const logoutButton = ()=>{
        if(!disableButton.value){
            logoutAction()
            router.push({name: 'login'})
        }
    }

   const toggleMobileMenu = ()=>{
        (isMobileMenuVisible.value) ? hideMobileMenu() : showMobileMenu();
        showMenu.value = !showMenu.value
    }

    onMounted( async () => {
        //fill the left menu content
        menuContent.value = getMenu
    })

</script>

<style scoped>
</style>