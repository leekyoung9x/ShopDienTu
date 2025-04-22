<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/">
        <h1 class="text-center text-3xl font-bold text-primary-600">
          E-Commerce
        </h1>
      </router-link>
    </div>

    <!-- Auth Card -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
const authStore = useAuthStore()

const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
}
</script>
