import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from './config/axios'

// PrimeVue and its components
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Paginator from 'primevue/paginator'
import Breadcrumb from 'primevue/breadcrumb'
import Steps from 'primevue/steps'
import Tag from 'primevue/tag'

// Styles
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/css/index.css'

const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

// Register PrimeVue components
app.component('Toast', Toast)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Dropdown', Dropdown)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('Card', Card)
app.component('Paginator', Paginator)
app.component('Breadcrumb', Breadcrumb)
app.component('Steps', Steps)
app.component('Tag', Tag)

// Make axios available globally
app.config.globalProperties.$axios = axios

// Error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
}

// Mount app
app.mount('#app')
