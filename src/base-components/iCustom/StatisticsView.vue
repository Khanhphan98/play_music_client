<script lang="ts">
  export default {
    inheritAttrs: false,
  };
  interface lucide {
    icon: string;
    color?: string;
  }
  interface options {
    lucide: lucide | object;
    title?: string;
  }
  interface saticsOptions {
    options: options;
  }
</script>
<script setup lang="ts">
  import Lucide from '@/base-components/Lucide';
  import { computed } from 'vue';

  const props = defineProps<saticsOptions>();
  const sOp = computed(() => props.options);
</script>

<template>
  <div class="statistics-view flex">
    <Lucide
      :icon="sOp.lucide.icon"
      :class="[sOp.lucide.color ? sOp.lucide.color : 'text-slate-500']"
      class="w-12 h-12 shrink-0" />
    <div class="pl-5 grow">
      <div class="text-base font-medium text-slate-500 dark:text-slate-400" v-if="sOp.title">
        {{ $t(sOp.title) }}
      </div>
      <div class="mt-3 text-3xl font-medium leading-8">
        <slot name="maincontent"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .statistics-view {
    @apply bg-white dark:bg-darkmode-400 dark:border dark:border-white/10 dark:hover:border-primary/50 p-5 rounded-md shadow-sm hover:shadow-lg;
  }
</style>
