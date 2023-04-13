<script setup lang="ts">
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Alert from '@/base-components/Alert';
  import Tippy from '@/base-components/Tippy';
  import Table from '@/base-components/Table';
  import { FormInput, FormCheck, FormSelect } from '@/base-components/Form';
  import TomSelectInput from '@/base-components/iCustom/TomSelectInput.vue';
  import { computed, reactive, ref } from 'vue';

  const initDemo = reactive({
    max_connections: {
      title: 'Max. Connections',
      val: 151,
      type: 'text',
    },
    max_user_connections: {
      title: 'Max. User Connections',
      val: 0,
      type: 'text',
    },
    max_execution_time: {
      title: 'Max. Execution time',
      val: 0,
      type: 'text',
    },
    net_write_timeout: {
      title: 'Net. Write timeout',
      val: 60,
      type: 'text',
    },
    sql_mode: {
      title: 'SQL MODE',
      type: 'tomselectinput',
      val: [
        'STRICT_TRANS_TABLES',
        'ERROR_FOR_DIVISION_BY_ZERO',
        'NO_AUTO_CREATE_USER',
        'NO_ENGINE_SUBSTITUTION',
      ],
    },
    port: {
      title: 'Listening port',
      val: 3306,
      type: 'text',
    },
    bind_address: {
      title: 'Bind address',
      val: '0.0.0.0',
      type: 'text',
    },
    connect_timeout: {
      title: 'Connect timeout',
      val: 10,
      type: 'text',
    },
    foreign_key_checks: {
      title: 'Foreign key checks',
      val: 1,
      type: 'radio',
      df: 1,
    },
    log_error_verbosity: {
      title: 'Log error verbosity',
      val: 2,
      type: 'select',
    },
    read_only: {
      title: 'Read-only',
      val: 0,
      type: 'radio',
      df: 0,
    },
  });
  const rules = computed(() => {
    return {
      max_connections: {
        val: {},
      },
    };
  });

  const msgErr = ref('');
  const saveLoading = ref(false);
  function saveSetting() {
    saveLoading.value = true;
    setTimeout(() => {
      saveLoading.value = false;
    }, 1500);
    // Save success
  }
</script>

<template>
  <div class="mysql-settings">
    <Alert variant="soft-primary">
      Press the button
      <Tippy
        class="bg-white dark:bg-darkmode-500"
        :as="Button"
        size="sm"
        content="Press the button next to each field for set to it default value"
        ><lucide icon="CornerRightDown" class="h-4 w-4"
      /></Tippy>
      next to each field for set to it default value.
    </Alert>
    <div class="my-5" v-if="saveLoading">
      <Alert variant="soft-success" class="flex items-center md:w-96 md:mx-auto">
        <Lucide icon="Check" class="h-8 w-8 mr-3" /> Dữ liệu đã được lưu
      </Alert>
    </div>
    <div class="mt-5" v-else>
      <Table sm striped>
        <Table.Tbody>
          <Table.Tr v-for="(k, idx) in Object.assign(initDemo)" :key="idx">
            <Table.Td>
              <p>{{ k.title }}</p>
              <div class="flex items-center">
                <b>{{ idx }}</b>
                <Tippy class="ml-3" as="span" content="Click to view details">
                  <Lucide icon="Info" class="h-5 w-5" />
                </Tippy>
              </div>
            </Table.Td>
            <Table.Td class="w-8/12">
              <div v-if="k.type === 'text'">
                <div class="flex">
                  <FormInput :type="k.type" v-model="k.val" class="mr-2" />
                  <Tippy
                    :as="Button"
                    size="sm"
                    variant="soft-secondary"
                    :content="'Set to default value: ' + k.val">
                    <lucide icon="CornerRightDown" class="h-4 w-4" />
                  </Tippy>
                </div>
              </div>
              <div class="flex" v-else-if="k.type === 'tomselectinput'">
                <TomSelectInput :value="k.val" class="grow mr-2" />
                <Tippy
                  :as="Button"
                  size="sm"
                  variant="soft-secondary"
                  :content="'Set to default value: ' + k.val">
                  <lucide icon="CornerRightDown" class="h-4 w-4" />
                </Tippy>
              </div>
              <div class="flex" v-else-if="k.type === 'select'">
                <FormSelect v-model="k.val" aria-label="Default select example" class="mr-2">
                  <option :value="lv" v-for="lv in 3">
                    Level {{ lv }} <span v-if="lv === 2" class="text-slate-400">(default)</span>
                  </option>
                </FormSelect>
                <Tippy
                  :as="Button"
                  size="sm"
                  variant="soft-secondary"
                  :content="'Set to default value: ' + k.val">
                  <lucide icon="CornerRightDown" class="h-4 w-4" />
                </Tippy>
              </div>
              <div class="flex" v-else-if="k.type === 'radio'">
                <div class="flex flex-col mr-2 sm:flex-row mr-auto">
                  <FormCheck class="mt-2 mr-2 sm:mt-0">
                    <FormCheck.Label :htmlFor="idx + '_one'" class="mr-2">
                      Yes <span v-if="k.df === 1" class="text-slate-400">(default)</span>
                    </FormCheck.Label>
                    <FormCheck.Input :id="idx + '_one'" type="radio" :name="idx" value="1" v-model="k.val" />
                  </FormCheck>
                  <FormCheck class="mt-2 mr-2 sm:mt-0">
                    <FormCheck.Label :htmlFor="idx + '_two'" class="mr-2">
                      No <span v-if="k.df === 0" class="text-slate-400">(default)</span>
                    </FormCheck.Label>
                    <FormCheck.Input :id="idx + '_two'" type="radio" :name="idx" value="0" v-model="k.val" />
                  </FormCheck>
                </div>
                <Tippy
                  :as="Button"
                  size="sm"
                  variant="soft-secondary"
                  :content="'Set to default value: ' + k.val">
                  <lucide icon="CornerRightDown" class="h-4 w-4" />
                </Tippy>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <div class="text-right mt-5">
        <Button type="button" variant="primary" @click="saveSetting()">
          <Lucide icon="Save" class="w-5 h-5 mr-2" />
          Save settings
        </Button>
      </div>
    </div>
  </div>
</template>
