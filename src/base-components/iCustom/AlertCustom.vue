<template>
  <Alert v-if="errors && Object.keys(errors).length > 0" variant="soft-danger" class="flex items-center mt-5">
    <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" />
    <ul>
      <li v-for="(error, index) in errors" :key="index">* {{ error }}</li>
    </ul>
  </Alert>
  <Alert v-else-if="message" variant="soft-success" class="flex items-center mt-5">
    <Lucide icon="Check" class="w-6 h-6 mr-2" />
    {{ message }}!
  </Alert>
</template>

<script setup lang="ts">
  import Alert from '@/base-components/Alert/Alert.vue';
  import Lucide from '@/base-components/Lucide/Lucide.vue';

  const props = defineProps({
    errors: {
      type: Object,
      default: {},
    },
    message: {
      type: String,
      default: '',
    },
  });
</script>

<style scoped></style>