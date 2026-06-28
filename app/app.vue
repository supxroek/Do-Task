<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { useAuth } from './composables/useAuth';

const auth = useAuth()

// ✅ ใช้ onMounted เพื่อไม่ให้ blocking SSR
onMounted(async () => {
  await auth.fetchUser()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster position="top-right" richColors />
  </NuxtLayout>
</template>