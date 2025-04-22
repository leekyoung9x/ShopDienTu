<template>
  <Card>
    <template #header>
      <div class="flex items-center gap-2 px-4 pt-4">
        <i class="pi pi-shopping-bag text-primary-500 text-base"></i>
        <h2 class="text-xl font-semibold text-gray-900 mb-0">
          Tóm tắt đơn hàng
        </h2>
      </div>
    </template>

    <template #content>
      <div class="p-4 space-y-3">
        <div class="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span v-if="shippingFee > 0">{{ formatPrice(shippingFee) }}</span>
          <span v-else class="text-green-600">Miễn phí</span>
        </div>
        <Divider />
        <div class="flex justify-between text-lg font-semibold">
          <span>Tổng cộng</span>
          <span class="text-primary-600">{{ formatPrice(total) }}</span>
        </div>

        <!-- Free Shipping Progress -->
        <div v-if="!isFreeShipping" class="mt-6">
          <p class="text-sm text-gray-600 mb-2">
            Mua thêm {{ formatPrice(freeShippingThreshold - subtotal) }} để được miễn phí vận chuyển
          </p>
          <ProgressBar :value="(subtotal / freeShippingThreshold) * 100" :showValue="false" class="h-1.5" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="p-4 space-y-3">
        <Button label="Tiến hành thanh toán" icon="pi pi-credit-card"
          class="w-full justify-center py-3 px-4 font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-150"
          :disabled="!items.length" @click="$emit('checkout')" />

        <router-link to="/products" class="block w-full">
          <Button label="Tiếp tục mua sắm" icon="pi pi-shopping-cart" iconPos="left" severity="secondary" outlined
            class="w-full justify-center py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 transition-all duration-150" />
        </router-link>

        <div class="flex items-center justify-center mt-4 text-sm text-gray-500">
          <i class="pi pi-lock mr-2"></i>
          <span>Thanh toán an toàn & bảo mật</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ProgressBar from 'primevue/progressbar';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

defineEmits(['checkout']);

// Constants
const freeShippingThreshold = 500000; // 500,000 VND
const baseShippingFee = 30000; // 30,000 VND

// Computed
const isFreeShipping = props.subtotal >= freeShippingThreshold;
const shippingFee = isFreeShipping ? 0 : baseShippingFee;
const total = props.subtotal + shippingFee;

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
</script>
