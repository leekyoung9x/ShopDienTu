<template>
  <div class="container mx-auto px-4">
    <!-- Breadcrumb -->
    <div class="py-4">
      <Breadcrumb :model="breadcrumbItems" class="border-none p-0" />
    </div>

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">
        <span class="border-b-4 border-primary-500 pb-2">Sản phẩm</span>
      </h1>
      <p class="mt-3 text-gray-600 max-w-3xl">
        Khám phá các sản phẩm công nghệ mới nhất của chúng tôi. Chúng tôi liên tục cập nhật các mẫu mới nhất từ các thương hiệu hàng đầu thế giới.
      </p>
    </div>

    <!-- Products Grid & Filters -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Filters - Desktop -->
      <div class="hidden lg:block">
        <div class="bg-white rounded-xl shadow-sm p-6 sticky top-28">
          <h3 class="text-lg font-bold mb-6 text-gray-900 border-l-4 border-primary-500 pl-3">Bộ lọc sản phẩm</h3>
          
          <!-- Categories -->
          <div class="mb-6">
            <h4 class="font-semibold mb-3 text-gray-800">Danh mục</h4>
            <div class="flex flex-col space-y-2">
              <div v-for="(category, index) in categories" :key="index"
                class="flex items-center p-2 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <i :class="category.icon" class="text-primary-600"></i>
                </div>
                <span class="text-gray-700">{{ category.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Price Range -->
          <div class="mb-6">
            <h4 class="font-semibold mb-3 text-gray-800">Khoảng giá</h4>
            <div>
              <Slider v-model="priceRange" range :min="0" :max="50000000" :step="100000" class="mt-6" />
              <div class="flex justify-between mt-2">
                <span class="text-gray-600 text-sm">{{ formatPrice(priceRange[0]) }}</span>
                <span class="text-gray-600 text-sm">{{ formatPrice(priceRange[1]) }}</span>
              </div>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <h4 class="font-semibold mb-3 text-gray-800">Thương hiệu</h4>
            <div class="flex flex-col gap-2">
              <div v-for="(brand, index) in brands" :key="index" class="flex items-center">
                <Checkbox :inputId="'brand-' + index" name="brand" :value="brand" v-model="selectedBrands" />
                <label :for="'brand-' + index" class="ml-2 text-gray-700 cursor-pointer">{{ brand }}</label>
              </div>
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="mb-6">
            <h4 class="font-semibold mb-3 text-gray-800">Đánh giá</h4>
            <div class="flex flex-col gap-2">
              <div v-for="n in 5" :key="n" class="flex items-center cursor-pointer hover:text-primary-600">
                <Rating :modelValue="6-n" readonly :cancel="false" />
                <span class="ml-2 text-sm text-gray-600">trở lên</span>
              </div>
            </div>
          </div>
          
          <!-- Apply/Reset Buttons -->
          <!-- Desktop -->
          <div class="flex space-x-3">
            <Button
              label="Áp dụng"
              class="w-full py-3 px-4 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all"
              @click="applyFilters"
            />
            <Button
              label="Đặt lại"
              severity="secondary"
              outlined
              class="w-full py-3 px-4 font-semibold text-gray-700 hover:bg-gray-100 transition-all"
              @click="resetFilters"
            />
          </div>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div class="lg:col-span-3">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden mb-4">
          <Button
            icon="pi pi-filter"
            label="Bộ lọc"
            class="w-full py-3 px-4 font-medium justify-center bg-primary-500 hover:bg-primary-600 text-white transition-all"
          />
        </div>
        
        <ProductGrid ref="productGrid" />
      </div>
    </div>

    <!-- Mobile Filter Sidebar -->
    <Sidebar v-model:visible="showMobileFilter" position="right" class="p-sidebar-md" style="width: 90vw; max-width: 400px;">
      <template #header>
        <h3 class="font-bold text-lg flex items-center">
          <i class="pi pi-filter mr-2"></i>
          Bộ lọc sản phẩm
        </h3>
      </template>
      
      <!-- Categories -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3 text-gray-800">Danh mục</h4>
        <div class="flex flex-col space-y-2">
          <div v-for="(category, index) in categories" :key="index"
            class="flex items-center p-2 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors">
            <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
              <i :class="category.icon" class="text-primary-600"></i>
            </div>
            <span class="text-gray-700">{{ category.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Price Range -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3 text-gray-800">Khoảng giá</h4>
        <div>
          <Slider v-model="priceRange" range :min="0" :max="50000000" :step="100000" class="mt-6" />
          <div class="flex justify-between mt-2">
            <span class="text-gray-600 text-sm">{{ formatPrice(priceRange[0]) }}</span>
            <span class="text-gray-600 text-sm">{{ formatPrice(priceRange[1]) }}</span>
          </div>
        </div>
      </div>

      <!-- Brand Filter -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3 text-gray-800">Thương hiệu</h4>
        <div class="flex flex-col gap-2">
          <div v-for="(brand, index) in brands" :key="index" class="flex items-center">
            <Checkbox :inputId="'mobile-brand-' + index" name="brand" :value="brand" v-model="selectedBrands" />
            <label :for="'mobile-brand-' + index" class="ml-2 text-gray-700 cursor-pointer">{{ brand }}</label>
          </div>
        </div>
      </div>

      <!-- Rating Filter -->
      <div class="mb-6">
        <h4 class="font-semibold mb-3 text-gray-800">Đánh giá</h4>
        <div class="flex flex-col gap-2">
          <div v-for="n in 5" :key="n" class="flex items-center cursor-pointer hover:text-primary-600">
            <Rating :modelValue="6-n" readonly :cancel="false" />
            <span class="ml-2 text-sm text-gray-600">trở lên</span>
          </div>
        </div>
      </div>
      
      <!-- Mobile (Sidebar) -->
      <template #footer>
        <div class="flex space-x-3">
          <Button
            label="Áp dụng"
            class="w-full py-3 px-4 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all"
            @click="applyMobileFilters"
          />
          <Button
            label="Đặt lại"
            severity="secondary"
            outlined
            class="w-full py-3 px-4 font-semibold text-gray-700 hover:bg-gray-100 transition-all"
            @click="resetFilters"
          />
        </div>
      </template>
    </Sidebar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductGrid from '@/components/product/ProductGrid.vue';
import Breadcrumb from 'primevue/breadcrumb';
import Sidebar from 'primevue/sidebar';
import Slider from 'primevue/slider';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Rating from 'primevue/rating';

const router = useRouter();
const route = useRoute();
const productGrid = ref(null);
const showMobileFilter = ref(false);

// Breadcrumb items
const breadcrumbItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Sản phẩm' }
];

// Categories
const categories = [
  { name: 'Điện thoại', icon: 'pi pi-mobile' },
  { name: 'Laptop', icon: 'pi pi-desktop' },
  { name: 'Tablet', icon: 'pi pi-tablet' },
  { name: 'Tai nghe', icon: 'pi pi-volume-up' },
  { name: 'Đồng hồ thông minh', icon: 'pi pi-clock' },
  { name: 'Phụ kiện', icon: 'pi pi-box' }
];

// Brands
const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'Asus'];
const selectedBrands = ref([]);

// Price Range
const priceRange = ref([0, 50000000]);

// Format price to Vietnamese currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Apply filters
const applyFilters = () => {
  if (productGrid.value) {
    // Giả sử productGrid có phương thức applyFilters
    // productGrid.value.applyFilters({
    //   brands: selectedBrands.value,
    //   priceRange: priceRange.value,
    // });
    
    // Trong thực tế, cần phải thêm phương thức này vào component ProductGrid
    console.log('Applying filters:', {
      brands: selectedBrands.value,
      priceRange: priceRange.value
    });
  }
};

// Apply filters from mobile sidebar
const applyMobileFilters = () => {
  showMobileFilter.value = false;
  applyFilters();
};

// Reset filters
const resetFilters = () => {
  selectedBrands.value = [];
  priceRange.value = [0, 50000000];
  
  // Reset filters in ProductGrid component if needed
  // if (productGrid.value) {
  //   productGrid.value.resetFilters();
  // }
};

// Initialize from URL params if any
onMounted(() => {
  if (route.query.search) {
    // Pass search query to ProductGrid
    // This would require modifying ProductGrid to accept a prop
    // Or you can use provide/inject pattern
  }
});
</script>

<style scoped>
/* Custom styling for filter sidebar */
:deep(.p-sidebar-header),
:deep(.p-sidebar-content),
:deep(.p-sidebar-footer) {
  padding: 1.5rem;
}

:deep(.p-sidebar-header) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-sidebar-footer) {
  border-top: 1px solid #e5e7eb;
}

:deep(.p-slider) .p-slider-range {
  background: theme('colors.primary.500');
}

:deep(.p-slider) .p-slider-handle {
  border-color: theme('colors.primary.500');
}

/* Animation for filter sidebar on mobile */
:deep(.p-sidebar) {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
