<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Global Toast Container -->
    <Toast position="top-right" />
    
    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<script setup>
// Toast is registered globally, no need to import
</script>

<style>
/* Base styles */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500;
}

.error-text {
  @apply text-red-600 text-sm mt-1;
}

/* PrimeVue Customizations */
:root {
  --primary-color: #4f46e5;
  --primary-color-text: #ffffff;
}

.p-component {
  font-family: inherit;
}

.p-button {
  @apply font-medium;
}

.p-inputtext:enabled:focus {
  @apply ring-2 ring-primary-500 border-primary-500;
}

.p-dropdown:not(.p-disabled).p-focus {
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
