
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'


// import { createPinia } from 'pinia'
// import anime from 'animejs/lib/anime.es.js';

import App from './App.vue'


const app = createApp(App)

app.use(Antd)
// app.use(createPinia())
// app.use(anime)
app.config.warnHandler = () => null;
app.mount('#app')
