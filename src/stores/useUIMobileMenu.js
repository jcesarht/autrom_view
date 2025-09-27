import { ref,computed } from 'vue';
import { defineStore } from 'pinia';

export const useUIMobileMenu = defineStore('useUIMobileMenu', () => {
  const smb = ref(false);
  const menu = ref([]);
  const functionLogout = ref(null);

  /**
   * This function is used to show the mobile menu
   * It sets the smb state to true
   * @returns {void}
   * */
  function showMobileMenu() {
    smb.value = true;
  }

  /**
   * This function is used to hide the mobile menu
   * It sets the smb state to false
   * @returns {void}
   * */
  const hideMobileMenu = ()=>{
    smb.value = false;
  }

  /**
   * This computed property returns the current state of the mobile menu
   * @returns {boolean} - The current state of the mobile menu
   * */
  const isMobileMenuVisible = computed(() => {
      return smb.value;
  });
  
  /**
   * This function is used to set the menu state
   * @param {Object} newMenu - The new menu state to set
   * @returns {void}
   * */
  const setMenu = (newMenu) => {
    menu.value = newMenu;
  }

  /**
   * This function is used to get the current menu state
   * @returns {Object} - The current menu state
   */
  const getMenu = computed(() => {
    return menu.value;
  });

  /**
   * This function is used to set the logout function
   * @param {Function} func - The logout function to set
   * @returns {void}
   * */
  const setFunctionLogout = (func) => {
    functionLogout.value = func;
  }

  /**
   * This function is used to get the logout function
   * @return {Function} - The current logout function
   * */
  const getFunctionLogout = () => {
    return functionLogout.value;
  }

  return { isMobileMenuVisible, setMenu,getMenu, showMobileMenu, hideMobileMenu, setFunctionLogout, getFunctionLogout};
});