import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ToasitfyMessageDto } from '@/model/dto/ToasitfyMessageDto';
import { IErrorResponse } from '@/model/interface/IDataResponse';
import { t } from '@/config/i18n';

export const MyStore = defineStore('myStore', () => {
  const showMessage = ref<ToasitfyMessageDto>(new ToasitfyMessageDto());

  function showToastMessage(content?: string, error?: boolean, details?: IErrorResponse[]) {
    //reset message
    const message = new ToasitfyMessageDto();
    //Set giá trị thông báo
    if (error) {
      message.title = t('alert.title.error');
      message.content = content ? content : t('alert.content.error');
      message.type = message.alert.class.danger;
      message.details = details ? details : message.details;
      message.class = 'error';
    } else {
      message.title = t('alert.title.success');
      message.content = content ? content : t('alert.content.success');
      message.type = message.alert.class.success;
      message.details = details ? details : message.details;
      message.class = 'success';
    }
    showMessage.value = message;
  }

  return {
    showMessage,
    showToastMessage,
  };
});
