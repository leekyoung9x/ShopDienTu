<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Thông tin tài khoản</h1>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-6">
      <Skeleton height="150px" />
      <Skeleton height="300px" />
    </div>

    <!-- Profile form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Info -->
      <div class="lg:col-span-2">
        <form @submit.prevent="saveProfile" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            Chỉnh sửa thông tin
          </h2>

          <div class="space-y-6">
            <div class="mb-6">
              <span class="p-float-label w-full">
                <InputText id="fullName" v-model="form.fullName" class="w-full"
                  :class="{ 'p-invalid': errors.fullName }" />
                <label for="fullName">Họ và tên</label>
              </span>
              <small v-if="errors.fullName" class="p-error block mt-2 text-red-500">{{ errors.fullName }}</small>
            </div>

            <div class="mb-6">
              <span class="p-float-label w-full">
                <InputText id="email" v-model="form.email" type="email" class="w-full" disabled />
                <label for="email">Email</label>
              </span>
              <small class="block mt-2 text-gray-500">Email không thể thay đổi</small>
            </div>

            <div class="mb-6">
              <span class="p-float-label w-full">
                <InputText id="phone" v-model="form.phone" class="w-full" :class="{ 'p-invalid': errors.phone }" />
                <label for="phone">Số điện thoại</label>
              </span>
              <small v-if="errors.phone" class="p-error block mt-2 text-red-500">{{ errors.phone }}</small>
            </div>

            <div class="mb-6">
              <span class="p-float-label w-full">
                <Textarea id="address" v-model="form.address" rows="3" class="w-full"
                  :class="{ 'p-invalid': errors.address }" />
                <label for="address">Địa chỉ</label>
              </span>
              <small v-if="errors.address" class="p-error block mt-2 text-red-500">{{ errors.address }}</small>
            </div>

            <div class="flex justify-end space-x-4">
              <!-- Hủy -->
              <Button type="button" label="Hủy" severity="secondary" outlined
                class="px-6 py-2 font-medium text-gray-700 border-gray-300 hover:bg-gray-100 transition-all" />

              <!-- Lưu thay đổi -->
              <Button type="submit" label="Lưu thay đổi" :loading="saving"
                class="px-6 py-2 font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all" />

            </div>
          </div>
        </form>
      </div>

      <!-- Change Password -->
      <div class="lg:col-span-1">
        <form @submit.prevent="changePassword" class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            Đổi mật khẩu
          </h2>

          <div class="space-y-4">
            <div class="mb-4">
              <span class="p-float-label w-full">
                <Password id="currentPassword" v-model="passwordForm.currentPassword" :feedback="false" toggleMask
                  class="w-full" :class="{ 'p-invalid': errors.currentPassword }" inputClass="w-full" />
                <label for="currentPassword">Mật khẩu hiện tại</label>
              </span>
              <small v-if="errors.currentPassword" class="p-error block mt-2 text-red-500">{{ errors.currentPassword
              }}</small>
            </div>

            <div class="mb-4">
              <span class="p-float-label w-full">
                <Password id="newPassword" v-model="passwordForm.newPassword" toggleMask class="w-full"
                  :class="{ 'p-invalid': errors.newPassword }" inputClass="w-full" />
                <label for="newPassword">Mật khẩu mới</label>
              </span>
              <small v-if="errors.newPassword" class="p-error block mt-2 text-red-500">{{ errors.newPassword }}</small>
            </div>

            <div class="mb-4">
              <span class="p-float-label w-full">
                <Password id="confirmPassword" v-model="passwordForm.confirmPassword" :feedback="false" toggleMask
                  class="w-full" :class="{ 'p-invalid': errors.confirmPassword }" inputClass="w-full" />
                <label for="confirmPassword">Xác nhận mật khẩu mới</label>
              </span>
              <small v-if="errors.confirmPassword" class="p-error block mt-2 text-red-500">{{ errors.confirmPassword
              }}</small>
            </div>

            <Button type="submit" label="Đổi mật khẩu" :loading="changingPassword"
              class="w-full px-6 py-3 font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all" />

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Password from 'primevue/password';
import Skeleton from 'primevue/skeleton';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const toast = useToast();

const loading = ref(false);
const saving = ref(false);
const changingPassword = ref(false);

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  address: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const errors = reactive({
  fullName: '',
  phone: '',
  address: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const resetForm = () => {
  const user = authStore.user;
  if (!user) return; // Bảo vệ khỏi truy cập null
  
  form.fullName = user.fullName || '';
  form.email = user.email || '';
  form.phone = user.phone || '';
  form.address = user.address || '';
};

const validateForm = () => {
  let isValid = true;
  errors.fullName = '';
  errors.phone = '';
  errors.address = '';

  if (!form.fullName) {
    errors.fullName = 'Họ và tên là bắt buộc';
    isValid = false;
  }

  if (form.phone && !/^[0-9]{10,11}$/.test(form.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
    isValid = false;
  }

  return isValid;
};

const validatePasswordForm = () => {
  let isValid = true;
  errors.currentPassword = '';
  errors.newPassword = '';
  errors.confirmPassword = '';

  if (!passwordForm.currentPassword) {
    errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
    isValid = false;
  }

  if (!passwordForm.newPassword) {
    errors.newPassword = 'Mật khẩu mới là bắt buộc';
    isValid = false;
  } else if (passwordForm.newPassword.length < 6) {
    errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  if (!passwordForm.confirmPassword) {
    errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    isValid = false;
  }

  return isValid;
};

const saveProfile = async () => {
  if (!validateForm()) return;

  try {
    saving.value = true;
    await authStore.updateProfile(form);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Thông tin tài khoản đã được cập nhật',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Không thể cập nhật thông tin',
      life: 3000
    });
  } finally {
    saving.value = false;
  }
};

const changePassword = async () => {
  if (!validatePasswordForm()) return;

  try {
    changingPassword.value = true;
    await authStore.changePassword(passwordForm);

    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Mật khẩu đã được thay đổi',
      life: 3000
    });

    // Reset password form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Không thể thay đổi mật khẩu',
      life: 3000
    });
  } finally {
    changingPassword.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await authStore.fetchUser(); // Đợi thông tin người dùng được tải xong
    resetForm();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
});
</script>
