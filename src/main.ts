import { createApp } from 'vue'
import App from './App.vue'
import DomComponents from './index'
import '/src/styles/index.scss'

const app = createApp(App)
app.use(DomComponents)
app.mount('#app') 