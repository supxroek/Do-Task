<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    middleware: 'auth', // Redirect if not logged in
});

const auth = useAuth()
</script>

<template>
    <div>
        <h1>Calendar</h1>
        <p>Welcome {{ auth.user.value?.name || 'User' }}!</p>
    </div>
</template>