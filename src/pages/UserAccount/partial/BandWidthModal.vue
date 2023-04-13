<template>
  <HeadlessUiDialogModal
    :open-modal="bandWidthModal"
    @closeModal="bandWidthModal = false"
    :modal-options="{ footer: true }">
    <template #title>
      <span class="text-lg font-medium leading-6">Bandwidth</span>
      <span class="text-base text-primary ml-2">({{ bandWidthContent.userName }})</span>
    </template>
    <template #modalbody>
      <ReportLineChart :height="275" class="mt-6 -mb-6" />
    </template>
  </HeadlessUiDialogModal>
</template>

<script setup lang="ts">
  import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import ReportLineChart from '@/components/ReportLineChart';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { computed } from 'vue';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  const props = defineProps({
    openClose: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {},
    },
  });
  const emit = defineEmits(['update:openClose']);
  const bandWidthContent = computed(() => props.content);
  const bandWidthModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });
</script>
