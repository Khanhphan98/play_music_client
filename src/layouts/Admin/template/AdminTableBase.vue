<script setup lang="ts">
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import { onMounted, ref } from 'vue';
  const tableScrollH = ref();
  onMounted(() => {
    new tableScrollHorizontal(tableScrollH.value);
  });
</script>

<template>
  <div class="p-3 bg-white dark:bg-darkmode-800 rounded -intro-y shadow-md my-3">
    <slot name="tablehead"></slot>
    <div class="overflow-x-auto" ref="tableScrollH">
      <slot name="tablebody"></slot>
    </div>
  </div>
</template>
