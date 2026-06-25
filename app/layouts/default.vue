<script setup lang="ts">
import Sidebar from '~/components/sidebar.vue';

</script>

<template>
    <div>
        <Navbar />
        <Sidebar />
        <slot />
    </div>
</template>