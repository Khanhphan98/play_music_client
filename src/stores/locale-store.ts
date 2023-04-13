import { defineStore } from 'pinia';
import { ref } from 'vue';
import i18n from '@/config/i18n';

export const LocaleStore = defineStore('localeStore', () => {
  const defaultLocale = ref(localStorage.getItem('locale'));
  function actionSetDefaultLocale() {
    if (defaultLocale.value) {
      actionChangeLocale(defaultLocale.value);
    }
  }
  function actionChangeLocale(locale: string) {
    i18n.global.locale.value = locale;
    //set local storage
    localStorage.setItem('locale', locale);
  }

  return {
    actionSetDefaultLocale,
    actionChangeLocale,
  };
});
