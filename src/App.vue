
<script setup>
  import userLogin from '@/module/userLogin/views/userLogin.vue'
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserLoginStore } from '@/module/UserLogin/stores/useUserLoginStore.js'
  import { useOverlay } from '@/stores/useOverlay';
  import { useConfirm } from '@/stores/useUIConfirm';
  import { useUIMobileMenu } from '@/stores/useUIMobileMenu'; 
  import { useGetMenu } from '@/composables/useMenu';
  import UIConfirm from '@/components/UIComponents/UIConfirm.vue';
  import UIMobileMenu from '@/components/UIComponents/UIMobileMenu.vue';
  import Spinner from '@/components/base/Spinner.vue';

  const showSpinner = ref(false);
  const menuContent = ref([]);
  
  const confirm = useConfirm()
  const mobileMenu = useUIMobileMenu();
  const overlay = useOverlay();
  const { logoutAction } = useUserLoginStore()
  const router = useRouter();
  
  // Computed properties to manage the overlay and spinner visibility
  const showUISpinner = computed(() => {
    return showSpinner.value;
  });

  const showOverlayComputed = computed(() => {
    let show = false;
    if (confirm.watchShowUIConfirm || overlay.watchShowOverlay || mobileMenu.isMobileMenuVisible) {
        if (!confirm.watchShowUIConfirm && !mobileMenu.isMobileMenuVisible) {
            showSpinner.value = true;
        }
        show = true 
    }else {
        show = false
        showSpinner.value = false;
    }

    return show;
  });

  const justify_start = computed(() => {
    return mobileMenu.isMobileMenuVisible ? 'justify-start' : 'justify-center';
  });

  const enableControlHidden = () => {
      if (mobileMenu.isMobileMenuVisible) {
          mobileMenu.hideMobileMenu();
      }
  };
  
  onMounted( async () => {
      //fill the left menu content
      const menu = await useGetMenu()
      if (!menu.error){
          menuContent.value = menu.response.data
      }else{
          menuContent.value = []
      }
      mobileMenu.setMenu(menuContent.value);
      mobileMenu.setFunctionLogout(() => {
          logoutAction()
          router.push({name: 'login'})
          mobileMenu.hideMobileMenu();
      });

      document.querySelector('#overlay_div').addEventListener('scroll', (event) => {
          event.preventDefault();
          event.stopPropagation();
      });
      document.querySelector('#overlay_div').addEventListener('touchmove', (event) => {
              event.preventDefault();
              event.stopPropagation();
          },
          { passive: false }
      );
  });

</script>
  
  <template>
  <div class="relative h-dvh w-dvw">
      <router-view></router-view>
      <div 
          id="overlay_div"
          :class="[
          'fixed inset-0',
          'bg-gray-800/70',
          'z-50',
          'flex items-center',
          justify_start,
          'p-1',
          ]"
      v-show="showOverlayComputed"
      @click="enableControlHidden()"
      >
      <Spinner :show="showUISpinner" />
      <UIConfirm :textContent="confirm.textContentUIConfirm"  />
      <UIMobileMenu 
          :show="mobileMenu.isMobileMenuVisible"
          :menu="menuContent"
          :logoutButton="mobileMenu.getFunctionLogout()"
          @showStatus="(response_emit) => { response_emit ? mobileMenu.showMobileMenu() : mobileMenu.hideMobileMenu() }"
      />
      </div>
  </div>
  </template>
  
<style scoped>
</style>
            