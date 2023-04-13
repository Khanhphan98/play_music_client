<script setup lang="ts">
  import { computed, defineAsyncComponent, markRaw, onMounted, ref } from 'vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Tippy from '@/base-components/Tippy';
  import { Tab } from '@/base-components/Headless';
  import { DatabaseStore } from '@/stores/database-store';
  import { t } from '@/config/i18n';

  const restartMySQL = ref(false);

  function downloadCSVFile(csv_data: string[]) {
    // Create CSV file object and feed
    // our csv_data into it
    const CSVFile = new Blob([csv_data], {
      type: 'text/csv',
    });

    // Create to temporary link to initiate
    // download process
    const temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = 'user-account-list.csv';
    const url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = 'none';
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
  }

  // END: Export CSV
  // BEGIN: Package Change
  const infomationMobileToggle = ref(false);
  // END: Package Change

  //dattqh start
  const databaseStore = DatabaseStore();
  const databaseInfo = computed(() => databaseStore.databaseInfo as string);

  const categories = [
    {
      title: computed(() => t('list', { name: t('database') })),
      component: markRaw(defineAsyncComponent(() => import('@/pages/SQLServices/DatabaseList.vue'))),
    },
    {
      title: computed(() => t('mysql_setting')),
      component: markRaw(defineAsyncComponent(() => import('@/pages/SQLServices/MySQLManagerSettings.vue'))),
    },
    {
      title: computed(() => t('process_manager')),
      component: markRaw(defineAsyncComponent(() => import('@/pages/SQLServices/ProcessesManager.vue'))),
    },
  ];

  onMounted(async () => {
    //get info dbms
    await databaseStore.actionGetInfo();
  });
  //dattqh end
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-11 md:col-span-8 lg:col-span-9">
      <div class="w-full">
        <Tab.Group>
          <Tab.List class="flex space-x-1 rounded-md bg-secondary dark:bg-darkmode-900 p-1">
            <Tab v-for="(cate, index) in categories" as="template" :key="index" v-slot="{ selected }">
              <button
                :class="[
                  'w-full rounded py-2.5 text-sm font-medium leading-5 text-black dark:text-white/50',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400',
                  selected ? 'bg-white dark:bg-darkmode-200 shadow' : 'hover:bg-white/[0.2]',
                ]">
                {{ cate.title.value }}
              </button>
            </Tab>
          </Tab.List>

          <Tab.Panels class="mt-2">
            <Tab.Panel
              v-for="item in categories"
              :class="[
                'rounded-md bg-white dark:bg-darkmode-900 p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400',
              ]">
              <component :is="item.component" />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
    <!--    BEGIN: Sidebar Right-->
    <div class="col-span-1 md:col-span-4 lg:col-span-3 relative">
      <Tippy
        variant="secondary"
        class="md:hidden"
        content="Information"
        @click="infomationMobileToggle = !infomationMobileToggle">
        <Lucide icon="Info" class="w-6 h-6" v-if="!infomationMobileToggle" />
        <Lucide icon="X" class="w-6 h-6" v-else />
      </Tippy>
      <div
        class="md:block p-5 bg-white dark:bg-darkmode-600 shadow rounded"
        :class="{ hidden: !infomationMobileToggle, 'absolute right-0 top-10 w-60': infomationMobileToggle }">
        <h3 class="mb-5 text-xl font-medium">{{ t('information') }}</h3>
        <ul class="mb-1 pb-3">
          <li class="py-2.5 border-b border-slate-200">
            {{ t('version') }}: <b>{{ databaseInfo }}</b>
          </li>
        </ul>
      </div>
    </div>
    <!--    END: Sidebar Right-->
  </div>
</template>
