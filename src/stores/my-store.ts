import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ToasitfyMessageDto } from '@/model/dto/ToasitfyMessageDto';
import { t } from '@/config/i18n';

export const MyStore = defineStore('myStore', () => {
  const showMessage = ref<ToasitfyMessageDto>(new ToasitfyMessageDto());

  return {
    showMessage,
  };
});
