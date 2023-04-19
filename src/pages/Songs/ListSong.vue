<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Table from '@/base-components/Table';
  import Button from '@/base-components/Button';
  import { FormInput } from '@/base-components/Form';
  import { t } from '@/config/i18n';
  import { ISong } from '@/model/interface/ISong';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  import { toHHMMSS, tryCallRequest } from '@/utils/my-function';
  import router from '@/router';
  import { SongStore } from '@/stores/song-store';
  import { env } from '@/utils/my-variables';
  import ImageZoom from '@/base-components/ImageZoom/ImageZoom.vue';


  // init value global
  const songStore = SongStore();
  const songs = computed(() => songStore.songs as ISong[]);

  const listHeader = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('picture')),
          val: 'picture'
        },
        {
          title: computed(() => t('name', { field: t("song") })),
          val: 'name'
        },
        {
          title: computed(() => t('release')),
          val: 'release'
        },
        {
          title: computed(() => t('time')),
          val: 'time'
        },
        {
          title: computed(() => t('category')),
          val: 'category'
        },
        {
          title: computed(() => t('countries')),
          val: 'countries'
        },
        {
          title: computed(() => t('singer')),
          val: 'singer'
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
  const songDelete = ref<ISong>({ name: '' } as ISong);

  async function actionDeleteSong () {
    await tryCallRequest(async () => {
      //init request
      const request = { id: songDelete.value.id } as ISong;
      // call request
      await songStore.remove(request);
      // call lai list profession
      await songStore.list()
      // hide modal
      showModalDelete.value = false;
    });
  }

  onMounted(() => {
    songStore.list();
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
          <Table.Tr v-for="song in songs" :key="song.name">
            <Table.Td>
              <div class="w-10 h-10 image-fit">
                <ImageZoom :alt="song.name" :src="env.backendServer + song.picture" class='rounded' />
              </div>
            </Table.Td>
            <Table.Td>
              {{ song.name }}
            </Table.Td>
            <Table.Td>
              {{ song.release }}
            </Table.Td>
            <Table.Td>
              {{ toHHMMSS(String(song.time)) }}
            </Table.Td>
            <Table.Td>
              <span v-for='(category, idx) in song.categories' :key='category.name'>
                {{ category.name }}<span v-if='idx !== song.categories.length - 1'>, </span>
              </span>
            </Table.Td>
            <Table.Td>
              <span v-for='(country, idx) in song.countries' :key='country.name'>
                {{ country.name }}<span v-if='idx !== song.countries.length - 1'>, </span>
              </span>
            </Table.Td>
            <Table.Td>
              <span v-for='(singer, idx) in song.singers' :key='singer.name'>
                {{ singer.name }}<span v-if='idx !== song.singers.length - 1'>, </span>
              </span>
            </Table.Td>
            <Table.Td>
              <div class='flex items-center'>
                <Button size="sm" variant="secondary" class="mr-3" @click="router.push(`/admin/songs/save-songs/${song.id}`)">
                  <Lucide icon="FileSignature" class="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline-danger" class="mr-3" @click='showModalDelete = true; songDelete = song'>
                  <Lucide icon="Trash" class="w-4 h-4" />
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- BEGIN: Modal Delete IP Manager -->
    <HeadlessUiDialogModal :open-modal="showModalDelete" @closeModal="showModalDelete = false" :modal-options="modalOptionDelete" @call-back-action="actionDeleteSong">
      <template #title>
        {{ t('are_you_sure', { action: t('delete').toLowerCase() }) }}
      </template>
      <template #modalbody>
        <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">{{ songDelete.name }}</p>
        <div class="mt-2 text-slate-500">
          <p>{{ t('are_you_sure_1', { action: t('delete', { name: songDelete.name }) }) }}</p>
          <p>{{ t('are_you_sure_2') }}</p>
        </div>
      </template>
    </HeadlessUiDialogModal>
    <!-- END: Modal Delete IP Manager -->
  </div>
</template>
