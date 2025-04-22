<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <div class="space-y-6">
      <div class="relative">
        <span class="p-float-label p-input-icon-left w-full">
          <i class="pi pi-envelope text-gray-500" />
          <InputText
            id="email"
            v-model="form.email"
            type="email"
            class="w-full p-3 pl-10 rounded-lg border-2 transition-all" 
            :class="{ 
              'border-red-300 focus:border-red-500': errors.email,
              'border-gray-200 focus:border-primary-500': !errors.email 
            }"
            required
          />
          <label for="email" class="text-gray-600">Email</label>
        </span>
        <small v-if="errors.email" class="p-error block mt-2 text-red-500 flex items-center">
          <i class="pi pi-exclamation-circle mr-2"></i>
          {{ errors.email }}
        </small>
      </div>

      <div class="relative">
        <span class="p-float-label w-full">
          <Password
            id="password"
            v-model="form.password"
            :feedback="false"
            :class="{ 
              'p-invalid': errors.password,
              'w-full p-inputtext-lg': true
            }"
            toggleMask
            :inputClass="'w-full p-3 pl-10 rounded-lg border-2 transition-all' + 
              (errors.password ? ' border-red-300 focus:border-red-500' : ' border-gray-200 focus:border-primary-500')"
            :inputStyle="'width: 100%;'"
            required
          >
            <template #header>
              <div class="flex items-center justify-between p-3 border-b">
                <h6 class="text-sm font-medium">Mật khẩu</h6>
                <i class="pi pi-lock text-primary-500"></i>
              </div>
            </template>
          </Password>
          <label for="password" class="text-gray-600">Mật khẩu</label>
        </span>
        <small v-if="errors.password" class="p-error block mt-2 text-red-500 flex items-center">
          <i class="pi pi-exclamation-circle mr-2"></i>
          {{ errors.password }}
        </small>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <Checkbox 
          v-model="form.remember" 
          :binary="true"
          id="remember"
          class="scale-110"
        />
        <label for="remember" class="ml-2 text-sm text-gray-600 select-none cursor-pointer">
          Ghi nhớ đăng nhập
        </label>
      </div>
      <router-link to="/forgot-password" class="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
        Quên mật khẩu?
      </router-link>
    </div>

    <div class="space-y-4 pt-2">
      <Button
        type="submit"
        :label="loading ? 'Đang đăng nhập...' : 'Đăng nhập'"
        class="w-full p-3 text-base font-medium shadow-md hover:shadow-lg transition-all"
        :loading="loading"
        :disabled="loading"
      />
      
      <div class="relative flex items-center justify-center mt-4">
        <div class="border-t border-gray-200 flex-grow"></div>
        <span class="text-sm text-gray-500 px-3 bg-white relative">hoặc tiếp tục với</span>
        <div class="border-t border-gray-200 flex-grow"></div>
      </div>
      
      <Button
        type="button"
        class="w-full p-button-outlined flex justify-center items-center p-3 bg-white border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 mr-2" alt="Google" />
        Google
      </Button>
    </div>
    
    <div class="text-center mt-6">
      <span class="text-gray-600">Chưa có tài khoản? </span>
      <router-link to="/register" class="text-primary-600 font-medium hover:text-primary-800 transition-colors">
        Đăng ký ngay
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
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

// Xóa lỗi khi người dùng chỉnh sửa input
watch(() => form.email, () => {
  if (errors.email) errors.email = '';
});

watch(() => form.password, () => {
  if (errors.password) errors.password = '';
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

<style scoped>
/* Hiệu ứng cho form */
:deep(.p-password input) {
  width: 100%;
}

/* Sử dụng style từ App.vue để đảm bảo nhất quán */
:deep(.p-inputtext:enabled:focus) {
  @apply ring-2 ring-primary-500 border-primary-500;
}

:deep(.p-float-label input:focus ~ label),
:deep(.p-float-label input.p-filled ~ label),
:deep(.p-float-label textarea:focus ~ label),
:deep(.p-float-label textarea.p-filled ~ label) {
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
