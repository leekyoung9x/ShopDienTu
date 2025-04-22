<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg p-2 mr-2">
            <i class="pi pi-bolt text-xl"></i>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 text-transparent bg-clip-text">
            TechZone
          </span>
        </router-link>

        <!-- Search Bar - Hidden on Mobile -->
        <div class="hidden md:block w-1/3 relative">
          <div class="p-input-icon-left p-input-icon-right w-full">
            <i class="pi pi-search text-primary-500" />
            <InputText 
              v-model="searchQuery" 
              placeholder="Tìm kiếm sản phẩm, danh mục..." 
              class="w-full py-2 px-4 pl-10 rounded-full border-2 border-gray-200 focus:border-primary-400 hover:border-primary-300 transition-all shadow-sm"
              @keyup.enter="handleSearch"
            />
            <i v-if="searchQuery" @click="clearSearch" class="pi pi-times text-gray-400 cursor-pointer hover:text-primary-500 transition-colors" />
          </div>
          <!-- Search Suggestions Dropdown (Optional) -->
          <div v-if="showSuggestions && searchSuggestions.length > 0" class="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto z-50">
            <div v-for="(suggestion, index) in searchSuggestions" :key="index" 
                @click="selectSuggestion(suggestion)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
              <i class="pi pi-tag mr-2 text-gray-500"></i>
              <span v-html="highlightMatch(suggestion, searchQuery)"></span>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors">
          <i class="pi pi-bars text-xl"></i>
        </button>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/products" class="nav-link text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center px-3 py-2 hover:bg-gray-50 rounded">
            <i class="pi pi-box mr-2"></i>
            Sản phẩm
          </router-link>
          
          <router-link to="/cart" class="nav-link text-gray-700 hover:text-primary-600 font-medium transition-colors relative flex items-center px-3 py-2 hover:bg-gray-50 rounded">
            <div class="relative">
              <i class="pi pi-shopping-cart mr-2"></i>
              <span v-if="cartTotal > 0" class="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                {{ cartTotal }}
              </span>
            </div>
            <span>Giỏ hàng</span>
          </router-link>
          
          <router-link to="/orders" class="nav-link text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center px-3 py-2 hover:bg-gray-50 rounded">
            <i class="pi pi-list mr-2"></i>
            Đơn hàng
          </router-link>

          <!-- Đăng nhập/Đăng ký hoặc User Menu với Avatar -->
          <div v-if="!user" class="flex items-center space-x-2">
            <router-link to="/login" class="nav-link text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center px-3 py-2 hover:bg-gray-50 rounded">
              <i class="pi pi-sign-in mr-2"></i>
              Đăng nhập
            </router-link>
            <router-link to="/register" class="nav-link bg-primary-50 text-primary-600 hover:bg-primary-100 font-medium transition-colors flex items-center px-3 py-2 rounded-lg">
              <i class="pi pi-user-plus mr-2"></i>
              Đăng ký
            </router-link>
          </div>
          
          <!-- User Menu khi đã đăng nhập -->
          <Menu v-else v-model:popup="userMenuVisible" :model="userMenuItems" class="user-menu">
            <template #target>
              <button class="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors px-2 py-1 rounded-full hover:bg-gray-50">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 mr-2 border-2 border-primary-200">
                  {{ user.fullName.charAt(0) }}
                </div>
                <span class="truncate max-w-[100px]">{{ user.fullName }}</span>
                <i class="pi pi-angle-down ml-1 text-xs"></i>
              </button>
            </template>
          </Menu>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div 
        v-if="mobileMenuOpen" 
        class="md:hidden bg-white border-t border-gray-100 py-3 px-4 shadow-lg"
      >
        <div class="mb-4 relative">
          <div class="p-input-icon-left p-input-icon-right w-full">
            <i class="pi pi-search text-primary-500" />
            <InputText 
              v-model="searchQuery" 
              placeholder="Tìm kiếm sản phẩm, danh mục..." 
              class="w-full py-2 px-4 rounded-lg border-2 border-gray-200 focus:border-primary-400"
              @keyup.enter="handleSearch"
            />
            <i v-if="searchQuery" @click="clearSearch" class="pi pi-times text-gray-400 cursor-pointer hover:text-primary-500 transition-colors" />
          </div>
        </div>

        <div class="flex flex-col space-y-3">
          <router-link to="/products" class="flex items-center py-2 text-gray-700" @click="mobileMenuOpen = false">
            <i class="pi pi-box mr-2"></i>
            <span>Sản phẩm</span>
          </router-link>
          <router-link to="/cart" class="flex items-center py-2 text-gray-700" @click="mobileMenuOpen = false">
            <i class="pi pi-shopping-cart mr-2"></i>
            <span>Giỏ hàng</span>
            <span v-if="cartTotal > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartTotal }}
            </span>
          </router-link>
          <router-link to="/orders" class="flex items-center py-2 text-gray-700" @click="mobileMenuOpen = false">
            <i class="pi pi-list mr-2"></i>
            <span>Đơn hàng</span>
          </router-link>

          <Divider />

          <div v-if="user">
            <div class="py-2 text-gray-700">
              <i class="pi pi-user mr-2"></i>
              <span>{{ user.fullName }}</span>
            </div>
            <div @click="navigateTo('/profile'); mobileMenuOpen = false" class="flex items-center py-2 text-gray-700 cursor-pointer">
              <i class="pi pi-user-edit mr-2"></i>
              <span>Thông tin tài khoản</span>
            </div>
            <div v-if="isAdmin" @click="navigateTo('/admin'); mobileMenuOpen = false" class="flex items-center py-2 text-gray-700 cursor-pointer">
              <i class="pi pi-cog mr-2"></i>
              <span>Quản trị</span>
            </div>
            <div @click="handleLogout(); mobileMenuOpen = false" class="flex items-center py-2 text-red-600 cursor-pointer">
              <i class="pi pi-power-off mr-2"></i>
              <span>Đăng xuất</span>
            </div>
          </div>
          <div v-else>
            <div @click="navigateTo('/login'); mobileMenuOpen = false" class="flex items-center py-2 text-gray-700 cursor-pointer">
              <i class="pi pi-sign-in mr-2"></i>
              <span>Đăng nhập</span>
            </div>
            <div @click="navigateTo('/register'); mobileMenuOpen = false" class="flex items-center py-2 text-gray-700 cursor-pointer">
              <i class="pi pi-user-plus mr-2"></i>
              <span>Đăng ký</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div class="container mx-auto px-4 py-12">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Column 1: About -->
          <div>
            <div class="flex items-center mb-4">
              <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg p-2 mr-2">
                <i class="pi pi-bolt text-xl"></i>
              </div>
              <span class="text-xl font-bold text-white">TechZone</span>
            </div>
            <p class="text-gray-300 mb-4">
              Cung cấp các sản phẩm điện tử chất lượng cao với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <i class="pi pi-facebook text-lg"></i>
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <i class="pi pi-twitter text-lg"></i>
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <i class="pi pi-instagram text-lg"></i>
              </a>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                <i class="pi pi-youtube text-lg"></i>
              </a>
            </div>
          </div>

          <!-- Column 2: Useful Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4 border-l-4 border-primary-500 pl-3">Liên kết hữu ích</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center">
                <i class="pi pi-angle-right mr-2 text-xs"></i> Chính sách bảo hành
              </a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center">
                <i class="pi pi-angle-right mr-2 text-xs"></i> Hướng dẫn mua hàng
              </a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center">
                <i class="pi pi-angle-right mr-2 text-xs"></i> Phương thức thanh toán
              </a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center">
                <i class="pi pi-angle-right mr-2 text-xs"></i> Chính sách đổi trả
              </a></li>
              <li><a href="#" class="text-gray-300 hover:text-white transition-colors flex items-center">
                <i class="pi pi-angle-right mr-2 text-xs"></i> Câu hỏi thường gặp
              </a></li>
            </ul>
          </div>

          <!-- Column 3: Contact -->
          <div>
            <h3 class="text-lg font-semibold mb-4 border-l-4 border-primary-500 pl-3">Liên hệ với chúng tôi</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <i class="pi pi-map-marker mt-1 mr-3 text-primary-400"></i>
                <span class="text-gray-300">123 Đường Công Nghệ, Q.1, TP. Hồ Chí Minh</span>
              </li>
              <li class="flex items-center">
                <i class="pi pi-phone mr-3 text-primary-400"></i>
                <span class="text-gray-300">(+84) 123-456-789</span>
              </li>
              <li class="flex items-center">
                <i class="pi pi-envelope mr-3 text-primary-400"></i>
                <span class="text-gray-300">support@techzone.com</span>
              </li>
              <li class="flex items-center">
                <i class="pi pi-clock mr-3 text-primary-400"></i>
                <span class="text-gray-300">Thứ 2 - Thứ 7: 8:00 - 20:00</span>
              </li>
            </ul>
          </div>

          <!-- Column 4: Newsletter -->
          <div>
            <h3 class="text-lg font-semibold mb-4 border-l-4 border-primary-500 pl-3">Đăng ký nhận tin</h3>
            <p class="text-gray-300 mb-4">
              Nhận thông tin về sản phẩm mới và khuyến mãi hấp dẫn.
            </p>
            <div class="flex flex-col space-y-3">
              <div class="p-inputgroup">
                <InputText placeholder="Nhập email của bạn" class="w-full" v-model="newsletterEmail" />
                <Button icon="pi pi-send" class="p-button-primary" @click="handleNewsletterSubscribe" />
              </div>
              <small class="text-gray-400">Chúng tôi sẽ không gửi spam cho bạn.</small>
            </div>
          </div>
        </div>

        <!-- Copyright Bar -->
        <div class="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>&copy; 2025 TechZone. Tất cả quyền được bảo lưu.</p>
          <div class="flex space-x-4 mt-3 md:mt-0">
            <a href="#" class="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" class="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" class="hover:text-white transition-colors">Trung tâm trợ giúp</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import Menu from 'primevue/menu'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const userMenuVisible = ref(false)
const mobileMenuOpen = ref(false)
const searchQuery = ref('')
const newsletterEmail = ref('')
const showSuggestions = ref(false)
const searchSuggestions = ref([
  'Laptop', 'Điện thoại', 'Tai nghe', 'Phụ kiện', 
  'iPad', 'MacBook', 'Sạc dự phòng', 'Samsung', 'iPhone'
])

const user = computed(() => authStore.user)
const isAdmin = computed(() => user.value?.role === 'admin')
const cartTotal = computed(() => cartStore.totalItems)

// Tự động đóng menu mobile khi chuyển trang
watch(() => router.currentRoute.value.path, () => {
  mobileMenuOpen.value = false
})

// Xử lý việc tìm kiếm
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/products',
      query: { search: searchQuery.value }
    })
    searchQuery.value = ''
    mobileMenuOpen.value = false
    showSuggestions.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  handleSearch()
}

// Theo dõi khi người dùng gõ để hiển thị gợi ý
watch(searchQuery, (newVal) => {
  showSuggestions.value = newVal.length > 0
})

// Hàm highlight text match trong kết quả tìm kiếm
const highlightMatch = (text, query) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<span class="font-bold text-primary-600">$1</span>')
}

// Xử lý đăng ký nhận tin
const handleNewsletterSubscribe = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!newsletterEmail.value) {
    toast.add({ severity: 'warn', summary: 'Lưu ý', detail: 'Vui lòng nhập địa chỉ email', life: 3000 })
    return
  }
  
  if (!emailRegex.test(newsletterEmail.value)) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Email không hợp lệ', life: 3000 })
    return
  }
  
  toast.add({
    severity: 'success',
    summary: 'Đăng ký thành công',
    detail: 'Cảm ơn bạn đã đăng ký nhận tin từ TechZone',
    life: 3000
  })
  newsletterEmail.value = ''
}

// Định nghĩa menu items cho user dropdown
const userMenuItems = computed(() => {
  if (user.value) {
    const items = [
      {
        label: 'Thông tin tài khoản',
        icon: 'pi pi-user',
        command: () => navigateTo('/profile')
      }
    ]
    
    if (isAdmin.value) {
      items.push({
        label: 'Quản trị',
        icon: 'pi pi-cog',
        command: () => navigateTo('/admin')
      })
    }
    
    items.push(
      { separator: true },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-power-off',
        command: handleLogout
      }
    )
    
    return items
  } else {
    return [
      {
        label: 'Đăng nhập',
        icon: 'pi pi-sign-in',
        command: () => navigateTo('/login')
      },
      {
        label: 'Đăng ký',
        icon: 'pi pi-user-plus',
        command: () => navigateTo('/register')
      }
    ]
  }
})

const navigateTo = (path) => {
  userMenuVisible.value = false
  router.push(path)
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.add({
      severity: 'success',
      summary: 'Đăng xuất thành công',
      detail: 'Bạn đã đăng xuất khỏi hệ thống',
      life: 3000
    })
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Có lỗi xảy ra khi đăng xuất',
      life: 3000
    })
  }
}

// Thêm biến trạng thái active cho menu
const isRouteActive = (route) => {
  return router.currentRoute.value.path === route
}

// Đặt tiêu đề trang
onMounted(() => {
  document.title = 'TechZone - Cửa hàng điện tử uy tín' 
})
</script>

<style scoped>
/* Animation cho menu dropdown và hover */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: theme('colors.primary.600');
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Hiệu ứng đổi màu cho các nút bấm */
.user-menu button:hover i {
  color: theme('colors.primary.600');
  transition: color 0.3s ease;
}

/* Hiệu ứng cho mobile menu */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.md\:hidden {
  animation: fadeIn 0.2s ease-out;
}
</style>
