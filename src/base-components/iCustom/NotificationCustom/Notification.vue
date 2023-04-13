<template>
  <div class="flex">
    <span class="px-4 py-2">
      <i v-if="classAlert === 'success'" data-lucide="check-circle" class="w-5 h-5 text-success"></i>
      <i v-else-if="classAlert === 'warning'" data-lucide="alert-circle" class="w-5 h-5 text-warning"></i>
      <i v-else data-lucide="alert-circle" class="w-5 h-5 text-danger"></i>
    </span>
    <div class="d-flex">
      <h2 class="text-lg font-bold text-slate-300">{{ title }}</h2>
      <div v-if="details && details.length > 0">
        <div ref="repliesItem" class="intro-x mb-2">
          <div
            v-for="(error, index) in details"
            :key="index"
            class="text-gray-500 dark:text-gray-300/70 font-normal">
            <p>{{ t('status') }}: {{ logicDisplayErrorStatus(error) }}</p>
            <p>{{ t('title') }}: {{ logicDisplayErrorTitle(error) }}</p>
            <p>{{ t('detail') }}: {{ logicDisplayErrorCode(error) }}</p>
            ----------------------------------------------
          </div>
        </div>
      </div>
      <div v-else>
        <p class="font-bold text-slate-500">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType } from 'vue';
  import { createIcons, icons } from 'lucide';
  import { IErrorResponse } from '@/model/interface/IDataResponse';
  import { getNestedPropValue } from '@/utils/my-function';
  import { t } from '@/config/i18n';

  export default defineComponent({
    name: 'NotifiCation',
    props: {
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      classAlert: { type: String, default: '' },
      details: { type: Array as PropType<IErrorResponse[]>, default: [] as IErrorResponse[] },
    },
    setup() {
      function logicDisplayErrorStatus(error: IErrorResponse) {
        if (getNestedPropValue(error, 'status')) {
          return t(error.status.toLowerCase()) ? t(error.status.toLowerCase()) : error.status;
        } else {
          return t('error');
        }
      }
      function logicDisplayErrorTitle(error: IErrorResponse) {
        if (getNestedPropValue(error, 'title')) {
          return t(error.title.toLowerCase()) ? t(error.title.toLowerCase()) : error.title;
        } else {
          return t('invalid_data', { name: error.title });
        }
      }
      function logicDisplayErrorCode(error: IErrorResponse) {
        let field = '';
        let errorCode: string;
        if (getNestedPropValue(error, 'source.field')) {
          field = t(error.source.field.toLowerCase())
            ? t(error.source.field.toLowerCase())
            : error.source.field;
        }
        if (getNestedPropValue(error, 'source.field') && getNestedPropValue(error, 'source.error_code')) {
          errorCode = t(error.source.error_code.toLowerCase())
            ? t(error.source.error_code.toLowerCase())
            : error.source.error_code;
        } else if (getNestedPropValue(error, 'detail')) {
          errorCode = t(error.detail.toLowerCase()) ? t(error.detail.toLowerCase()) : error.detail;
        } else {
          errorCode = t('invalid_data');
        }
        return field + ' ' + errorCode;
      }

      onMounted(() => {
        createIcons({
          icons,
          attrs: {
            'stroke-width': 1.5,
          },
          nameAttr: 'data-lucide',
        });
      });
      return { t, logicDisplayErrorStatus, logicDisplayErrorTitle, logicDisplayErrorCode };
    },
  });
</script>

<style></style>
