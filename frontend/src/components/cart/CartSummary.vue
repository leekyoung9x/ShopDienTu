<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">
      Tóm tắt đơn hàng
    </h2>

    <!-- Summary Details -->
    <div class="space-y-3">
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
    </div>

    <!-- Free Shipping Progress -->
    <div v-if="!isFreeShipping" class="mt-6">
      <p class="text-sm text-gray-600 mb-2">
        Mua thêm {{ formatPrice(freeShippingThreshold - subtotal) }} để được miễn phí vận chuyển
      </p>
      <ProgressBar
        :value="(subtotal / freeShippingThreshold) * 100"
        :showValue="false"
      />
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 space-y-3">
      <Button
        label="Tiến hành thanh toán"
        icon="pi pi-check"
        class="w-full"
        :disabled="!items.length"
        @click="$emit('checkout')"
      />
      <router-link to="/products">
        <Button
          label="Tiếp tục mua sắm"
          icon="pi pi-shopping-cart"
          severity="secondary"
          text
          class="w-full"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup>
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
