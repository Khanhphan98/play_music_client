<script setup lang="ts">
  import _ from 'lodash';
  import fakerData from '@/utils/faker';
  import { onMounted, ref } from 'vue';
  import PageSizeCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import { defaultLimitPerPage, rangePerPage } from '@/utils/my-variables';
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import { FormSelect, FormInput, FormCheck, FormLabel, FormSwitch } from '@/base-components/Form';
  import Table from '@/base-components/Table';
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { aclDataMock } from '@/pages/UserAccount/partial/acl-data-mock';
  import AclHorizontalView from '@/pages/UserAccount/partial/AclHorizontalView.vue';
  import AclVerticalView from '@/pages/UserAccount/partial/AclVerticalView.vue';
  import HeadlessUiMenuDropdown from '@/base-components/iCustom/HeadlessUiMenuDropdown.vue';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import Avatar from '@/base-components/iCustom/Avatar.vue';
  import { t } from '@/config/i18n';

  const perPageSelected = ref(defaultLimitPerPage);
  const statusSelected = ref('');
  const findUser = ref('');
  const tableScrollH = ref();
  onMounted(async () => {
    new tableScrollHorizontal(tableScrollH.value);
  });
  const tableSolution = ref(false);
  const addNewAcl = ref(false);
  const editNewAcl = ref(false);
  const deleteAcl = ref(false);
  const editAclSelected = ref({
    name: '',
  });
</script>

<template>
  <div class="p-3 bg-white dark:bg-darkmode-900 rounded mt-5 -intro-y shadow-md">
    <div class="grid grid-cols-12 gap-6 mb-5">
      <div class="col-span-6 sm:col-span-12 lg:col-span-5 flex flex-col md:flex-row">
        <div class="w-full lg:w-32 mb-3 md:mb-0 md:mr-3">
          <Button variant="primary" class="w-full md:w-auto" @click="addNewAcl = true">
            <Lucide icon="UserPlus" class="mr-2 h-5 w-5 shrink-0" />
            Tạo ACL
          </Button>
        </div>
      </div>
      <div class="col-span-6 sm:col-span-12 lg:col-span-7">
        <div class="flex flex-col md:flex-row items-center justify-end">
          <div class="relative w-full lg:w-64 mb-3 md:mb-0 md:mr-3">
            <FormInput
              type="search"
              :placeholder="t('find', { name: t('username') }) + '...'"
              v-model="findUser"
              class="pr-10 dark:border-slate-600"
              name="find-user"
              @change="actionFindAccount" />
            <Button
              class="border-none shadow-none absolute inset-y-0 right-0 text-gray-400 hover:text-gray-600"
              @click="actionFindAccount">
              <Lucide icon="Search" class="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto" ref="tableScrollH">
      <Table sm hover bordered>
        <Table.Thead>
          <Table.Tr>
            <Table.Th> Tên ACL </Table.Th>
            <Table.Th class="w-48 text-center"> Số lượng User </Table.Th>
            <Table.Th class="w-32 text-right"> Hành động </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="(list, id) in _.take(fakerData, 10)" :key="id">
            <Table.Td>
              <div class="flex items-center font-medium">
                <Avatar :avt-json="list.users[0]" key-str="name" class="mr-2 shrink-0" />
                {{ list.users[0].name }}
              </div>
            </Table.Td>
            <Table.Td class="text-center">
              <div class="inline-flex items-center p-2 border border-slate-200 rounded-md">
                <Lucide icon="User" class="w-5 h-5 text-slate-400 dark:text-slate-500 mr-2" />
                <span class="text-slate-500 dark:text-slate-400">{{
                  Math.ceil(10 * Math.random(10 * id))
                }}</span>
              </div>
            </Table.Td>
            <Table.Td class="text-right">
              <div class="-mx-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  @click="
                    editNewAcl = true;
                    editAclSelected.name = list.users[0].name;
                  "
                  class="m-1.5">
                  <Lucide icon="Edit" class="w-4 h-4" />
                </Button>
                <Button
                  variant="soft-danger"
                  size="sm"
                  class="m-1.5"
                  @click="
                    deleteAcl = true;
                    editAclSelected.name = list.users[0].name;
                  ">
                  <Lucide icon="Trash" class="w-4 h-4" />
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <pagination-custom :currentPage="1" :perPage="[10, 20, 50]" totalPages="200" />
  </div>
  <HeadlessUiDialogModal :open-modal="addNewAcl" @closeModal="addNewAcl = false" :modal-options="{}">
    <template #title> Tạo mới ACL </template>
    <template #modalbody>
      <div class="mb-5">
        <FormLabel htmlFor="acl-name">ACL Name</FormLabel>
        <FormInput id="acl-name" type="text" placeholder="Nhập tên ACL" />
      </div>
      <AclVerticalView />
    </template>
  </HeadlessUiDialogModal>
  <!--  BEGIN: Edit Acl-->
  <HeadlessUiDialogModal :open-modal="editNewAcl" @closeModal="editNewAcl = false">
    <template #title>
      {{ editAclSelected.name }}
    </template>
    <template #modalbody>
      <AclVerticalView />
    </template>
  </HeadlessUiDialogModal>
  <!--  BEGIN: Delete Acl-->
  <HeadlessUiDialogModal
    :open-modal="deleteAcl"
    @closeModal="deleteAcl = false"
    :modal-options="{ template: 'del' }">
    <template #title> Bạn chắc chắn muốn xoá </template>
    <template #modalbody>
      <p class="text-xl text-center mt-3">
        ACL <b>{{ editAclSelected.name }}</b>
      </p>
    </template>
  </HeadlessUiDialogModal>
</template>
