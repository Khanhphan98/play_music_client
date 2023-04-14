<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { ProfessionStore } from '@/stores/profession-store';
  import { UserStore } from '@/stores/user-store';
  import { IProfession } from '@/model/interface/IProfession';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Table from '@/base-components/Table';
  import Button from '@/base-components/Button';
  import { FormInput } from '@/base-components/Form';
  import { t } from '@/config/i18n';

  // init value
  const professionStore = ProfessionStore();
  const userStore = UserStore();


  const headers = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('name')),
          val: 'name',
          show: true,
        }
      ],
    },
    sortField: {
      selected: '',
    },
  });
  const professions = computed(() => professionStore.professions as IProfession[]);

  onMounted(() => {
    professionStore.list(userStore.myUser.access_token)
  })

</script>

<template>
  <div class="bg-white dark:bg-darkmode-900 shadow rounded p-3 mt-5">
    <div class="grid grid-cols-12 gap-6 mb-5 -intro-y">
      <div class="col-span-6 sm:col-span-12 lg:col-span-12">
        <div class="relative w-full md:w-64 md:ml-auto">
          <FormInput
            type="search"
            class="pr-10 dark:border-slate-600"
            name="find-package"
          />
          <Button class="border-none shadow-none absolute inset-y-0 right-0 text-gray-400 hover:text-gray-600">
            <Lucide icon="Search" class="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
    <div class="col-span-12 md:col-span-6" ref="tableScrollH">
      <Table sm bordered hover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="whitespace-nowrap" v-for="th in headers.table.thead" :key="th.val">
              <Button class="border-none shadow-none">
                {{ th.title }}
                <Lucide icon="ChevronUp" class="w-4 h-4 ml-2" />
              </Button>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="item in professions" :key="item.name">
            <Table.Td>{{ item.name }}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
</template>
