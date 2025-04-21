<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="fullName" class="form-label">Họ và tên</label>
      <input
        id="fullName"
        v-model="form.fullName"
        type="text"
        class="form-input"
        :class="{ 'border-red-500': errors.fullName }"
        required
      />
      <p v-if="errors.fullName" class="error-text">{{ errors.fullName }}</p>
    </div>

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
        :feedback="true"
        toggleMask
        required
      />
      <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
    </div>

    <div>
      <label for="confirmPassword" class="form-label">Xác nhận mật khẩu</label>
      <Password
        id="confirmPassword"
        v-model="form.confirmPassword"
        :class="{ 'p-invalid': errors.confirmPassword }"
        :feedback="false"
        toggleMask
        required
      />
      <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
    </div>

    <div class="space-y-4">
      <Button
        type="submit"
        label="Đăng ký"
        class="w-full"
        :loading="loading"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(false);
const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validateForm = () => {
  let isValid = true;
  errors.fullName = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!form.fullName) {
    errors.fullName = 'Họ và tên là bắt buộc';
    isValid = false;
  }

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
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    const { confirmPassword, ...registerData } = form;
    await authStore.register(registerData);
    
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đăng ký thành công',
      life: 3000
    });

    router.push('/');
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Đăng ký thất bại',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>
