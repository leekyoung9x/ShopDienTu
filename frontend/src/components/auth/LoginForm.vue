<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="form-input"
        :class="{ 'border-red-500': errors.email }"
        required
      />
      <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="form-label">Mật khẩu</label>
      <Password
        id="password"
        v-model="form.password"
        :class="{ 'p-invalid': errors.password }"
        :feedback="false"
        toggleMask
        required
      />
      <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <Checkbox 
          v-model="form.remember" 
          :binary="true"
          id="remember"
        />
        <label for="remember" class="ml-2 text-sm text-gray-600">
          Ghi nhớ đăng nhập
        </label>
      </div>
    </div>

    <div class="space-y-4">
      <Button
        type="submit"
        label="Đăng nhập"
        class="w-full"
        :loading="loading"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(false);
const form = reactive({
  email: '',
  password: '',
  remember: false
});
const errors = reactive({
  email: '',
  password: ''
});

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email là bắt buộc';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email không hợp lệ';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Mật khẩu là bắt buộc';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    await authStore.login(form);
    
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đăng nhập thành công',
      life: 3000
    });

    // Redirect to intended page or home
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Đăng nhập thất bại',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>
