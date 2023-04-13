import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/app.css';
import i18n from '@/config/i18n';
import { configure } from 'vee-validate';
import mitt from 'mitt';

configure({
  validateOnChange: true,
});
// Set emitter
const emitter = mitt();
//Declare app
const app = createApp(App).use(router).use(i18n).use(createPinia());
//Set global emitter
app.config.globalProperties.emitter = emitter;

//Mount app
app.mount('#app');
