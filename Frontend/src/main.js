import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QuillEditor } from '@vueup/vue-quill';
import App from './App.vue'
import router from './router'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import './assets/main.css'


const app = createApp(App)
app.component("QuillEditor", QuillEditor)
app.use(createPinia())
app.use(router)

app.mount('#app')
