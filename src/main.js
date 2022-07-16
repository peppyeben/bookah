import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import 'tw-elements';
import './styles/styles.css';

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/brands.css'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/regular.css'
import '@fortawesome/fontawesome-free/css/solid.css'

import '@fortawesome/fontawesome-free/js/all.js'
import '@fortawesome/fontawesome-free/js/brands.js'
import '@fortawesome/fontawesome-free/js/fontawesome.js'
import '@fortawesome/fontawesome-free/js/regular.js'
import '@fortawesome/fontawesome-free/js/solid.js'
// import '@/assets/bootstrap-icons/bootstrap-icons.css';

createApp(App).use(store).use(router).mount('#app')
