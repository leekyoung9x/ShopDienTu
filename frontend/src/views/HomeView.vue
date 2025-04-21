<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-50 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Chào mừng đến với E-Commerce
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              Khám phá các sản phẩm công nghệ chất lượng cao với giá cả hợp lý
            </p>
            <router-link to="/products">
              <Button label="Xem sản phẩm" size="large" />
            </router-link>
          </div>
          <div class="hidden md:block">
            <img 
              src="/images/product-placeholder.jpg" 
              alt="Hero" 
              class="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">
          Sản phẩm nổi bật
        </h2>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Skeleton v-for="i in 4" :key="i" height="350px" class="card" />
        </div>

        <!-- Products grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div class="text-center mt-8">
          <router-link to="/products">
            <Button 
              label="Xem tất cả sản phẩm" 
              severity="secondary" 
              class="p-button-outlined"
            />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <i class="pi pi-truck text-4xl text-primary-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-2">Miễn phí vận chuyển</h3>
            <p class="text-gray-600">Cho đơn hàng từ 500,000đ</p>
          </div>
          <div class="text-center">
            <i class="pi pi-shield text-4xl text-primary-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-2">Bảo hành 12 tháng</h3>
            <p class="text-gray-600">Đổi trả miễn phí trong 30 ngày</p>
          </div>
          <div class="text-center">
            <i class="pi pi-clock text-4xl text-primary-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
            <p class="text-gray-600">Luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import ProductCard from '@/components/product/ProductCard.vue';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';

const productStore = useProductStore();
const loading = ref(true);
const featuredProducts = ref([]);

const fetchFeaturedProducts = async () => {
  try {
    loading.value = true;
    const response = await productStore.fetchProducts({
      limit: 4,
      sort: '-createdAt'
    });
    featuredProducts.value = response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFeaturedProducts);
</script>
