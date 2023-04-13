<script setup lang="ts">
  import { ref, onMounted, computed, reactive } from 'vue';
  import Table from '@/base-components/Table';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Alert from '@/base-components/Alert';
  import { FormInput, FormLabel } from '@/base-components/Form';
  import { tryCallRequest } from '@/utils/my-function';
  import { rangePerPage, defaultLimitPerPage, validateIpAddress } from '@/utils/my-variables';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import { t } from '@/config/i18n';
  import { z } from 'zod';
  import { toFieldValidator } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { IpGroupManagerStore } from '@/stores/ip-group-manager-store';
  import { IIpGroup } from '@/model/interface/IIpGroup';
  import { IDataResponse } from '@/model/interface/IDataResponse';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';

  // init variable store
  const ipGroupManagerStore = IpGroupManagerStore();
  const listIpGroup = computed(() => ipGroupManagerStore.listIpGroup as IDataResponse);
  const getListIpGroup = computed(() => listIpGroup.value.data as IIpGroup[]);
  const showIpGroupCreate = computed(() => ipGroupManagerStore.showIpGroupCreate);
  const showIpGroupDelete = computed(() => ipGroupManagerStore.showIpGroupDelete);
  // init variable component
  const showModalDelete = ref(false);
  const modalOptionDelete = { template: 'del' } as ModalConfig;
  const ipGroupDeleted = ref<IIpGroup>({ name: '' } as IIpGroup);
  //form data
  const formData = reactive({
    name: '',
    ip_address: [''],
  });

  //Schema validate
  const schema = toFieldValidator(
    z.object({
      name: z.string().nonempty(t('alert.messages.required', { field: t('name') + ' ' + t('ip_group') })),
    }),
  );

  //Form action
  const { handleSubmit, errors, isSubmitting, resetForm } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });

  const submitForm = handleSubmit(async (values) => {
    await tryCallRequest(async () => {
      //init request
      const request = { name: values.name, ips: formData.ip_address } as IIpGroup;
      // call request
      await ipGroupManagerStore.actionSaveIpGroup(request);
      // gọi lại list ip group
      await ipGroupManagerStore.actionGetListIpGroup();
      // reset form
      resetForm();
    });
  });

  async function actionDeleteIpGroup() {
    await tryCallRequest(async () => {
      if (ipGroupDeleted.value) {
        // hide modal
        showModalDelete.value = false;
        // call request
        await ipGroupManagerStore.actionDeleteIpGroup(ipGroupDeleted.value);
        // gọi lại list ip
        await ipGroupManagerStore.actionGetListIpGroup();
      }
    });
  }

  async function onPageChange(page: number) {
    listIpGroup.value.currentPage = page;
    listIpGroup.value.offset = (listIpGroup.value.currentPage - 1) * listIpGroup.value.limit;
    await tryCallRequest(async () => {
      await ipGroupManagerStore.actionGetListIpGroup();
    });
  }

  async function onPerPageChange(perPage: number) {
    listIpGroup.value.currentPage = 1;
    listIpGroup.value.offset = 0;
    listIpGroup.value.limit = perPage || defaultLimitPerPage;
    await tryCallRequest(async () => {
      await ipGroupManagerStore.actionGetListIpGroup();
    });
  }

  onMounted(async () => {
    await ipGroupManagerStore.actionGetListIpGroup();
  });
</script>

<template>
  <div>
    <p>{{ t('add_and_delete_ip_address_des') }}</p>
    <Transition>
      <Alert v-if="showIpGroupCreate || showIpGroupDelete" variant="soft-primary" class="text-center mt-5">
        <p v-if="showIpGroupCreate">
          {{ t('ip_group') }} <b>{{ showIpGroupCreate }}</b> {{ t('has_been_added_to_server') }}
        </p>
        <p v-if="showIpGroupDelete">
          {{ t('ip_group') }} <b>{{ showIpGroupDelete }}</b> {{ t('has_been_removed_from_your_server') }}
        </p>
      </Alert>
    </Transition>

    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 md:col-span-6">
        <form class="bg-white dark:bg-darkmode-600 rounded p-3 shadow-sm h-full" @submit="submitForm">
          <AlertCustom :errors="errors" class="mb-3 mt-0"></AlertCustom>
          <div class="name-group">
            <FormLabel htmlFor="ip-group">
              <span class="font-medium text-base">{{ t('ip_group') }}</span>
              <span class="text-slate-500 dark:text-slate-400 mt-1"
                >({{ t('automatically_create_groups_ipv4_a_group_3_ips') }})</span
              >
            </FormLabel>
            <FormInput
              class="dark:border-slate-600"
              v-model="formData.name"
              name="name"
              id="name"
              type="text"
              :placeholder="t('enter', { name: t('name').toLowerCase() + ' ' + t('ip_group') })" />
          </div>
          <div class="ip-item mt-3" v-for="(ip, idx) in formData.ip_address" :key="idx">
            <div class="flex items-center">
              <FormInput
                type="text"
                class="dark:border-slate-600"
                :name="'ipItem' + idx"
                :id="'ipItem' + idx"
                :placeholder="t('enter', { name: t('ip_address') })"
                v-model="formData.ip_address[idx]" />
              <div class="pl-5 shrink-0">
                <Button
                  v-if="idx == 0"
                  type="button"
                  variant="soft-primary"
                  @click="formData.ip_address.push('')">
                  <Lucide icon="Plus" class="w-4 h-4 mr-2" /> {{ t('add') }} {{ t('ip_address') }}
                </Button>
                <Button
                  v-if="idx > 0"
                  type="button"
                  variant="soft-danger"
                  @click.stop="formData.ip_address.splice(idx, 1)">
                  <Lucide icon="X" class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div class="text-right mt-10">
            <Button variant="primary" type="submit" :disabled="isSubmitting">
              <Lucide icon="ListPlus" class="h-5 w-5 mr-2" />
              {{ t('add') }} {{ t('ip_group') }}
            </Button>
          </div>
        </form>
      </div>
      <div class="col-span-12 md:col-span-6">
        <div class="bg-white dark:bg-darkmode-600 rounded p-3 shadow-sm h-full">
          <div class="max-h-[55vh] overflow-y-auto border border-slate-200">
            <Table sm hover>
              <Table.Thead class="sticky top-0 bg-white dark:bg-darkmode-400 shadow-sm">
                <Table.Tr>
                  <Table.Th>
                    {{ t('ip_group_manager') }}
                  </Table.Th>
                  <Table.Th class="w-32 text-center">
                    {{ t('action') }}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-for="ipGroup in getListIpGroup" :key="ipGroup.name">
                  <Table.Td>
                    <div class="flex items-center">
                      <Lucide icon="Network" class="w-4 h-4 text-slate-400 mr-2" />
                      <span :class="ipGroup.name ? 'font-medium' : 'text-slate-600 dark:text-slate-400'">{{
                        ipGroup.name
                      }}</span>
                    </div>
                    <p v-if="ipGroup.ips" class="text-slate-500 dark:text-slate-400 ml-1.5 text-xs grid">
                      <span class="text-slate-300 mt-1" v-for="ip in ipGroup.ips" :key="ip"
                        >|---- {{ ip }}</span
                      >
                    </p>
                  </Table.Td>
                  <Table.Td class="text-center">
                    <div class="-mx-1.5">
                      <Button variant="soft-primary" size="sm" class="m-1.5">
                        <Lucide icon="Edit" class="h-4 w-4" />
                      </Button>
                      <Button
                        variant="soft-danger"
                        size="sm"
                        class="m-1.5"
                        @click="
                          ipGroupDeleted = ipGroup;
                          showModalDelete = true;
                        ">
                        <Lucide icon="Trash" class="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            <!-- BEGIN: Modal Delete IP Manager -->
            <HeadlessUiDialogModal
              :open-modal="showModalDelete"
              @closeModal="showModalDelete = false"
              :modal-options="modalOptionDelete"
              @call-back-action="actionDeleteIpGroup">
              <template #title>
                {{ t('are_you_sure', { action: t('delete').toLowerCase() }) }}
              </template>
              <template #modalbody>
                <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">{{ ipGroupDeleted.name }}</p>
                <div class="mt-2 text-slate-500">
                  <p>{{ t('are_you_sure_1', { action: t('delete', { name: ipGroupDeleted.name }) }) }}</p>
                  <p>{{ t('are_you_sure_2') }}</p>
                </div>
              </template>
            </HeadlessUiDialogModal>
            <!-- END: Modal Delete IP Manager -->
          </div>
          <!-- BEGIN: PAGINATION -->
          <pagination-custom
            :current-page="listIpGroup.currentPage"
            :total-pages="listIpGroup.totalPage"
            :per-page="rangePerPage"
            @pagechanged="onPageChange"
            @perpagechanged="onPerPageChange" />
          <!-- END: PAGINATION -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* we will explain what these classes do next! */
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
