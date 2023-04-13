<script setup lang="ts">
  import { FormSelect, FormInput } from '@/base-components/Form';
  import Table from '@/base-components/Table';
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import Pagination from '@/base-components/Pagination';
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import { onMounted, reactive, ref } from 'vue';
  const filterSort = ref<any>({});
  const initDemo = reactive({
    columns: [
      {
        title: 'Id',
        tdId: 'id',
      },
      {
        title: 'User',
        tdId: 'user',
      },
      {
        title: 'Host',
        tdId: 'host',
      },
      {
        title: 'Db',
        tdId: 'db',
      },
      {
        title: 'Command',
        tdId: 'command',
      },
      {
        title: 'Time',
        tdId: 'time',
      },
      {
        title: 'State',
        tdId: 'state',
      },
      {
        title: 'Info',
        tdId: 'info',
      },
      {
        title: 'Progress',
        tdId: 'progress',
      },
    ],
    rows: [],
    pagination: {
      showLen: 10,
    },
  });
  const deleteRowModal = ref(false);
  const delSelected = ref();
  initDemo.columns.forEach((_it: any) => {
    if (!filterSort.value[_it.tdId]) {
      filterSort.value[_it.tdId] = { sort: false };
    }
  });
  function clickSort(_obj: Object) {
    return initDemo.rows.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  }

  for (let i = 0; i < 10; i++) {
    initDemo.rows.push({
      id: i + 1,
      user: 'system user',
      host: 'localhost',
      db: '',
      command: 'Daemon',
      time: 22,
      state: 'InnoDB purge coordinator',
      info: '',
      progress: '0.000',
    });
  }
  const tableScollH = ref();
  onMounted(() => {
    new tableScrollHorizontal(tableScollH.value);
  });
</script>

<template>
  <div class="process-manager">
    <div class="flex items-center">
      <div class="mr-auto flex items-center">
        Show
        <FormSelect v-model="initDemo.pagination.showLen" class="w-20 mt-3 mx-2 sm:mt-0">
          <option :value="op * 5 + 5" v-for="op in 10">{{ op * 5 + 5 }}</option>
        </FormSelect>
        entries
      </div>
      <div class="pl-3 relative">
        <FormInput type="text" placeholder="Find..." class="min-w-[15rem] dark:border-darkmode-300" />
        <Button class="border-none shadow-none absolute right-0 inset-y-0">
          <Lucide icon="Search" class="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div class="overflow-x-auto mt-5" ref="tableScollH">
      <Table sm bordered striped hover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="whitespace-nowrap" v-for="(th, tid) in initDemo.columns" :key="tid">
              <Button
                class="border-none shadow-none flex"
                @click="
                  clickSort(th);
                  filterSort[th.tdId].sort = !filterSort[th.tdId].sort;
                ">
                {{ th.title }}
                <Lucide icon="ChevronUp" class="w-4 h-4 ml-2" v-if="filterSort[th.tdId].sort" />
                <Lucide v-else icon="ChevronDown" class="w-4 h-4 ml-2" />
              </Button>
            </Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="(td, tdI) in initDemo.rows" :key="tdI">
            <Table.Td v-for="(th, thI) in initDemo.columns" :key="thI">
              {{ td[th.tdId] }}
            </Table.Td>
            <Table.Td>
              <Button
                size="sm"
                variant="soft-danger"
                @click="
                  delSelected = td.user;
                  deleteRowModal = true;
                ">
                <Lucide icon="Trash" class="h-4 w-4" />
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <div class="flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap">
      <Pagination class="w-full sm:w-auto sm:mr-auto">
        <Pagination.Link>
          <Lucide icon="ChevronsLeft" class="w-4 h-4" />
        </Pagination.Link>
        <Pagination.Link>
          <Lucide icon="ChevronLeft" class="w-4 h-4" />
        </Pagination.Link>
        <Pagination.Link>...</Pagination.Link>
        <Pagination.Link>1</Pagination.Link>
        <Pagination.Link active>2</Pagination.Link>
        <Pagination.Link>3</Pagination.Link>
        <Pagination.Link>...</Pagination.Link>
        <Pagination.Link>
          <Lucide icon="ChevronRight" class="w-4 h-4" />
        </Pagination.Link>
        <Pagination.Link>
          <Lucide icon="ChevronsRight" class="w-4 h-4" />
        </Pagination.Link>
      </Pagination>
      <FormSelect v-model="initDemo.pagination.showLen" class="w-20 mt-3 !box sm:mt-0">
        <option :value="op * 5 + 5" v-for="op in 10">{{ op * 5 + 5 }}</option>
      </FormSelect>
    </div>
  </div>
  <iNETCustom.deletemodal
    :open-close="deleteRowModal"
    @update:openClose="deleteRowModal = false"
    :btn-name="'Kill'">
    <p class="text-xl">
      Are you kill <b>{{ delSelected }}</b>
    </p>
  </iNETCustom.deletemodal>
</template>
