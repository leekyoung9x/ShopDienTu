<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- Product Image -->
      <div class="relative aspect-square">
        <img
          :src="product.image || '/images/product-placeholder.jpg'"
          :alt="product.name"
          class="w-full h-full object-cover rounded-lg"
        />
        <div
          v-if="product.quantity === 0"
          class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
        >
          Hết hàng
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ product.name }}
        </h1>

        <div>
          <div class="text-4xl font-bold text-primary-600">
            {{ formatPrice(product.price) }}
          </div>
          <div class="mt-2 text-sm text-gray-500">
            Còn {{ product.quantity }} sản phẩm
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label for="quantity" class="text-gray-700">Số lượng:</label>
            <InputNumber
              id="quantity"
              v-model="quantity"
              :min="1"
              :max="product.quantity"
              :disabled="product.quantity === 0"
              showButtons
              :incrementButtonClass="{'p-button-primary': true}"
              :decrementButtonClass="{'p-button-primary': true}"
            />
          </div>

          <Button
            v-if="product.quantity > 0"
            icon="pi pi-shopping-cart"
            label="Thêm vào giỏ"
            class="w-full"
            :loading="loading"
            @click="addToCart"
          />
          <Button
            v-else
            icon="pi pi-bell"
            label="Thông báo khi có hàng"
            severity="secondary"
            class="w-full"
            @click="notifyWhenAvailable"
          />
        </div>

        <Divider />

        <div>
          <h3 class="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
          <p class="text-gray-600 whitespace-pre-line">{{ product.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const toast = useToast();
const cartStore = useCartStore();
const loading = ref(false);
const quantity = ref(1);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const addToCart = async () => {
  try {
    loading.value = true;
    await cartStore.addToCart(props.product, quantity.value);
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
};

const notifyWhenAvailable = () => {
  toast.add({
    severity: 'info',
    summary: 'Thông báo',
    detail: 'Chúng tôi sẽ thông báo khi sản phẩm có hàng',
    life: 3000
  });
};
</script>
