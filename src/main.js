import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import i18n from './i18n/index'
import router from './router'
import './assets/styles.css' 

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(i18n)
    .mount('#app')
