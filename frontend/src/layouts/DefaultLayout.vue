<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold text-primary-600">
          E-Commerce
        </router-link>

        <div class="flex items-center space-x-4">
          <!-- Navigation Links -->
          <router-link to="/products" class="text-gray-600 hover:text-primary-600">
            Sản phẩm
          </router-link>
          <router-link to="/cart" class="text-gray-600 hover:text-primary-600">
            <i class="pi pi-shopping-cart mr-1"></i>
            Giỏ hàng
          </router-link>
          <router-link to="/orders" class="text-gray-600 hover:text-primary-600">
            Đơn hàng
          </router-link>

          <!-- User Menu -->
          <Menu v-model:popup="userMenuVisible">
            <template #target>
              <button class="flex items-center text-gray-600 hover:text-primary-600">
                <i class="pi pi-user mr-1"></i>
                {{ user?.fullName || 'Tài khoản' }}
                <i class="pi pi-chevron-down ml-1"></i>
              </button>
            </template>
            <template #content>
              <div v-if="user">
                <div @click="navigateTo('/profile')" class="p-3 flex items-center cursor-pointer hover:bg-gray-100">
                  <i class="pi pi-user mr-2"></i>
                  <span>Thông tin tài khoản</span>
                </div>
                <div v-if="isAdmin" @click="navigateTo('/admin')" class="p-3 flex items-center cursor-pointer hover:bg-gray-100">
                  <i class="pi pi-cog mr-2"></i>
                  <span>Quản trị</span>
                </div>
                <hr class="my-2" />
                <div @click="handleLogout" class="p-3 flex items-center cursor-pointer hover:bg-gray-100">
                  <i class="pi pi-power-off mr-2"></i>
                  <span>Đăng xuất</span>
                </div>
              </div>
              <div v-else>
                <div @click="navigateTo('/login')" class="p-3 flex items-center cursor-pointer hover:bg-gray-100">
                  <i class="pi pi-sign-in mr-2"></i>
                  <span>Đăng nhập</span>
                </div>
                <div @click="navigateTo('/register')" class="p-3 flex items-center cursor-pointer hover:bg-gray-100">
                  <i class="pi pi-user-plus mr-2"></i>
                  <span>Đăng ký</span>
                </div>
              </div>
            </template>
          </Menu>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Về chúng tôi</h3>
            <p class="text-gray-400">
              Cung cấp các sản phẩm điện tử chất lượng cao với giá cả hợp lý.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Liên hệ</h3>
            <p class="text-gray-400">
              Email: support@example.com<br>
              Phone: (84) 123-456-789
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Theo dõi</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="pi pi-twitter"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="pi pi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Menu from 'primevue/menu'
// MenuItem và MenuSeparator không tồn tại trong primevue hoặc đường dẫn không đúng
// import MenuItem from 'primevue/menuitem'
// import MenuSeparator from 'primevue/menuseparator'

const router = useRouter()
const authStore = useAuthStore()
const userMenuVisible = ref(false)

const user = computed(() => authStore.user)
const isAdmin = computed(() => user.value?.role === 'admin')

const navigateTo = (path) => {
  userMenuVisible.value = false
  router.push(path)
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
