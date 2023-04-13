<script setup lang="ts">
  import { FormInput, FormSelect } from '@/base-components/Form';
  import { computed, onMounted, PropType, ref } from 'vue';
  import { IUserDatabase } from '@/model/interface/IDatabase';
  import { t } from '@/config/i18n';
  import { z } from 'zod';
  //init value
  const props = defineProps({
    userDatabaseSelected: {
      type: Object as PropType<IUserDatabase>,
      required: true,
    },
  });
  const userDatabaseSelected = computed(() => props.userDatabaseSelected as IUserDatabase);
  const hasSpecialIP = ref(false);
  const hostSelect = ref('');
  //regex ip
  const ip = z.string().ip();

  function onChangeHostSelect() {
    if (hostSelect.value === 'special_ip') {
      userDatabaseSelected.value.host = '';
      hasSpecialIP.value = true;
    } else if (hostSelect.value === 'localhost') {
      userDatabaseSelected.value.host = 'localhost';
      hasSpecialIP.value = false;
    } else if (hostSelect.value === '%') {
      userDatabaseSelected.value.host = '%';
      hasSpecialIP.value = false;
    }
  }

  onMounted(() => {
    if (ip.safeParse(userDatabaseSelected.value.host).success) {
      hasSpecialIP.value = true;
      hostSelect.value = 'special_ip';
    } else {
      hostSelect.value = userDatabaseSelected.value.host;
    }
  });
</script>

<template>
  <div class="change-host-content">
    <FormSelect
      v-model="hostSelect"
      @change="onChangeHostSelect"
      class="mt-2"
      aria-label="Default select example"
      name="change_host_select">
      <option value="localhost">Localhost</option>
      <option value="%">% ({{ t('any', { name: t('host') }) }})</option>
      <option value="special_ip">{{ t('server_ip') }}</option>
    </FormSelect>
    <div class="mt-3" v-if="hasSpecialIP">
      <FormInput
        type="text"
        :placeholder="t('enter', { name: t('server_ip') }) + '...'"
        v-model="userDatabaseSelected.host"
        name="special_ip_input" />
    </div>
  </div>
</template>
