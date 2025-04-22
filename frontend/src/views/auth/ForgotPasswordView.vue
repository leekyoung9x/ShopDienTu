<template>
  <div class="w-full max-w-md mx-auto">
    <div class="mb-8 text-center">
      <div class="flex justify-center mb-6">
        <div class="bg-primary-50 rounded-full p-4">
          <i class="pi pi-lock-open text-3xl text-primary-500"></i>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">
        Quên mật khẩu?
      </h2>
      <p class="mt-3 text-sm text-gray-600">
        Nhập email của bạn để nhận link đặt lại mật khẩu. 
        Chúng tôi sẽ gửi hướng dẫn khôi phục tới email của bạn.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="relative">
        <span class="p-float-label p-input-icon-left w-full">
          <i class="pi pi-envelope text-gray-500" />
          <InputText
            id="email"
            v-model="email"
            type="email"
            class="w-full p-3 pl-10 rounded-lg border-2 transition-all" 
            :class="{ 
              'border-red-300 focus:border-red-500': error,
              'border-gray-200 focus:border-primary-500': !error 
            }"
            required
          />
          <label for="email" class="text-gray-600">Email</label>
        </span>
        <small v-if="error" class="p-error block mt-2 text-red-500 flex items-center">
          <i class="pi pi-exclamation-circle mr-2"></i>
          {{ error }}
        </small>
      </div>

      <div>
        <Button
          type="submit"
          :label="loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'"
          class="w-full p-3 text-base font-medium shadow-md hover:shadow-lg transition-all"
          :loading="loading"
          :disabled="loading"
        />
      </div>

      <div class="text-center mt-6">
        <router-link 
          to="/login" 
          class="flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Quay lại đăng nhập
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const email = ref('');
const error = ref('');
const loading = ref(false);

// Xóa lỗi khi người dùng chỉnh sửa input
watch(email, () => {
  if (error.value) error.value = '';
});

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
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Implement forgot password API call
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Link đặt lại mật khẩu đã được gửi tới email của bạn',
      life: 5000
    });
    
    // Reset form after success
    email.value = '';
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

<style scoped>
/* Hiệu ứng cho form */
:deep(.p-inputtext:enabled:focus) {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
  border-color: var(--primary-color);
}

:deep(.p-float-label input:focus ~ label),
:deep(.p-float-label input.p-filled ~ label) {
  color: var(--primary-color);
}

/* Animation cho error messages */
.p-error {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hiệu ứng hover cho button */
:deep(.p-button) {
  transition: all 0.2s ease;
}

:deep(.p-button:not(:disabled):hover) {
  transform: translateY(-1px);
}
</style>
