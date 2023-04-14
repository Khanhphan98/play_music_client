import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';
const i18n: any = createI18n({
  legacy: false,
  locale: 'vi', // ngôn ngữ mặc định
  fallbackLocale: 'en',
  messages,
});
export default i18n;
export const t = i18n.global.t;
