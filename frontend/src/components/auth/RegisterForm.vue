<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-5">
      <div class="relative">
        <span class="p-float-label p-input-icon-left w-full">
          <i class="pi pi-user text-gray-500" />
          <InputText
            id="fullName"
            v-model="form.fullName"
            type="text"
            class="w-full p-3 pl-10 rounded-lg border-2 transition-all" 
            :class="{ 
              'border-red-300 focus:border-red-500': errors.fullName,
              'border-gray-200 focus:border-primary-500': !errors.fullName 
            }"
            required
          />
          <label for="fullName" class="text-gray-600">Họ và tên</label>
        </span>
        <small v-if="errors.fullName" class="p-error block mt-2 text-red-500 flex items-center">
          <i class="pi pi-exclamation-circle mr-2"></i>
          {{ errors.fullName }}
        </small>
      </div>

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
            :feedback="true"
            :class="{ 
              'p-invalid': errors.password,
              'w-full p-inputtext-lg': true
            }"
            :inputClass="'w-full p-3 pl-10 rounded-lg border-2 transition-all' + 
              (errors.password ? ' border-red-300 focus:border-red-500' : ' border-gray-200 focus:border-primary-500')"
            :inputStyle="'width: 100%;'"
            toggleMask
            required
          >
            <template #header>
              <div class="flex items-center justify-between p-3 border-b">
                <h6 class="text-sm font-medium">Mật khẩu của bạn</h6>
                <i class="pi pi-lock text-primary-500"></i>
              </div>
            </template>
            <template #footer>
              <div class="p-3">
                <p class="text-xs text-gray-500">Mật khẩu phải có ít nhất:</p>
                <ul class="text-xs text-gray-500 list-disc pl-4 mt-1">
                  <li>6 ký tự</li>
                  <li>Một chữ cái viết hoa</li>
                  <li>Một số</li>
                </ul>
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

      <div class="relative">
        <span class="p-float-label w-full">
          <Password
            id="confirmPassword"
            v-model="form.confirmPassword"
            :feedback="false"
            :class="{ 
              'p-invalid': errors.confirmPassword,
              'w-full p-inputtext-lg': true
            }"
            :inputClass="'w-full p-3 pl-10 rounded-lg border-2 transition-all' + 
              (errors.confirmPassword ? ' border-red-300 focus:border-red-500' : ' border-gray-200 focus:border-primary-500')"
            :inputStyle="'width: 100%;'"
            toggleMask
            required
          />
          <label for="confirmPassword" class="text-gray-600">Xác nhận mật khẩu</label>
        </span>
        <small v-if="errors.confirmPassword" class="p-error block mt-2 text-red-500 flex items-center">
          <i class="pi pi-exclamation-circle mr-2"></i>
          {{ errors.confirmPassword }}
        </small>
      </div>
    </div>

    <div class="space-y-4 pt-4">
      <Button
        type="submit"
        :label="loading ? 'Đang đăng ký...' : 'Đăng ký'"
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
      <span class="text-gray-600">Đã có tài khoản? </span>
      <router-link to="/login" class="text-primary-600 font-medium hover:text-primary-800 transition-colors">
        Đăng nhập
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Password from 'primevue/password';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
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

// Xóa lỗi khi người dùng chỉnh sửa input
watch(() => form.fullName, () => {
  if (errors.fullName) errors.fullName = '';
});

watch(() => form.email, () => {
  if (errors.email) errors.email = '';
});

watch(() => form.password, () => {
  if (errors.password) errors.password = '';
});

watch(() => form.confirmPassword, () => {
  if (errors.confirmPassword) errors.confirmPassword = '';
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
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = 'Họ và tên quá ngắn';
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
      detail: 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.',
      life: 5000
    });

    router.push('/login');
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

<style scoped>
/* Hiệu ứng cho form */
:deep(.p-password input) {
  width: 100%;
}

:deep(.p-password-panel) {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

:deep(.p-password-meter) {
  margin-top: 0;
  height: 6px;
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
