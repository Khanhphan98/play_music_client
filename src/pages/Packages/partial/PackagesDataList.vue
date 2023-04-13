<script setup lang="ts">
  import { ref, onMounted, computed, reactive } from 'vue';
  import Button from '@/base-components/Button';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import { FormInput, FormSelect, FormSwitch } from '@/base-components/Form';
  import Lucide from '@/base-components/Lucide';
  import Table from '@/base-components/Table';
  import { formatBytes } from '@/utils/helper';
  import PackagesEditModal from '@/pages/Packages/partial/EditPackageModal.vue';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import { t } from '@/config/i18n';
  import { defaultLimitPerPage, rangePerPage } from '@/utils/my-variables';
  import { PackageStore } from '@/stores/package-store';
  import { IDataResponse } from '@/model/interface/IDataResponse';
  import PageSizeCustom from '@/base-components/iCustom/PageSizeCustom.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  import { IPackage } from '@/model/interface/IPackage';
  import { tryCallRequest } from '@/utils/my-function';
  import { RoleUser } from '@/model/interface/IAccount';

  const listPackageHead = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('name')),
          val: 'name',
          show: true,
        },
        {
          title: computed(() => t('diskquota') + ' (MB)'),
          val: 'diskquota',
          show: true,
        },
        {
          title: computed(() => t('bandwidth') + ' (MB)'),
          val: 'bandwidth',
          show: true,
        },
        {
          title: computed(() => 'Ftp'),
          val: 'ftp',
          show: true,
        },
        {
          title: computed(() => 'Mysql'),
          val: 'mysql',
          show: true,
        },
        {
          title: computed(() => t('domain')),
          val: 'domain',
          show: true,
        },
        {
          title: computed(() => t('owner')),
          val: 'owner',
          show: false,
        },
        {
          title: computed(() => t('limits')),
          val: 'limits',
          show: false,
        },
        {
          title: computed(() => t('action')),
          val: 'action',
          show: true,
        },
      ],
    },
    sortField: {
      selected: '',
    },
    rolePackage: [
      { name: 'all', value: '' },
      { name: 'reseller', value: RoleUser.RESELLER },
      { name: 'username', value: RoleUser.END_USER },
    ],
  });

  // init value
  const packageStore = PackageStore();
  const listPackages = computed(() => packageStore.listPackage as IDataResponse);
  const getListPackages = computed(() => listPackages.value.data as IPackage[]);

  const listAccountSelect = ref<any>({});
  const findPackage = ref('');

  // BEGIN: Edit Package
  const editPackageModal = ref(false);
  function saveFileEditor() {
    console.log('save');
  }
  // END: Edit DNS Zone

  // BEGIN: Delete Account
  const viewMore = ref(false);
  const showModalDelete = ref(false);
  const modalOption = { template: 'del' } as ModalConfig;
  const packageSelected = ref<IPackage>({ name: '' } as IPackage);

  // chuyển tất cả showdf có value bằng show
  function setShowdf() {
    for (const item of listPackageHead.value.table.thead) {
      item.showdf = item.show;
    }
  }

  // nếu viewMore = true thì set show bằng true
  // nếu viewMore = false thì set show bằng showdf trước đã đó set
  function viewMoreColumns() {
    for (const item of listPackageHead.value.table.thead) {
      item.show = viewMore.value ? true : item.showdf;
    }
  }

  function clickSort({ val, sort }: { val: string; sort: boolean }) {
    listPackages.value.data.sort((a: any, b: any) =>
      sort ? (a[val] > b[val] ? 1 : -1) : a[val] < b[val] ? 1 : -1,
    );
  }

  async function onPageChange(page: number) {
    listPackages.value.currentPage = page;
    listPackages.value.offset = (listPackages.value.currentPage - 1) * listPackages.value.limit;
    await tryCallRequest(async () => {
      await packageStore.actionGetListPackage();
    });
  }

  async function onPerPageChange(perPage: number = defaultLimitPerPage) {
    listPackages.value.currentPage = 1;
    listPackages.value.offset = 0;
    listPackages.value.limit = perPage;
    await tryCallRequest(async () => {
      await packageStore.actionGetListPackage();
    });
  }

  async function actionDeletePackage() {
    if (packageSelected.value) {
      await tryCallRequest(async () => {
        const packageDelete = { id: packageSelected.value.id } as IPackage;
        // request delete package
        await packageStore.actionDeletePackage(packageDelete);
        // get list package
        await packageStore.actionGetListPackage();
        // hide modal
        showModalDelete.value = false;
      });
    }
  }

  async function actionFilterPackage() {
    listPackages.value.filter.target_username = listPackageHead.value.sortField.selected;
    await tryCallRequest(async () => {
      await packageStore.actionGetListPackage();
    });
  }

  async function actionFindPackage() {
    listPackages.value.currentPage = 1;
    listPackages.value.offset = 0;
    listPackages.value.filter.search_name = findPackage.value;
    await tryCallRequest(async () => {
      await packageStore.actionGetListPackage();
    });
  }

  const tableScrollH = ref();
  onMounted(() => {
    new tableScrollHorizontal(tableScrollH.value);
    // update view more
    setShowdf();
  });
</script>

<template>
  <div class="bg-white dark:bg-darkmode-900 shadow rounded p-3 mt-5">
    <div class="grid grid-cols-12 gap-6 mb-5 -intro-y">
      <div class="col-span-6 sm:col-span-12 lg:col-span-7 flex flex-col md:flex-row md:items-center">
        <page-size-custom
          :per-page="rangePerPage"
          :per-page-selected="defaultLimitPerPage"
          @perpagechanged="onPerPageChange"
          class="w-full sm:w-44 lg:w-20 mb-3 md:mb-0 md:mr-3" />
        <div class="w-full lg:w-32 mb-3 md:mb-0 md:mr-3">
          <FormSelect
            v-model="listPackageHead.sortField.selected"
            @change="actionFilterPackage"
            aria-label="Show"
            name="">
            <option v-for="item in listPackageHead.rolePackage" :value="item.value">
              {{ t(item.name) }}
            </option>
          </FormSelect>
        </div>
        <div>
          <FormSwitch>
            <FormSwitch.Input
              id="view-more-columns"
              type="checkbox"
              v-model="viewMore"
              @change="viewMoreColumns" />
            <FormSwitch.Label htmlFor="view-more-columns">{{ t('view_more_columns') }}</FormSwitch.Label>
          </FormSwitch>
        </div>
      </div>
      <div class="col-span-6 sm:col-span-12 lg:col-span-5">
        <div class="relative w-full md:w-64 md:ml-auto">
          <FormInput
            type="search"
            :placeholder="t('find', { name: t('package').toLowerCase() }) + '...'"
            class="pr-10 dark:border-slate-600"
            v-model="findPackage"
            name="find-package"
            @change="actionFindPackage" />
          <Button
            class="border-none shadow-none absolute inset-y-0 right-0 text-gray-400 hover:text-gray-600"
            @click="actionFindPackage">
            <Lucide icon="Search" class="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto pk-content" ref="tableScrollH">
      <Table sm bordered hover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              class="whitespace-nowrap"
              v-for="th in listPackageHead.table.thead"
              :key="th.val"
              v-show="th.show">
              <Button
                class="border-none shadow-none"
                @click="
                  clickSort(th);
                  th.sort = !th.sort;
                ">
                {{ th.title }}
                <Lucide icon="ChevronUp" class="w-4 h-4 ml-2" />
              </Button>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="getListPackages.length === 0">
            <Table.Td :colspan="listPackageHead.table.thead.length">
              <div class="flex items-center justify-center text-primary-three py-5">
                <Lucide icon="AlertOctagon" class="mr-2 h-12 w-12" />
                <span class="text-3xl">{{ t('data_not_found') }}</span>
              </div>
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="item in getListPackages" :key="item.name">
            <Table.Td v-for="th in listPackageHead.table.thead" v-show="th.show">
              <div v-if="th.val === 'name'">
                <p>{{ item.name }}</p>
                <p>{{ t('username') }}: {{ item.num_users }}</p>
              </div>
              <div v-else-if="th.val === 'diskquota'">
                <p>{{ formatBytes(item.disk_space) }}</p>
              </div>
              <div v-else-if="th.val === 'bandwidth'">
                <p>{{ formatBytes(item.bandwidth) }}</p>
              </div>
              <div v-else-if="th.val === 'ftp'">
                <p>{{ item.ftp }}</p>
              </div>
              <div v-else-if="th.val === 'mysql'">
                <p>{{ item.databases }}</p>
              </div>
              <div v-else-if="th.val === 'domain'">
                <p>{{ item.domains }}</p>
              </div>
              <div v-else-if="th.val === 'owner'">
                <p>{{ item.owner }}</p>
              </div>
              <div v-else-if="th.val === 'limits'">
                <p>speed: {{ item.speed }}</p>
                <p>pmem: {{ item.pmem }}</p>
                <p>io: {{ item.io }}</p>
                <p>iops: {{ item.iops }}</p>
                <p>ep: {{ item.ep }}</p>
                <p>nproc: {{ item.nproc }}</p>
                <p>inodes_soft: {{ item.inodes_soft }}</p>
                <p>inodes_hard: {{ item.inodes_hard }}</p>
              </div>
              <div v-else-if="th.val === 'action'" class="flex items-center">
                <Button size="sm" variant="secondary" class="mr-3" @click="editPackageModal = true">
                  <Lucide icon="FileSignature" class="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  class="mr-3"
                  @click="
                    packageSelected = item;
                    showModalDelete = true;
                  ">
                  <Lucide icon="Trash" class="w-4 h-4" />
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <!-- BEGIN: Modal Edit DNS Zone  -->
      <PackagesEditModal
        :content="listAccountSelect"
        :open-close="editPackageModal"
        @update:openClose="editPackageModal = false"
        @savePackages="saveFileEditor" />
      <!-- END: Modal BandWidth -->
      <!-- BEGIN: Modal Delete Account -->
      <HeadlessUiDialogModal
        :open-modal="showModalDelete"
        @closeModal="showModalDelete = false"
        :modal-options="modalOption"
        @call-back-action="actionDeletePackage">
        <template #title>
          {{ t('are_you_sure', { action: t('delete').toLowerCase() }) }}
        </template>
        <template #modalbody>
          <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">{{ packageSelected.name }}</p>
          <div class="mt-2 text-slate-500">
            <p>{{ t('are_you_sure_1', { action: t('delete', { name: packageSelected.name }) }) }}</p>
            <p>{{ t('are_you_sure_2') }}</p>
          </div>
        </template>
      </HeadlessUiDialogModal>
      <!-- END: Modal Delete Account -->
    </div>
    <pagination-custom
      :currentPage="listPackages.currentPage"
      :total-pages="listPackages.totalPage"
      :per-page="rangePerPage"
      @pagechanged="onPageChange"
      @perpagechanged="onPerPageChange" />
  </div>
</template>

<style lang="scss">
  .pk-content.active {
    &:hover {
      cursor: grab;
    }
  }
</style>
