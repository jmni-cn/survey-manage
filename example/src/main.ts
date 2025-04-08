import { createApp } from 'vue'
import App from './App.vue'
import DomComponents from '../../src/index'
import '../../src/styles/index.scss'
import { createPinia } from 'pinia'

const store = createPinia()
const app = createApp(App)
app.use(store).use(DomComponents)
app.mount('#app') 