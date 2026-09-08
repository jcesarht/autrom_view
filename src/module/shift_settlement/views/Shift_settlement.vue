<template>
    <div class="container">
        <UIHorizontalTabPanel :tabs="tabs"/>
    </div>
</template>
<script setup>
    import UIHorizontalTabPanel from '@/components/UIComponents/UIHorizontalTabPanel.vue';
    import Register from './Register.vue';
    import Query from './Query.vue';
    
    const tabs = [
        {
            id:0,
            label:"Registrar",
            order:1,
            view: Register 
        },
        {
            id:1,
            label:"Consultar",
            order:2,
            view: Query 
        }
    ]
</script>
<style>
</style>