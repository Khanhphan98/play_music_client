<script setup lang="ts">
  import { ref, onMounted, computed, reactive } from 'vue';
  import Table from '@/base-components/Table';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Alert from '@/base-components/Alert';
  import { FormInput, FormInline, FormLabel } from '@/base-components/Form';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { IpManagerStore } from '@/stores/ip-manager-store';
  import { IIpAddress } from '@/model/interface/IIpAddress';
  import { tryCallRequest } from '@/utils/my-function';
  import { rangePerPage, validateIpAddress, defaultLimitPerPage } from '@/utils/my-variables';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import { t } from '@/config/i18n';
  import { z } from 'zod';
  import { toFieldValidator } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  const ipManagerStore = IpManagerStore();
  const listIpAddress = computed(() => ipManagerStore.listIpAddress);
  const showIpCreate = computed(() => ipManagerStore.showIpCreate);
  const showIpDelete = computed(() => ipManagerStore.showIpDelete);
  const ipDeleted = ref<IIpAddress>({ ip: '' } as IIpAddress);
  const ipPrimary = ref<IIpAddress>({ ip: '' } as IIpAddress);
  const showModalDelete = ref(false);
  const showModalPrimary = ref(false);
  const modalOptionDelete = { template: 'del' } as ModalConfig;
  const modalOptionPrimary = { template: 'create' } as ModalConfig;
  //form data
  const formData = reactive({
    ip_address: '',
  });

  //Schema validate
  const schema = toFieldValidator(
    z.object({
      ip_address: z
        .string()
        .nonempty(t('alert.messages.required', { field: t('ip_address') }))
        .regex(validateIpAddress, t('alert.messages.regex', { field: t('ip_address') })),
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
      const request = {
        ip: values.ip_address,
      } as IIpAddress;
      await ipManagerStore.actionSaveIpAddress(request);
      // gọi lại list ip
      await ipManagerStore.actionGetListIpAddress();
      // reset form
      resetForm();
    });
  });

  async function actionDeleteIpAddress() {
    await tryCallRequest(async () => {
      if (ipDeleted.value) {
        // hide modal
        showModalDelete.value = false;
        // call request
        await ipManagerStore.actionDeleteIpAddress(ipDeleted.value);
        // gọi lại list ip
        await ipManagerStore.actionGetListIpAddress();
      }
    });
  }

  async function actionSetPrimaryIpAddress() {
    await tryCallRequest(async () => {
      if (ipPrimary.value) {
        // hide modal
        showModalPrimary.value = false;
        // call request
        await ipManagerStore.actionSetPrimaryIp(ipPrimary.value);
        // gọi lại list ip
        await ipManagerStore.actionGetListIpAddress();
      }
    });
  }

  async function onPageChange(page: number) {
    listIpAddress.value.currentPage = page;
    listIpAddress.value.offset = (listIpAddress.value.currentPage - 1) * listIpAddress.value.limit;
    await tryCallRequest(async () => {
      await ipManagerStore.actionGetListIpAddress();
    });
  }

  async function onPerPageChange(perPage: number) {
    listIpAddress.value.currentPage = 1;
    listIpAddress.value.offset = 0;
    listIpAddress.value.limit = perPage || defaultLimitPerPage;
    await tryCallRequest(async () => {
      await ipManagerStore.actionGetListIpAddress();
    });
  }

  onMounted(() => {
    ipManagerStore.actionGetListIpAddress();
  });
</script>

<template>
  <div>
    <p>{{ t('add_and_delete_ip_address_des') }}</p>
    <Transition>
      <Alert v-if="showIpCreate || showIpDelete" variant="soft-primary" class="text-center mt-5">
        <p v-if="showIpCreate">
          {{ t('ip_address') }} <b>{{ showIpCreate }}</b> {{ t('has_been_added_to_server') }}
        </p>
        <p v-if="showIpDelete">
          {{ t('ip_address') }} <b>{{ showIpDelete }}</b> {{ t('has_been_removed_from_your_server') }}
        </p>
      </Alert>
    </Transition>

    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 md:col-span-6">
        <form class="bg-white dark:bg-darkmode-600 rounded p-3 shadow-sm h-full" @submit="submitForm">
          <FormLabel htmlFor="ip_address">
            <span class="font-medium text-base">{{ t('ip_address') }}</span>
            <span class="text-slate-500 dark:text-slate-400 mt-1"
              >(IPv4. {{ t('like') }}: 127.0.0.1, 192.168.1.245)</span
            >
          </FormLabel>
          <div class="flex">
            <FormInput
              v-model="formData.ip_address"
              class="dark:border-slate-600"
              name="ip_address"
              id="ip_address"
              type="text"
              :placeholder="t('enter', { name: t('ip_address') })" />
            <div class="text-right shrink-0 pl-5">
              <Button variant="primary" type="submit" :disabled="isSubmitting">
                <Lucide icon="Plus" class="h-5 w-5 mr-2" />
                {{ t('add') }} {{ t('ip_address') }}
              </Button>
            </div>
          </div>
          <AlertCustom :errors="errors"></AlertCustom>
        </form>
      </div>
      <div class="col-span-12 md:col-span-6">
        <div class="bg-white dark:bg-darkmode-600 rounded p-3 shadow-sm">
          <div class="max-h-[55vh] overflow-y-auto border border-slate-200">
            <Table sm hover>
              <Table.Thead class="sticky top-0 bg-white dark:bg-darkmode-400 shadow-sm">
                <Table.Tr>
                  <Table.Th>
                    {{ t('ip_address') }}
                    <span class="text-xs text-slate-400">({{ listIpAddress.total || 0 }})</span>
                  </Table.Th>
                  <Table.Th class="w-32 text-center">
                    {{ t('action') }}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-for="ipAddress in listIpAddress.data" :key="ipAddress.ip">
                  <Table.Td>
                    <div class="flex items-center">
                      <Lucide v-if="ipAddress.is_primary" icon="Key" class="w-4 h-4 text-primary mr-2" />
                      <Lucide v-else icon="Network" class="w-4 h-4 text-slate-400 mr-2" />
                      <span
                        :class="ipAddress.is_primary ? 'font-medium' : 'text-slate-600 dark:text-slate-400'"
                        >{{ ipAddress.ip }}</span
                      >
                    </div>
                    <p v-if="ipAddress.reason" class="text-slate-500 dark:text-slate-400 ml-1.5 text-xs">
                      <span class="text-slate-300">|----</span> {{ t(ipAddress.reason) }}
                    </p>
                  </Table.Td>
                  <Table.Td class="text-right">
                    <div class="-mx-1.5">
                      <Button
                        v-show="!ipAddress.is_primary"
                        variant="soft-primary"
                        size="sm"
                        class="m-1.5"
                        @click="
                          ipPrimary = ipAddress;
                          showModalPrimary = true;
                        ">
                        <Lucide icon="Key" class="h-4 w-4" />
                      </Button>
                      <Button
                        v-show="ipAddress.deletable"
                        variant="soft-danger"
                        @click="
                          ipDeleted = ipAddress;
                          showModalDelete = true;
                        "
                        size="sm"
                        class="m-1.5">
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
              @call-back-action="actionDeleteIpAddress">
              <template #title>
                {{ t('are_you_sure', { action: t('delete').toLowerCase() }) }}
              </template>
              <template #modalbody>
                <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">{{ ipDeleted.ip }}</p>
                <div class="mt-2 text-slate-500">
                  <p>{{ t('are_you_sure_1', { action: t('delete', { name: ipDeleted.ip }) }) }}</p>
                  <p>{{ t('are_you_sure_2') }}</p>
                </div>
              </template>
            </HeadlessUiDialogModal>
            <!-- END: Modal Delete IP Manager -->
            <!-- BEGIN: Modal Primary IP Manager -->
            <HeadlessUiDialogModal
              :open-modal="showModalPrimary"
              @closeModal="showModalPrimary = false"
              :modal-options="modalOptionPrimary"
              @call-back-action="actionSetPrimaryIpAddress">
              <template #title>
                {{ t('are_you_sure', { action: t('change').toLowerCase() }) }}
              </template>
              <template #modalbody>
                <p class="text-base text-sky-600 py-2 px-3 rounded bg-light mt-1">{{ ipPrimary.ip }}</p>
                <div class="mt-2 text-slate-500">
                  <p>
                    {{ t('are_you_sure_1', { action: t('change', { name: ipPrimary.ip }).toLowerCase() }) }}
                  </p>
                </div>
              </template>
            </HeadlessUiDialogModal>
            <!-- END: Modal Primary IP Manager -->
          </div>
          <!-- BEGIN: PAGINATION -->
          <pagination-custom
            :current-page="listIpAddress.currentPage"
            :total-pages="listIpAddress.totalPage"
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
