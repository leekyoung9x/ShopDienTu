import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Auth Views
const Login = () => import('@/views/auth/LoginView.vue')
const Register = () => import('@/views/auth/RegisterView.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPasswordView.vue')

// Public Views
const Home = () => import('@/views/HomeView.vue')
const Products = () => import('@/views/ProductsView.vue')
const ProductDetail = () => import('@/views/ProductDetailView.vue')

// Protected Views
const Cart = () => import('@/views/CartView.vue')
// const Checkout = () => import('@/views/CheckoutView.vue') // File không tồn tại
const Orders = () => import('@/views/OrdersView.vue')
const Profile = () => import('@/views/ProfileView.vue')

// Admin Views - Các file này chưa được tạo nên tạm comment lại
/* 
const AdminDashboard = () => import('@/views/admin/DashboardView.vue')
const AdminProducts = () => import('@/views/admin/ProductsView.vue')
const AdminOrders = () => import('@/views/admin/OrdersView.vue')
*/

const routes = [
  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      layout: 'auth',
      guest: true 
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { 
      layout: 'auth',
      guest: true 
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { 
      layout: 'auth',
      guest: true 
    }
  },

  // Public routes
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: ProductDetail
  },

  // Protected routes
  {
    path: '/cart',
    name: 'cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  /* Chưa có file CheckoutView.vue nên tạm ẩn route này
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  */
  {
    path: '/orders',
    name: 'orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  }

  // Admin routes - đã comment vì các component chưa được tạo
  /* 
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: AdminProducts,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: AdminOrders,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  }
  */
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const user = authStore.user

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    next({ name: 'home' })
    return
  }

  // Check if route is for guests only
  if (to.meta.guest && isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
