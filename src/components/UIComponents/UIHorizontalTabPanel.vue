<template>
    <div class="h-full w-full">
        <div class="flex">
            <div 
                v-for="tab in tabs" 
                :key="tab.id"
                :class="[
                    'bg-blue-50',
                    'p-2',
                    'border-b-2',
                    'border-b-blue-300',
                    'text-blue-400',
                    'cursor-pointer',
                    {active: selectedTab == tab.id}
                    ]"
                @click="selectedTab = tab.id"
            >
                <span>{{ tab.label }}</span>
            </div>
        </div>
        <div 
            v-for="tab in tabs"
            :key="'content_' + tab.id"
            :class="[
                'mt-1',
                'h-full',
                'w-full',
                'p-2',
                'rounded-sm',
                'bg-blue-50',
                {hidden: selectedTab != tab.id}
            ]
            "
        >
             <component :is="tab.view" />
        </div>
    </div>
</template>
<script setup>
    import {ref,defineProps} from 'vue'
    const selectedTab = ref(0)
    
    const propsComponent = defineProps(
        {
            'tabs':{
                type: Array,
                default: []
            }
        });
</script>
<style scoped >
    .active {
        border-bottom-width: 4px;
        border-bottom-color: #2b7fff;
        color: #2b7fff;
        font-weight: 600;
    }
    .hidden {
        display: none;
    }
</style>