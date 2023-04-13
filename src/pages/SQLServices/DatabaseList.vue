<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Table from '@/base-components/Table';
  import { FormInput } from '@/base-components/Form';
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import { t } from '@/config/i18n';
  import { DatabaseStore } from '@/stores/database-store';
  import PageSizeCustom from '@/base-components/iCustom/PageSizeCustom.vue';
  import { defaultLimitPerPage, rangePerPage } from '@/utils/my-variables';
  import { tryCallRequest } from '@/utils/my-function';
  import { IDatabase } from '@/model/interface/IDatabase';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';

  const listAcc = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('database')),
          val: 'databasename',
        },
        {
          title: computed(() => t('owner')),
          val: 'owner',
        },
        {
          title: computed(() => t('username') + ' ' + t('database')),
          val: 'users',
        },
      ],
    },
    sortField: {
      selected: '',
    },
  });
  const filterSort = ref<any>({});

  function clickSort(_obj: Object) {
    return databaseList.value.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  }

  listAcc.value.table.thead.forEach((_it: any) => {
    if (!filterSort.value[_it.val]) {
      filterSort.value[_it.val] = { sort: false };
    }
  });

  //dattqh start
  const databaseStore = DatabaseStore();
  const databaseResponse = computed(() => databaseStore.databaseResponse);
  const supportedCharsetList = computed(() => databaseStore.listSupportedCharset);
  const databaseList = computed(() => {
    const data = databaseResponse.value.data ? (databaseResponse.value.data as IDatabase[]) : [];
    return data.filter(({ database_name, database_user }) =>
      [database_name, database_user].some((val) => val.toLowerCase().includes(find.value)),
    );
  });
  const tableScrollH = ref();
  const find = ref('');
  const perPageSelected = ref(defaultLimitPerPage);

  async function onPerPageChange(perPage: number) {
    databaseResponse.value.currentPage = 1;
    databaseResponse.value.offset = 0;
    databaseResponse.value.limit = perPage;
    await tryCallRequest(async () => {
      await databaseStore.actionGetListDatabase();
    });
  }

  async function onPageChange(page: number) {
    databaseResponse.value.currentPage = page;
    databaseResponse.value.offset = (databaseResponse.value.currentPage - 1) * databaseResponse.value.limit;
    await tryCallRequest(async () => {
      await databaseStore.actionGetListDatabase();
    });
  }

  //dattqh end
  onMounted(async () => {
    //init value
    await databaseStore.actionGetListDatabase();
    await databaseStore.actionGetListSupportedCharset();
    new tableScrollHorizontal(tableScrollH.value);
  });
</script>

<template>
  <div class="database-list">
    <div class="flex flex-col md:flex-row mb-2.5">
      <h3 class="text-xl font-medium grow">{{ t('list', { name: t('database') }) }}</h3>
    </div>
    <div class="flex flex-col-reverse md:flex-row mb-5">
      <div class="show-page flex items-center">
        <page-size-custom
          :per-page="rangePerPage"
          :per-page-selected="perPageSelected"
          @perpagechanged="onPerPageChange"
          class="w-full sm:w-44 lg:w-20 mb-3 md:mb-0 md:mr-3" />
      </div>
      <div class="grow"></div>
      <div class="search-box">
        <div class="relative">
          <FormInput
            type="search"
            :placeholder="t('find', { name: t('database') }) + '...'"
            class="pr-10 min-w-[150px]"
            name="find_database" />
          <Button class="border-none shadow-none absolute right-0 inset-y-0 text-slate-500">
            <Lucide icon="Search" class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    <div class="table-group">
      <div class="overflow-x-auto bg-white dark:bg-darkmode-800 -intro-y" ref="tableScrollH">
        <Table sm bordered striped hover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                class="whitespace-nowrap"
                v-for="th in listAcc.table.thead"
                :key="th.val"
                :class="th.tailwincss">
                <Button
                  class="border-none shadow-none"
                  @click="
                    clickSort(th);
                    filterSort[th.val].sort = !filterSort[th.val].sort;
                  ">
                  {{ th.title }}
                  <Lucide icon="ChevronUp" class="w-4 h-4 ml-2" v-if="filterSort[th.val].sort" />
                  <Lucide v-else icon="ChevronDown" class="w-4 h-4 ml-2" />
                </Button>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="databaseList.length === 0">
              <Table.Td colspan="10">
                <div class="flex items-center justify-center text-primary-three py-5">
                  <Lucide icon="AlertOctagon" class="mr-2 h-12 w-12" />
                  <span class="text-3xl">Data not found!</span>
                </div>
              </Table.Td>
            </Table.Tr>
            <template v-else>
              <Table.Tr
                v-for="item in databaseList"
                :key="item.id"
                class="text-slate-600 dark:text-slate-300">
                <Table.Td v-for="th in listAcc.table.thead" :key="th.val">
                  <div class="flex items-center" v-if="th.val === 'owner'">
                    <Lucide icon="User" class="w-5 h-5 mr-2" />
                    {{ item.owner }}
                  </div>
                  <div v-else-if="th.val === 'databasename'">
                    {{ item.database_name }}
                  </div>
                  <div v-else-if="th.val === 'users'">
                    <p class="font-medium text-center" v-if="!item.users || item.users.length === 0">
                      No associated users
                    </p>
                    <template v-else>
                      <div
                        class="flex items-center"
                        :class="{ 'border-b border-slate-200 pb-1.5 mb-1.5': index < item.users.length - 1 }"
                        v-for="(user, index) in item.users"
                        :key="user.id">
                        <span class="grow pr-3 w-32">
                          {{ user.user }}
                        </span>
                      </div>
                    </template>
                  </div>
                </Table.Td>
              </Table.Tr>
            </template>
          </Table.Tbody>
        </Table>
      </div>
      <!-- BEGIN: PAGINATION -->
      <pagination-custom
        :current-page="databaseResponse.currentPage"
        :total-pages="databaseResponse.totalPage"
        :per-page="rangePerPage"
        @pagechanged="onPageChange"
        @perpagechanged="onPerPageChange" />
      <!-- END: PAGINATION -->
    </div>
  </div>
</template>
