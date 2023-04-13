<script setup lang="ts">
  import Button from '@/base-components/Button';
  import { Dialog } from '@/base-components/Headless';
  import { FormInput, FormLabel, FormSelect } from '@/base-components/Form';
  import { computed, reactive } from 'vue';

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

  const changeHostModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });
  const changeHostContent = computed(() => props.content);

  const state = reactive({
    host: 'local',
    specialip: '',
  });
  const rules = computed(() => {
    return {
      host: {},
    };
  });

  function saveHost() {
    // Save form to database and close modal
    changeHostModal.value = false;
  }
</script>

<template>
  <div class="change-host-content">
    <FormSelect v-model="state.host" id="host" class="mt-2" aria-label="Default select example">
      <option value="local">Localhost</option>
      <option value="any">% (Any Host)</option>
      <option value="special-ip">Special IP</option>
    </FormSelect>
    <div class="mt-3" v-if="state.host === 'special-ip'">
      <FormInput type="text" placeholder="Enter IP address..." v-model="state.specialip" />
    </div>
  </div>
</template>
