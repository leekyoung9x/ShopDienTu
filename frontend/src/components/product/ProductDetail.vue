<template>
  <div class="bg-white rounded-xl shadow-sm mb-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <!-- Product Image Gallery -->
      <div>
        <!-- Main Image with Zoom Effect -->
        <div class="relative overflow-hidden rounded-xl aspect-square mb-4">
          <div 
            ref="zoomContainer" 
            class="w-full h-full cursor-zoom-in relative"
            @mousemove="handleZoom"
            @mouseleave="resetZoom"
            @click="toggleFullscreen"
          >
            <img
              ref="mainImage"
              :src="currentImage"
              :alt="product.name"
              class="w-full h-full object-contain transition-transform duration-300"
              :class="{'scale-150': zoomed}"
              :style="zoomStyle"
            />
          </div>
          
          <!-- Product badges -->
          <div class="absolute top-4 right-4 flex flex-col gap-2">
            <Badge v-if="isNew" value="Mới" severity="success" class="text-xs" />
            <Badge v-if="isDiscounted" value="Giảm giá" severity="warning" class="text-xs" />
            <Badge v-if="product.quantity === 0" value="Hết hàng" severity="danger" class="text-xs" />
          </div>
        </div>

        <!-- Thumbnail Gallery -->
        <div class="flex gap-2 overflow-x-auto pb-2">
          <div 
            v-for="(image, index) in productImages" 
            :key="index" 
            class="w-20 h-20 rounded-lg border cursor-pointer transition-all"
            :class="currentImageIndex === index ? 'border-primary-500 shadow-md' : 'border-gray-200'"
            @click="setCurrentImage(index)"
          >
            <img 
              :src="image" 
              :alt="`${product.name} - Hình ${index + 1}`" 
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
        
        <!-- Fullscreen Image Modal -->
        <Dialog 
          v-model:visible="fullscreenVisible" 
          modal 
          dismissableMask 
          :style="{ width: '90vw', height: '90vh' }" 
          :showHeader="false" 
          :closable="false"
        >
          <div class="relative h-full flex flex-col">
            <Button 
              icon="pi pi-times" 
              class="absolute top-2 right-2 p-button-rounded p-button-text"
              @click="fullscreenVisible = false"
              aria-label="Close"
            />
            
            <div class="flex-grow flex items-center justify-center bg-gray-900">
              <img 
                :src="currentImage" 
                :alt="product.name" 
                class="max-w-full max-h-full object-contain"
              />
            </div>
            
            <div class="p-4 bg-gray-900 text-white flex justify-between items-center">
              <span>{{ product.name }} - Hình {{ currentImageIndex + 1 }}/{{ productImages.length }}</span>
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-arrow-left" 
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="prevImage"
                  :disabled="currentImageIndex === 0"
                  aria-label="Previous image"
                />
                <Button 
                  icon="pi pi-arrow-right" 
                  class="p-button-rounded p-button-text p-button-sm"
                  @click="nextImage"
                  :disabled="currentImageIndex === productImages.length - 1"
                  aria-label="Next image"
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-3">
              {{ product.name }}
            </h1>
            
            <!-- Product Rating -->
            <div class="flex items-center gap-2 mb-4">
              <Rating :modelValue="productRating" readonly :cancel="false" />
              <span class="text-sm text-gray-600">({{ reviewCount }} đánh giá)</span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <Button 
              icon="pi pi-heart" 
              class="p-button-rounded p-button-text p-button-lg" 
              :class="{'text-red-500': isWishlisted}"
              @click="toggleWishlist"
              v-tooltip.left="isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'"
            />
            <Button 
              icon="pi pi-share-alt" 
              class="p-button-rounded p-button-text p-button-lg" 
              @click="showShareOptions = true"
              v-tooltip.left="'Chia sẻ sản phẩm'"
            />
          </div>
        </div>

        <!-- Price -->
        <div>
          <div class="flex items-end gap-3">
            <span class="text-4xl font-bold text-primary-600">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="oldPrice" class="text-lg text-gray-400 line-through">
              {{ formatPrice(oldPrice) }}
            </span>
            <Badge v-if="discountPercent" :value="`-${discountPercent}%`" severity="danger" />
          </div>
          <div class="mt-2 flex items-center gap-2">
            <i class="pi pi-box text-gray-500"></i>
            <span v-if="product.quantity > 10" class="text-sm text-green-600">
              Còn nhiều hàng
            </span>
            <span v-else-if="product.quantity > 0" class="text-sm text-orange-500">
              Còn {{ product.quantity }} sản phẩm
            </span>
            <span v-else class="text-sm text-red-500">
              Hết hàng
            </span>
          </div>
        </div>

        <!-- Add to cart -->
        <div class="p-4 bg-gray-50 rounded-xl space-y-4">
          <div class="flex items-center gap-4">
            <label for="quantity" class="text-gray-700 min-w-24">Số lượng:</label>
            <div class="flex items-center">
              <Button 
                icon="pi pi-minus" 
                outlined 
                class="p-button-rounded" 
                :disabled="quantity <= 1 || product.quantity === 0"
                @click="quantity > 1 && quantity--"
              />
              <InputText 
                v-model.number="quantity" 
                class="w-16 text-center mx-2" 
                :disabled="product.quantity === 0"
              />
              <Button 
                icon="pi pi-plus" 
                outlined 
                class="p-button-rounded" 
                :disabled="quantity >= product.quantity || product.quantity === 0"
                @click="quantity < product.quantity && quantity++"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <Button
              v-if="product.quantity > 0"
              icon="pi pi-shopping-cart"
              label="Thêm vào giỏ hàng"
              class="flex-grow"
              :loading="loading"
              @click="addToCart"
            />
            <Button
              v-else
              icon="pi pi-bell"
              label="Thông báo khi có hàng"
              severity="secondary"
              class="flex-grow"
              @click="notifyWhenAvailable"
            />
            <Button
              icon="pi pi-shopping-bag"
              label="Mua ngay"
              class="p-button-outlined flex-grow"
              :disabled="product.quantity === 0"
              @click="buyNow"
            />
          </div>
        </div>

        <!-- Quick Info -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(item, index) in quickInfoItems" :key="index" class="flex items-center gap-3 py-2 border-b border-gray-100">
            <i :class="[item.icon, 'text-primary-500']"></i>
            <div>
              <div class="font-medium">{{ item.label }}</div>
              <div class="text-sm text-gray-600">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Tabs -->
    <div class="px-6 pb-6">
      <TabView>
        <TabPanel header="Mô tả sản phẩm">
          <div class="p-4 text-gray-700 leading-relaxed">
            <p class="text-gray-700 whitespace-pre-line">{{ product.description || 'Chưa có mô tả cho sản phẩm này' }}</p>
          </div>
        </TabPanel>
        
        <TabPanel header="Thông số kỹ thuật">
          <div class="p-4">
            <div v-if="specifications.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="(spec, index) in specifications" 
                :key="index"
                class="flex py-3 border-b border-gray-100"
              >
                <div class="font-medium min-w-36 text-gray-700">{{ spec.name }}:</div>
                <div class="text-gray-700">{{ spec.value }}</div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-8">
              <i class="pi pi-info-circle text-2xl mb-2"></i>
              <p>Chưa có thông tin thông số kỹ thuật cho sản phẩm này</p>
            </div>
          </div>
        </TabPanel>

        <TabPanel header="Đánh giá sản phẩm">
          <div class="p-4">
            <div v-if="reviews.length > 0">
              <!-- Rating summary -->
              <div class="flex flex-col lg:flex-row gap-6 p-4 bg-gray-50 rounded-xl mb-6">
                <div class="flex flex-col items-center justify-center">
                  <div class="text-5xl font-bold text-gray-900">{{ productRating.toFixed(1) }}</div>
                  <Rating :modelValue="productRating" readonly :cancel="false" class="my-2" />
                  <div class="text-sm text-gray-600">{{ reviewCount }} đánh giá</div>
                </div>
                
                <div class="flex-grow">
                  <div v-for="i in 5" :key="i" class="flex items-center gap-3 mb-2">
                    <div class="min-w-16 text-right">{{ 6-i }} sao</div>
                    <ProgressBar 
                      :value="getRatingPercentage(6-i)" 
                      class="h-2 flex-grow" 
                      :pt="{
                        root: { style: 'background: #e2e8f0' },
                        value: { style: 'background: #4f46e5' }
                      }" 
                    />
                    <div class="min-w-16">{{ getRatingCount(6-i) }}</div>
                  </div>
                </div>
                
                <div class="flex flex-col items-center justify-center">
                  <div class="mb-3 text-center">Chia sẻ đánh giá của bạn</div>
                  <Button label="Viết đánh giá" icon="pi pi-pencil" outlined />
                </div>
              </div>
              
              <!-- Review list -->
              <div class="space-y-6">
                <div 
                  v-for="(review, index) in reviews" 
                  :key="index"
                  class="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                        <img 
                          v-if="review.avatar" 
                          :src="review.avatar" 
                          :alt="review.author" 
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                          <i class="pi pi-user"></i>
                        </div>
                      </div>
                      <div>
                        <div class="font-medium">{{ review.author }}</div>
                        <div class="text-sm text-gray-500">{{ formatDate(review.date) }}</div>
                      </div>
                    </div>
                    
                    <Rating :modelValue="review.rating" readonly :cancel="false" />
                  </div>
                  
                  <div class="text-gray-700 mb-3">{{ review.comment }}</div>
                  
                  <div class="flex items-center gap-2 text-sm">
                    <Button 
                      icon="pi pi-thumbs-up" 
                      text 
                      size="small"
                      :label="review.helpful.toString()" 
                      @click="review.helpful++"
                    />
                    <span class="text-gray-500">•</span>
                    <Button 
                      label="Phản hồi" 
                      text 
                      size="small" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="pi pi-comments text-2xl text-gray-500"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có đánh giá nào</h3>
              <p class="text-gray-600 mb-6">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này</p>
              <Button label="Viết đánh giá đầu tiên" icon="pi pi-pencil" />
            </div>
          </div>
        </TabPanel>
        
        <TabPanel header="Chính sách bảo hành">
          <div class="p-4 space-y-4">
            <h3 class="font-medium text-xl text-gray-900 mb-2">Chính sách bảo hành</h3>
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div class="flex items-start">
                <i class="pi pi-shield text-blue-500 mr-3 mt-1"></i>
                <div>
                  <h4 class="font-medium text-blue-800">Bảo hành chính hãng 12 tháng</h4>
                  <p class="text-blue-600 mt-1">Sản phẩm được bảo hành 12 tháng theo chính sách của nhà sản xuất</p>
                </div>
              </div>
            </div>
            
            <h4 class="font-medium text-gray-800 mt-4 mb-2">Điều kiện bảo hành:</h4>
            <ul class="list-disc pl-5 space-y-2 text-gray-700">
              <li>Sản phẩm còn trong thời hạn bảo hành</li>
              <li>Tem bảo hành, mã vạch, số serial còn nguyên vẹn</li>
              <li>Sản phẩm không bị trầy xước, biến dạng, nứt vỡ</li>
              <li>Sản phẩm không bị hư hỏng do thiên tai hoặc sử dụng sai quy cách</li>
            </ul>
            
            <h4 class="font-medium text-gray-800 mt-4 mb-2">Chính sách đổi trả:</h4>
            <div class="bg-green-50 p-4 rounded-lg border border-green-100">
              <div class="flex items-start">
                <i class="pi pi-sync text-green-500 mr-3 mt-1"></i>
                <div>
                  <h4 class="font-medium text-green-800">Đổi trả trong vòng 30 ngày</h4>
                  <p class="text-green-600 mt-1">Miễn phí đổi trả trong vòng 30 ngày đầu tiên nếu sản phẩm gặp lỗi từ nhà sản xuất</p>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <!-- Share Dialog -->
    <Dialog v-model:visible="showShareOptions" header="Chia sẻ sản phẩm" :style="{ width: '400px' }" :modal="true">
      <div class="flex flex-col gap-4 p-4">
        <div class="flex flex-wrap justify-center gap-3">
          <Button icon="pi pi-facebook" rounded class="bg-blue-600 border-blue-600" v-tooltip.top="'Facebook'" />
          <Button icon="pi pi-twitter" rounded class="bg-sky-500 border-sky-500" v-tooltip.top="'Twitter'" />
          <Button icon="pi pi-envelope" rounded class="bg-red-500 border-red-500" v-tooltip.top="'Email'" />
          <Button icon="pi pi-whatsapp" rounded class="bg-green-500 border-green-500" v-tooltip.top="'WhatsApp'" />
          <Button icon="pi pi-telegram" rounded class="bg-blue-400 border-blue-400" v-tooltip.top="'Telegram'" />
        </div>
        
        <div class="mt-4">
          <label for="share-link" class="block text-sm font-medium text-gray-700 mb-2">Hoặc sao chép đường dẫn</label>
          <div class="flex">
            <InputText id="share-link" :model-value="productUrl" readonly class="flex-grow rounded-r-none" />
            <Button 
              icon="pi pi-copy" 
              @click="copyToClipboard"
              class="rounded-l-none" 
              v-tooltip.bottom="copied ? 'Đã sao chép!' : 'Sao chép'"
            />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';
import Badge from 'primevue/badge';
import ProgressBar from 'primevue/progressbar';
import Divider from 'primevue/divider';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// Emit events
const emit = defineEmits(['add-to-cart']);

const toast = useToast();
const route = useRoute();
const cartStore = useCartStore();

// State
const loading = ref(false);
const quantity = ref(1);
const zoomed = ref(false);
const zoomStyle = ref({});
const fullscreenVisible = ref(false);
const currentImageIndex = ref(0);
const showShareOptions = ref(false);
const copied = ref(false);
const isWishlisted = ref(false); // Would be connected to a proper wishlist store in a real app

// References for zoom effect
const zoomContainer = ref(null);
const mainImage = ref(null);

// Product images - would come from the server in a real scenario
const productImages = computed(() => {
  // Generate dummy images for demo
  if (props.product.image) {
    // In a real app, we would have multiple images
    return [props.product.image, '/images/product-placeholder.jpg']
  }
  return ['/images/product-placeholder.jpg']
});

// Current displayed image
const currentImage = computed(() => productImages.value[currentImageIndex.value]);

// Image navigation
const nextImage = () => {
  if (currentImageIndex.value < productImages.value.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const setCurrentImage = (index) => {
  currentImageIndex.value = index;
};

// Product URL for sharing
const productUrl = computed(() => {
  return `${window.location.origin}/products/${props.product.id}`;
});

// Copy to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(productUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã sao chép đường dẫn sản phẩm',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể sao chép đường dẫn',
      life: 3000
    });
  }
};

// Price formatting
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Format date
const formatDate = (date) => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

// Simulated old price (in real app would come from the server)
const oldPrice = computed(() => props.product.price * 1.2);

// Calculate discount percentage
const discountPercent = computed(() => {
  if (oldPrice.value) {
    return Math.round(((oldPrice.value - props.product.price) / oldPrice.value) * 100);
  }
  return 0;
});

// Handle zoom effect
const handleZoom = (event) => {
  if (!zoomContainer.value || !mainImage.value) return;
  
  const { left, top, width, height } = zoomContainer.value.getBoundingClientRect();
  const x = (event.clientX - left) / width;
  const y = (event.clientY - top) / height;
  
  // Apply transformation to create zoom effect where mouse is positioned
  zoomStyle.value = {
    transformOrigin: `${x * 100}% ${y * 100}%`,
  };
  
  zoomed.value = true;
};

const resetZoom = () => {
  zoomed.value = false;
};

const toggleFullscreen = () => {
  fullscreenVisible.value = true;
};

// Add to cart
const addToCart = async () => {
  if (quantity.value > 0 && props.product.quantity > 0) {
    try {
      loading.value = true;
      await cartStore.addToCart(props.product, quantity.value);
      
      // Emit event to the parent component
      emit('add-to-cart', {
        product: props.product,
        quantity: quantity.value
      });
      
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã thêm sản phẩm vào giỏ hàng',
        life: 3000
      });
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: error.message || 'Không thể thêm vào giỏ hàng',
        life: 3000
      });
    } finally {
      loading.value = false;
    }
  }
};

// Buy now
const buyNow = async () => {
  try {
    loading.value = true;
    await cartStore.addToCart(props.product, quantity.value);
    window.location.href = '/cart';
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error.message || 'Không thể mua ngay',
      life: 3000
    });
    loading.value = false;
  }
};

// Notify when available
const notifyWhenAvailable = () => {
  toast.add({
    severity: 'info',
    summary: 'Thông báo',
    detail: 'Chúng tôi sẽ thông báo khi sản phẩm có hàng',
    life: 3000
  });
};

// Toggle wishlist
const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: isWishlisted.value
      ? 'Đã thêm sản phẩm vào danh sách yêu thích'
      : 'Đã xóa sản phẩm khỏi danh sách yêu thích',
    life: 3000
  });
};

// Product is new if created in the last 30 days (simulated)
const isNew = computed(() => {
  return true; // Simulated as new product
});

// Product is on discount if it has an oldPrice
const isDiscounted = computed(() => {
  return !!oldPrice.value;
});

// Quick info items
const quickInfoItems = computed(() => [
  { 
    icon: 'pi pi-truck', 
    label: 'Giao hàng miễn phí',
    value: 'Cho đơn hàng trên 500,000đ'
  },
  { 
    icon: 'pi pi-shield', 
    label: 'Bảo hành chính hãng',
    value: '12 tháng'
  },
  { 
    icon: 'pi pi-sync', 
    label: 'Đổi trả dễ dàng',
    value: 'Trong vòng 30 ngày'
  },
  { 
    icon: 'pi pi-check-circle', 
    label: 'Sản phẩm chính hãng',
    value: '100% chính hãng'
  }
]);

// Simulated specifications
const specifications = computed(() => {
  // Simulate different specs based on product type
  if (props.product.name.toLowerCase().includes('iphone') || props.product.name.toLowerCase().includes('samsung')) {
    return [
      { name: 'Màn hình', value: '6.1 inch, OLED, Super Retina XDR' },
      { name: 'Chip', value: 'Apple A15 Bionic' },
      { name: 'RAM', value: '6 GB' },
      { name: 'Bộ nhớ trong', value: '128 GB' },
      { name: 'Camera sau', value: '12 MP, f/1.6' },
      { name: 'Camera trước', value: '12 MP, f/2.2' },
      { name: 'Pin', value: '3240 mAh, sạc nhanh 20W' },
      { name: 'Hệ điều hành', value: 'iOS 15' }
    ];
  } else if (props.product.name.toLowerCase().includes('laptop') || props.product.name.toLowerCase().includes('macbook')) {
    return [
      { name: 'CPU', value: 'Intel Core i7 11th Gen' },
      { name: 'RAM', value: '16 GB DDR4' },
      { name: 'Ổ cứng', value: '512 GB SSD' },
      { name: 'Màn hình', value: '14 inch, 2560 x 1600 pixels' },
      { name: 'Card đồ họa', value: 'NVIDIA GeForce RTX 3050' },
      { name: 'Cổng kết nối', value: '2 x USB-C, 1 x USB-A, HDMI, jack 3.5mm' },
      { name: 'Hệ điều hành', value: 'Windows 11 Home' },
      { name: 'Pin', value: '4-cell, 52Wh' }
    ];
  } else if (props.product.name.toLowerCase().includes('tai nghe') || props.product.name.toLowerCase().includes('airpods')) {
    return [
      { name: 'Loại', value: 'True Wireless' },
      { name: 'Kết nối', value: 'Bluetooth 5.0' },
      { name: 'Thời gian sử dụng', value: '5 giờ (tai nghe), 24 giờ (với hộp sạc)' },
      { name: 'Chống nước', value: 'IPX4' },
      { name: 'Microphone', value: 'Có, chống ồn' },
      { name: 'Tính năng đặc biệt', value: 'Chống ồn chủ động, Xuyên âm' },
      { name: 'Tương thích', value: 'iOS, Android' },
      { name: 'Sạc', value: 'Lightning, Không dây Qi' }
    ];
  }
  
  // Fallback for other products
  return [];
});

// Simulated reviews & ratings
// In a real app, this would come from an API
const productRating = ref(4.5);
const reviewCount = ref(23);
const allReviews = [
  { author: 'Nguyễn Văn A', rating: 5, date: '2024-03-15', comment: 'Sản phẩm rất tốt, giao hàng nhanh. Tôi rất hài lòng với chất lượng.', helpful: 3, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { author: 'Trần Thị B', rating: 4, date: '2024-03-10', comment: 'Sản phẩm ổn, đóng gói cẩn thận. Nhưng giá hơi cao so với các cửa hàng khác.', helpful: 1, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { author: 'Lê Văn C', rating: 5, date: '2024-02-28', comment: 'Tuyệt vời! Sử dụng rất tốt, pin trâu, màn hình đẹp.', helpful: 7, avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { author: 'Phạm Thị D', rating: 3, date: '2024-02-15', comment: 'Sản phẩm tạm được, nhưng có vài vết xước nhỏ khi nhận hàng.', helpful: 2, avatar: 'https://randomuser.me/api/portraits/women/17.jpg' }
];

// Get reviews
const reviews = ref(allReviews);

// Get rating percentage
const getRatingPercentage = (rating) => {
  const count = reviews.value.filter(review => review.rating === rating).length;
  return count > 0 ? (count / reviews.value.length) * 100 : 0;
};

// Get rating count
const getRatingCount = (rating) => {
  return reviews.value.filter(review => review.rating === rating).length;
};

</script>

<style scoped>
/* Custom tab styles */
:deep(.p-tabview-nav) {
  border-color: #f1f5f9;
}

:deep(.p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  color: #64748b;
  transition: all 0.3s;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  border-color: theme('colors.primary.500');
  color: theme('colors.primary.700');
}

:deep(.p-tabview-panels) {
  padding: 0;
}

:deep(.p-progressbar) {
  height: 0.5rem;
  border-radius: 9999px;
}
</style>
