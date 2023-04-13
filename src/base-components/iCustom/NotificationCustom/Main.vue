<template>
  <div></div>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue';
  import { createToast, withProps, clearToasts } from 'mosha-vue-toastify';
  import { MyStore } from '@/stores/my-store';
  import 'mosha-vue-toastify/dist/style.css';
  import { ToasitfyMessageDto } from '@/model/dto/ToasitfyMessageDto';
  import Notification from './Notification.vue';

  export default defineComponent({
    name: 'NotificationToastify',
    setup() {
      const myStore = MyStore();
      watch(
        () => myStore.showMessage,
        (val: ToasitfyMessageDto) => {
          if (!val) return;
          clearToasts();
          createToast(
            withProps(Notification, {
              title: val.title,
              content: val.content,
              classAlert: val.class,
              details: val.details,
            }),
            {
              timeout: val.type === 'danger' ? 30000 : 3000,
              type: val.type as any,
              toastBackgroundColor: '#28334E',
              showIcon: false,
              hideProgressBar: true,
              swipeClose: true,
            },
          );
        },
      );

      return {};
    },
  });
</script>
