<script setup lang="ts">
  import _ from 'lodash';
  import fakerData from '@/utils/faker';
  import { computed, defineAsyncComponent, ref } from 'vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import PackagesAddNewModal from '@/pages/Packages/partial/AddNewPackageModal.vue';
  import LoadingIcon from '@/base-components/LoadingIcon';
  import { onErrorCaptured } from 'vue';
  import Alert from '@/base-components/Alert';
  import { t } from '@/config/i18n';
  import { PackageStore } from '@/stores/package-store';
  import { IDataResponse } from '@/model/interface/IDataResponse';

  const packageStore = PackageStore();
  const listPackages = computed(() => packageStore.listPackage as IDataResponse);
  const error = ref<any>(null);
  const PackageList = defineAsyncComponent(() => import('@/pages/Packages/partial/PackagesDataList.vue'));
  const addNewPackageModal = ref(false);
  const listAccountSelect = ref<any>({});

  onErrorCaptured((e) => {
    error.value = e;
    return true;
  });
</script>

<template>
  <div class="flex flex-col md:flex-row items-center bg-white dark:bg-darkmode-600 mt-3 shadow rounded p-3">
    <div class="grow pr-5">
      {{ t('total_number_of_package') }}: <b>{{ listPackages.data.length }}</b>
    </div>
    <Button as="a" variant="primary" @click="addNewPackageModal = true">
      <Lucide icon="PackagePlus" class="h-5 w-5 mr-2" /> {{ t('button.create') }} {{ t('package') }}
    </Button>
  </div>
  <KeepAlive>
    <div class="mt-5" v-if="error">
      <Alert variant="soft-danger">
        {{ error }}
      </Alert>
    </div>
    <Suspense v-else>
      <template #default>
        <PackageList />
      </template>
      <template #fallback>
        <div class="p-5 flex flex-col items-center justify-center">
          <div class="h-12 w-12"><LoadingIcon icon="oval" /></div>
          <p class="text-slate-500 dark:text-slate-400">{{ t('alert.content.loading') }}...</p>
        </div>
      </template>
    </Suspense>
  </KeepAlive>
  <!-- BEGIN: Modal DiskUsage -->
  <PackagesAddNewModal
    :open-close="addNewPackageModal"
    @update:openClose="addNewPackageModal = false"
    :content="{ data: _.take(fakerData, 3), account: listAccountSelect }" />
  <!-- END: Modal DiskUsage -->
</template>
