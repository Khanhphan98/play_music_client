<script setup lang="ts">
  import { ref, provide } from 'vue';
  import TinySlider, { TinySliderElement } from '../base-components/TinySlider';

  const salesReportFilter = ref<string>('');
  const importantNotesRef = ref<TinySliderElement>();

  provide('bind[importantNotesRef]', (el: TinySliderElement) => {
    importantNotesRef.value = el;
  });

  const prevImportantNotes = () => {
    importantNotesRef.value?.tns.goTo('prev');
  };
  const nextImportantNotes = () => {
    importantNotesRef.value?.tns.goTo('next');
  };
</script>

<template></template>
