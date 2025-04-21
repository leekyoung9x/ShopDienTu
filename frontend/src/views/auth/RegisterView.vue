<template>
  <div class="mb-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900">
      Đăng ký tài khoản mới
    </h2>
    <p class="mt-2 text-sm text-gray-600">
      Hoặc
      <router-link 
        to="/login" 
        class="font-medium text-primary-600 hover:text-primary-500"
      >
        đăng nhập nếu đã có tài khoản
      </router-link>
    </p>
  </div>

  <RegisterForm />
</template>

<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue';
</script>
