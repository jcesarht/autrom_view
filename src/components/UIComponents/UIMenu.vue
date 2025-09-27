<template>
    <ul class="mt-1">
        <router-link :to="{name: mod.route}" v-for="mod in modules" :key="`module_${mod.id}`" >
            <div 
                :class="
                [
                    bgColor,
                    bgHoverColor,
                    textColor,
                    cursorPoint,
                    'mb-1',
                    'px-3 py-3',
                    'rounded-md',
                ]"

                @click="emitShowMenu()"
            >
                {{ mod.module_name }} {{ mod.id >= 9 ? '>':''}}
            </div>
        </router-link>
    </ul>
</template>

<script setup>
import { computed, ref } from 'vue';
    const showMenu = ref(false)

    const props = defineProps(
        {
            'disable':{
                type: Boolean,
                default: false
            },
            'data_module':{
                type: Array,
                default: ()=>{
                    return []
                }
            }
        },
    )
    
    const bgColor = computed(()=>{
        return (!props.disable)? 'bg-blue-50' : 'bg-gray-200' 
    })
    const bgHoverColor = computed(()=>{
        return (!props.disable)? 'hover:bg-blue-300 hover:text-white' : '' 
    })
    const textColor = computed(()=>{
        return (!props.disable)? 'text-blue-500' : 'text-neutral-400' 
    })
    const cursorPoint = computed(()=>{
        return (!props.disable)? 'cursor-pointer' : 'cursor-not-allowed' 
    })
    
    const emit = defineEmits(['hideMenu'])
    const modules = computed(() => {
        return props.data_module.filter(
            module =>
                    module 
                    && typeof module.id !== 'undefined' 
                    && typeof module.module_name !== 'undefined' 
                    && typeof module.route !== 'undefined'
        )
    })
    
    const emitShowMenu = ()=>{
        emit('hideMenu',true)
    }
</script>
<style lang="scss" scoped>
</style>