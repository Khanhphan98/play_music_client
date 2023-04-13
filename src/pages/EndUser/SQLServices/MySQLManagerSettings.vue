<script setup lang="ts">
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import MySQLSettings from './partial/MySQLSettings.vue';
  import MySQlVars from './partial/MySQLVars.vue';
  import MySQLAdvancedEditor from './partial/MySQLAdvancedEditor.vue';
  import { onMounted, reactive, ref } from 'vue';

  const mySqlMng = reactive({
    mysqlsetting: {
      title: 'MySQL Settings',
      component: MySQLSettings,
      id: 1,
    },
    mysqlvars: {
      title: 'MySQL Vars',
      component: MySQlVars,
      id: 2,
    },
    mysqladvanced: {
      title: 'MySQL advanced editor',
      component: MySQLAdvancedEditor,
      id: 3,
    },
  });
  const mySqlSelected = ref<any>({});
  function settingSelected(_vl: string) {
    mySqlSelected.value = mySqlMng[_vl];
  }
  settingSelected('mysqlsetting');
</script>

<template>
  <div class="flex flex-col md:flex-row mb-2.5">
    <h3 class="text-xl font-medium grow">
      {{ mySqlSelected.title }}
    </h3>
    <div>
      <Button
        v-if="mySqlSelected.id === 1"
        size="sm"
        variant="secondary"
        class="mr-2"
        @click="settingSelected('mysqlvars')">
        <Lucide icon="Plus" class="h-4 w-4 mr-2" />
        Show MySQL Variables
      </Button>
      <Button
        v-if="mySqlSelected.id === 1"
        size="sm"
        variant="secondary"
        @click="settingSelected('mysqladvanced')">
        <Lucide icon="Plus" class="h-4 w-4 mr-2" />
        Advanced editor
      </Button>
      <Button v-if="mySqlSelected.id !== 1" size="sm" as="a" @click="settingSelected('mysqlsetting')">
        <Lucide icon="ChevronLeft" class="h-4 w-4 mr-2" /> Back to settings
      </Button>
    </div>
  </div>
  <div class="mt-5">
    <component :is="mySqlSelected.component" />
  </div>
</template>
