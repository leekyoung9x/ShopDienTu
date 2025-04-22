<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Global Toast Container -->
    <Toast position="top-right" />
    
    <!-- Dynamic Layout Based on Route Meta -->
    <component :is="layout">
      <router-view></router-view>
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const route = useRoute();

// Determine layout based on route meta
const layout = computed(() => {
  const layoutName = route.meta.layout || 'default';
  return layoutName === 'auth' ? AuthLayout : DefaultLayout;
});
</script>

<style>
/* Base styles không còn cần thiết vì đã sử dụng các component PrimeVue */

/* PrimeVue Customizations */
:root {
  --primary-color: #4f46e5;
  --primary-color-text: #ffffff;
}

.p-component {
  font-family: inherit;
}

.p-button:not(.p-button-sm):not([size="small"]):not(.p-button-icon-only):not([icon]:not([label])) {
  @apply font-medium py-3;
}

.p-button.p-button-sm, .p-button[size="small"] {
  @apply font-medium py-2;
}

/* Button icon-only không cần padding dọc lớn */
.p-button.p-button-icon-only, .p-button[icon]:not([label]) {
  @apply font-medium py-2;
}

/* Button có cả icon và label - cải thiện padding trái phải */
.p-button[icon][label]:not(.p-button-icon-only) {
  @apply pl-4 pr-5;
}

/* Icon trong button cần có khoảng cách với text */
.p-button .p-button-icon-left {
  @apply mr-2;
}

.p-button .p-button-icon-right {
  @apply ml-2;
}

/* Thêm border cho tất cả các input */
.p-inputtext,
.p-dropdown,
.p-inputnumber-input,
.p-password input,
.p-calendar .p-inputtext,
.p-textarea,
.p-multiselect {
  @apply border border-gray-300 rounded-md px-4 py-2;
}

/* Style cho các input disabled */
.p-inputtext:disabled,
.p-dropdown.p-disabled,
.p-inputnumber-input:disabled,
.p-password input:disabled,
.p-calendar .p-inputtext:disabled,
.p-textarea:disabled,
.p-multiselect.p-disabled {
  @apply border border-gray-300 rounded-md px-4 py-2 opacity-70 bg-gray-50;
}

/* Style khi focus */
.p-inputtext:enabled:focus,
.p-dropdown:not(.p-disabled).p-focus,
.p-inputnumber:not(.p-disabled).p-focus .p-inputnumber-input,
.p-password:not(.p-disabled).p-focus input,
.p-calendar:not(.p-disabled).p-focus .p-inputtext,
.p-textarea:enabled:focus,
.p-multiselect:not(.p-disabled).p-focus {
  @apply ring-2 ring-primary-500 border-primary-500;
}

.p-card {
  @apply shadow-sm;
}

.p-dialog {
  @apply shadow-lg;
}

.p-toast {
  @apply font-sans;
}

.card {
  @apply bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md;
}
</style>
