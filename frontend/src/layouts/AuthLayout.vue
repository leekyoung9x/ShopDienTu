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

        <!-- Footer Links -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          <div class="mt-6">
            <Button
              label="Đăng nhập với Google"
              icon="pi pi-google"
              class="p-button-outlined w-full justify-center"
              @click="handleGoogleLogin"
            />
          </div>
        </div>

        <!-- Additional Links -->
        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm">
            <router-link
              v-if="$route.path === '/login'"
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Chưa có tài khoản? Đăng ký
            </router-link>
            <router-link
              v-else
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Đã có tài khoản? Đăng nhập
            </router-link>
          </div>
          <div class="text-sm">
            <router-link
              to="/forgot-password"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Quên mật khẩu?
            </router-link>
          </div>
        </div>
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
