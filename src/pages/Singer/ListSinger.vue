<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Table from '@/base-components/Table';
  import Button from '@/base-components/Button';
  import { FormInput } from '@/base-components/Form';
  import { t } from '@/config/i18n';
  import { SingerStore } from '@/stores/singer-store';
  import { ISinger } from '@/model/interface/ISinger';
  import { formatDate } from '@/utils/helper';
  import { ProfessionStore } from '@/stores/profession-store';
  import { IProfession } from '@/model/interface/IProfession';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  import { tryCallRequest } from '@/utils/my-function';
  import router from '@/router';


  // init value global
  const singerStore = SingerStore();
  const professionStore = ProfessionStore();
  const singers = computed(() => singerStore.singers as ISinger[]);
  const professions = computed(() => professionStore.professions as IProfession[]);

  const listHeader = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('name')),
          val: 'name'
        },
        {
          title: computed(() => t('birthday')),
          val: 'diskquota'
        },
        {
          title: computed(() => t('address')),
          val: 'bandwidth'
        },
        {
          title: computed(() => t('description')),
          val: 'ftp'
        },
        {
          title: computed(() => t('avatar')),
          val: 'mysql'
        },
        {
          title: computed(() => t('profession')),
          val: 'domain'
        },
        {
          title: computed(() => t('action')),
          val: 'action'
        },
      ],
    },
    sortField: {
      selected: '',
    },
  });

  // init value scope
  const showModalDelete = ref(false);
  const modalOptionDelete = { template: 'del' } as ModalConfig;
  const singerDelete = ref<ISinger>({ name: '' } as ISinger);

  async function actionDeleteProfession () {
    await tryCallRequest(async () => {
      //init request
      const request = { id: singerDelete.value.id } as ISinger;
      // call request
      await singerStore.remove(request);
      // call lai list profession
      await singerStore.list()
      // hide modal
      showModalDelete.value = false;
    });
  }

  onMounted(() => {
    singerStore.list()
    professionStore.list();
  })

</script>

<template>
  <div class="bg-white dark:bg-darkmode-900 shadow rounded p-3 mt-5">
    <div class="grid grid-cols-12 gap-6 mb-5 -intro-y">
      <div class="col-span-6 sm:col-span-12 lg:col-span-7 flex flex-col md:flex-row md:items-center">
        <div class="w-full lg:w-32 mb-3 md:mb-0 md:mr-3">
        </div>
      </div>
      <div class="col-span-6 sm:col-span-12 lg:col-span-5">
        <div class="relative w-full md:w-64 md:ml-auto">
          <FormInput type="search" :placeholder="t('find', { name: t('singer').toLowerCase() }) + '...'" class="pr-10 dark:border-slate-600" name="find-package" />
          <Button class="border-none shadow-none absolute inset-y-0 right-0 text-gray-400 hover:text-gray-600">
            <Lucide icon="Search" class="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto pk-content" ref="tableScrollH">
      <Table sm bordered hover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="whitespace-nowrap" v-for="th in listHeader.table.thead" :key="th.val">
              <Button class="border-none shadow-none">
                {{ th.title }}
                <Lucide icon="ChevronUp" class="w-4 h-4 ml-2" />
              </Button>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="singer in singers" :key="singer.name">
            <Table.Td>
              {{ singer.name }}
            </Table.Td>
            <Table.Td>
              {{ formatDate(singer.birthday, 'DD/MM/YYYY') }}
            </Table.Td>
            <Table.Td>
              {{ singer.address }}
            </Table.Td>
            <Table.Td>
              {{ singer.description ? String(singer.description).slice(0, 50) : '' }}...
            </Table.Td>
            <Table.Td>
              {{ singer.avatar }}
            </Table.Td>
            <Table.Td>
              {{ professions.find((p) => Number(singer.professions) === Number(p.id)).name }}
            </Table.Td>
            <Table.Td>
              <div class='flex items-center'>
                <Button size="sm" variant="secondary" class="mr-3" @click="router.push(`/singer/save-singer/${singer.id}`)">
                  <Lucide icon="FileSignature" class="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline-danger" class="mr-3" @click='showModalDelete = true; singerDelete = singer'>
                  <Lucide icon="Trash" class="w-4 h-4" />
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- BEGIN: Modal Delete IP Manager -->
    <HeadlessUiDialogModal :open-modal="showModalDelete" @closeModal="showModalDelete = false" :modal-options="modalOptionDelete" @call-back-action="actionDeleteProfession">
      <template #title>
        {{ t('are_you_sure', { action: t('delete').toLowerCase() }) }}
      </template>
      <template #modalbody>
        <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">{{ singerDelete.name }}</p>
        <div class="mt-2 text-slate-500">
          <p>{{ t('are_you_sure_1', { action: t('delete', { name: singerDelete.name }) }) }}</p>
          <p>{{ t('are_you_sure_2') }}</p>
        </div>
      </template>
    </HeadlessUiDialogModal>
    <!-- END: Modal Delete IP Manager -->
  </div>
</template>
