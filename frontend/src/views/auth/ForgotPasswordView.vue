<template>
  <div class="mb-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900">
      Quên mật khẩu?
    </h2>
    <p class="mt-2 text-sm text-gray-600">
      Nhập email của bạn để nhận link đặt lại mật khẩu
    </p>
  </div>

  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="form-input"
        :class="{ 'border-red-500': error }"
        required
      />
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>

    <div class="flex items-center justify-between">
      <router-link 
        to="/login" 
        class="text-sm font-medium text-primary-600 hover:text-primary-500"
      >
        Quay lại đăng nhập
      </router-link>
    </div>

    <div>
      <Button
        type="submit"
        label="Gửi link đặt lại mật khẩu"
        class="w-full"
        :loading="loading"
      />
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const email = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  
  if (!email.value) {
    error.value = 'Email là bắt buộc';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Email không hợp lệ';
    return;
  }

  try {
    loading.value = true;
    // TODO: Implement forgot password API call
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Link đặt lại mật khẩu đã được gửi tới email của bạn',
      life: 5000
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: err.message || 'Có lỗi xảy ra',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>
