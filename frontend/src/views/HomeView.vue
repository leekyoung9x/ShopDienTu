<template>
  <div>
    <!-- Hero Carousel Section -->
    <section class="mb-12">
      <Carousel :value="bannerItems" :numVisible="1" :numScroll="1" :circular="true" :autoplayInterval="5000">
        <template #item="slotProps">
          <div class="relative">
            <img :src="slotProps.data.image" :alt="slotProps.data.title" class="w-full h-[500px] object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent flex flex-col justify-center">
              <div class="container mx-auto px-6 md:px-12">
                <div class="max-w-xl">
                  <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{{ slotProps.data.title }}</h2>
                  <p class="text-lg md:text-xl text-white/90 mb-8">{{ slotProps.data.description }}</p>
                  <router-link :to="slotProps.data.buttonLink">
                    <Button :label="slotProps.data.buttonText" size="large" class="shadow-lg hover:scale-105 transition-transform" />
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Carousel>
    </section>

    <!-- Categories Section -->
    <section class="py-12 bg-slate-50 rounded-xl mb-12">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            <span class="border-b-4 border-primary-500 pb-2">Danh Mục Sản Phẩm</span>
          </h2>
          <router-link to="/products" class="text-primary-600 hover:text-primary-800 transition-colors font-medium">
            Xem tất cả <i class="pi pi-arrow-right ml-1"></i>
          </router-link>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div v-for="(category, index) in categories" :key="index" 
              class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 text-center cursor-pointer transform hover:-translate-y-1 transition-transform group">
            <div class="rounded-full bg-primary-50 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
              <i :class="category.icon" class="text-2xl text-primary-600"></i>
            </div>
            <h3 class="font-semibold text-gray-800">{{ category.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-12 mb-12">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            <span class="border-b-4 border-primary-500 pb-2">Sản Phẩm Nổi Bật</span>
          </h2>
          <router-link to="/products" class="text-primary-600 hover:text-primary-800 transition-colors font-medium">
            Xem tất cả <i class="pi pi-arrow-right ml-1"></i>
          </router-link>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Skeleton v-for="i in 4" :key="i" height="350px" class="rounded-xl" />
        </div>

        <!-- Products grid -->
        <div v-else>
          <Carousel :value="featuredProducts" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions">
            <template #item="slotProps">
              <div class="p-2">
                <ProductCard :product="slotProps.data" class="shadow-md" />
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="py-12 mb-12 bg-white rounded-xl">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          <span class="border-b-4 border-primary-500 pb-2">Thương Hiệu Nổi Tiếng</span>
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
          <div v-for="(brand, index) in brands" :key="index" class="bg-white p-4 rounded-lg flex items-center justify-center">
            <div class="flex flex-col items-center space-y-3 filter grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <i :class="brand.icon" class="text-4xl text-gray-700"></i>
              <span class="font-medium text-gray-800">{{ brand.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl mb-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          <span class="border-b-4 border-primary-500 pb-2">Tại sao chọn chúng tôi?</span>
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-md text-center transform transition-transform hover:-translate-y-2">
            <div class="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="pi pi-truck text-4xl text-primary-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Miễn phí vận chuyển</h3>
            <p class="text-gray-600">Miễn phí vận chuyển cho đơn hàng từ 500,000đ trên toàn quốc.</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md text-center transform transition-transform hover:-translate-y-2">
            <div class="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="pi pi-shield text-4xl text-primary-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Bảo hành 12 tháng</h3>
            <p class="text-gray-600">Tất cả sản phẩm đều được bảo hành 12 tháng và đổi trả miễn phí trong 30 ngày.</p>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md text-center transform transition-transform hover:-translate-y-2">
            <div class="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="pi pi-clock text-4xl text-primary-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Hỗ trợ 24/7</h3>
            <p class="text-gray-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-12 mb-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">
          <span class="border-b-4 border-primary-500 pb-2">Khách hàng nói gì về chúng tôi</span>
        </h2>

        <Carousel :value="testimonials" :numVisible="1" :numScroll="1" :circular="true">
          <template #item="slotProps">
            <div class="p-4">
              <div class="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                <div class="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 mb-4">
                  <img :src="slotProps.data.avatar" alt="Avatar" class="w-full h-full object-cover" />
                </div>
                <Rating :modelValue="slotProps.data.rating" readonly :cancel="false" class="mb-4" />
                <p class="text-gray-600 italic text-center mb-4">{{ slotProps.data.comment }}</p>
                <h4 class="font-semibold text-lg">{{ slotProps.data.name }}</h4>
                <p class="text-gray-500 text-sm">{{ slotProps.data.title }}</p>
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl text-white mb-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Đăng ký thành viên để nhận ưu đãi đặc biệt</h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên khi bạn đăng ký thành viên mới.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/register">
            <Button label="Đăng ký ngay" size="large" class="px-8 shadow-lg" />
          </router-link>
          <router-link to="/products">
            <Button label="Xem sản phẩm" severity="secondary" outlined class="px-8 text-white border-white hover:bg-white hover:text-primary-700" />
          </router-link>
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
import Carousel from 'primevue/carousel';
import Rating from 'primevue/rating';

const productStore = useProductStore();
const loading = ref(true);
const featuredProducts = ref([]);

// Responsive options for carousel
const responsiveOptions = [
    {
        breakpoint: '1280px',
        numVisible: 4,
        numScroll: 1
    },
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '640px',
        numVisible: 1,
        numScroll: 1
    }
];

// Hero banner items
const bannerItems = [
  {
    title: 'Công Nghệ Mới Nhất',
    description: 'Khám phá các sản phẩm công nghệ hàng đầu với giá cả hợp lý',
    image: '/images/macbook-pro.jpg',
    buttonText: 'Mua ngay',
    buttonLink: '/products'
  },
  {
    title: 'iPhone 14 Pro',
    description: 'Trải nghiệm sức mạnh vượt trội của dòng iPhone mới nhất',
    image: '/images/iphone-14-pro.jpg',
    buttonText: 'Xem chi tiết',
    buttonLink: '/products'
  },
  {
    title: 'Phụ Kiện Cao Cấp',
    description: 'Nâng tầm trải nghiệm của bạn với các phụ kiện chất lượng cao',
    image: '/images/airpods-pro.jpg',
    buttonText: 'Mua sắm ngay',
    buttonLink: '/products'
  }
];

// Categories
const categories = [
  { name: 'Điện thoại', icon: 'pi pi-mobile' },
  { name: 'Laptop', icon: 'pi pi-desktop' },
  { name: 'Tablet', icon: 'pi pi-tablet' },
  { name: 'Tai nghe', icon: 'pi pi-volume-up' },
  { name: 'Đồng hồ', icon: 'pi pi-clock' },
  { name: 'Phụ kiện', icon: 'pi pi-box' }
];

// Brands
const brands = [
  { name: 'Apple', icon: 'pi pi-apple' },
  { name: 'Samsung', icon: 'pi pi-android' },
  { name: 'Sony', icon: 'pi pi-camera' },
  { name: 'Dell', icon: 'pi pi-desktop' },
  { name: 'Asus', icon: 'pi pi-laptop' },
  { name: 'Microsoft', icon: 'pi pi-microsoft' }
];

// Testimonials
const testimonials = [
  {
    name: 'Nguyễn Văn A',
    title: 'Khách hàng thân thiết',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Tôi rất hài lòng với chất lượng sản phẩm và dịch vụ chăm sóc khách hàng tuyệt vời. Sẽ mua hàng ở đây nhiều lần nữa!'
  },
  {
    name: 'Trần Thị B',
    title: 'Khách hàng mới',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    comment: 'Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm chất lượng đúng như mô tả. Tôi sẽ giới thiệu shop cho bạn bè.'
  },
  {
    name: 'Lê Văn C',
    title: 'Chuyên gia công nghệ',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    rating: 5,
    comment: 'Là một người đam mê công nghệ, tôi rất ấn tượng với việc shop luôn cập nhật những sản phẩm mới nhất trên thị trường.'
  }
];

const fetchFeaturedProducts = async () => {
  try {
    loading.value = true;
    const response = await productStore.fetchProducts({
      limit: 8,
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

<style scoped>
/* Hiệu ứng mở rộng khi hover vào banner */
.p-carousel-item img {
  transition: transform 0.6s ease;
}

.p-carousel-item:hover img {
  transform: scale(1.03);
}

/* Custom styling cho carousel indicators */
:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
}

:deep(.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button) {
  background-color: white;
  transform: scale(1.2);
}
</style>
