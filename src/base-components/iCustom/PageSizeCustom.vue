<template>
  <FormSelect
    v-model="perPageSelected"
    class="w-20 mt-3 sm:mt-0"
    @change="emit('perpagechanged', perPageSelected)"
    name="page-size">
    <option :value="per" v-for="per in perPage">{{ per }}</option>
  </FormSelect>
</template>

<script setup lang="ts">
  import { computed, PropType } from 'vue';
  import FormSelect from '@/base-components/Form/FormSelect.vue';

  const props = defineProps({
    perPage: {
      type: Array as PropType<number[]>,
      required: true,
    },
    perPageSelected: {
      type: Number,
      required: true,
    },
  });
  const emit = defineEmits(['perpagechanged']);
  const perPage = computed(() => props.perPage as number[]);
  const perPageSelected = computed({
    get: () => props.perPageSelected as number,
    set: (data) => emit('perpagechanged', data),
  });
</script>

<style scoped></style>
