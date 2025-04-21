<template>
  <div class="mb-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900">
      Đăng nhập vào tài khoản
    </h2>
    <p class="mt-2 text-sm text-gray-600">
      Hoặc
      <router-link 
        to="/register" 
        class="font-medium text-primary-600 hover:text-primary-500"
      >
        đăng ký tài khoản mới
      </router-link>
    </p>
  </div>

  <LoginForm />
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue';
</script>
