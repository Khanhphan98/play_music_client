<template>
  <Td :colspan="colspan">
    <div class="flex items-center justify-center text-primary-three py-5">
      <Lucide icon="AlertOctagon" class="mr-2 h-12 w-12" />
      <span class="text-3xl">{{ t('data_not_found') }}!</span>
    </div>
  </Td>
</template>

<script setup lang="ts">
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import { t } from '@/config/i18n';
  import { computed } from 'vue';
  import Td from '@/base-components/Table/Td.vue';

  const props = defineProps({
    colspan: {
      type: Number,
      default: 10,
    },
  });

  const colspan = computed(() => props.colspan as number);
</script>

<style scoped></style>
