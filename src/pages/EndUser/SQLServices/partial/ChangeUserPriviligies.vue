<script setup lang="ts">
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import { FormSwitch, FormCheck } from '@/base-components/Form';
  import { computed, onMounted, ref } from 'vue';
  import { IPrivileges, IUserDatabase } from '@/model/interface/IDatabase';
  import { DatabaseStore } from '@/stores/database-store';
  import { IPrivilegesDetailDto, IPrivilegesDto, IPrivilegesRoleDto } from '@/model/dto/IPrivilegesDto';
  import { t } from '@/config/i18n';

  const props = defineProps({
    databaseSelected: {
      type: Object,
      required: true,
    },
    userDatabaseSelected: {
      type: Object,
      required: true,
    },
  });
  //dattqh begin
  const databaseStore = DatabaseStore();
  const userDatabaseSelected = computed(() => props.userDatabaseSelected as IUserDatabase);
  const privilegesList = computed(() => databaseStore.listPrivileges as IPrivileges);
  const privilegesSelected = ref<IPrivilegesDto>({
    data: { name: 'DATA', checkAll: false, indeterminate: false, role: [] as IPrivilegesRoleDto[] },
    structure: { name: 'STRUCTURE', checkAll: false, indeterminate: false, role: [] as IPrivilegesRoleDto[] },
  } as IPrivilegesDto);
  const toogleExpand = ref(true);
  const totalPrivileges = computed(() => {
    if (privilegesList.value) {
      const countData = privilegesList.value.data.length;
      const countStructure = privilegesList.value.structure.length;
      return countData + countStructure;
    } else {
      return 0;
    }
  });

  function convertPrivilegesToDto() {
    if (privilegesList.value) {
      for (const item of privilegesList.value.data) {
        const role: IPrivilegesRoleDto = {
          name: item,
          active: userDatabaseSelected.value.privileges.data.includes(item),
        };
        privilegesSelected.value.data.role.push(role);
      }
      for (const item of privilegesList.value.structure) {
        const role: IPrivilegesRoleDto = {
          name: item,
          active: userDatabaseSelected.value.privileges.structure.includes(item),
        };
        privilegesSelected.value.structure.role.push(role);
      }
    }
  }

  function checkActiveAllAndIndeterminate() {
    let activeDataCount = 0;
    let activeStructureCount = 0;

    for (const data of privilegesSelected.value.data.role) {
      if (data.active) {
        activeDataCount++;
      }
    }

    privilegesSelected.value.data.indeterminate =
      activeDataCount > 0 && activeDataCount < privilegesSelected.value.data.role.length;
    privilegesSelected.value.data.checkAll = activeDataCount === privilegesSelected.value.data.role.length;

    for (const structure of privilegesSelected.value.structure.role) {
      if (structure.active) {
        activeStructureCount++;
      }
    }

    privilegesSelected.value.structure.indeterminate =
      activeStructureCount > 0 && activeStructureCount < privilegesSelected.value.structure.role.length;
    privilegesSelected.value.structure.checkAll =
      activeStructureCount === privilegesSelected.value.structure.role.length;
  }

  function setDataForPrivileges() {
    const dataNames = privilegesSelected.value.data.role
      .filter((data) => data.active)
      .map((data) => data.name);
    const structureNames = privilegesSelected.value.structure.role
      .filter((structure) => structure.active)
      .map((structure) => structure.name);

    userDatabaseSelected.value.privileges.data = dataNames;
    userDatabaseSelected.value.privileges.structure = structureNames;
  }

  function actionCheckAllPrivileges(item: IPrivilegesDetailDto) {
    //Duyet het cac role de active/disable
    if (item.role && item.role.length > 0) {
      for (const role of item.role) {
        role.active = item.checkAll;
      }
    }
    //check indeterminate
    checkActiveAllAndIndeterminate();
    //update user database selected
    setDataForPrivileges();
  }

  function actionCheckOnePrivileges() {
    //check indeterminate
    checkActiveAllAndIndeterminate();
    //update user database selected
    setDataForPrivileges();
  }

  onMounted(() => {
    convertPrivilegesToDto();
    checkActiveAllAndIndeterminate();
  });
  //dattqh end
</script>

<template>
  <div class="change-user-priviligies">
    <div class="flex items-center mb-2 bg-light dark:bg-darkmode-600 rounded py-1.5">
      <p class="text-base font-medium grow pl-2">
        {{ t('user_privileges') }}
        <span class="text-primary">{{
          privilegesSelected.data.role.filter((value) => value.active).length +
          privilegesSelected.structure.role.filter((value) => value.active).length +
          '/' +
          totalPrivileges
        }}</span>
      </p>
      <Button
        size="sm"
        class="border-none shadow-none bg-transparent mr-1"
        @click="toogleExpand = !toogleExpand">
        <Lucide icon="Plus" class="h-5 w-5" v-if="!toogleExpand" />
        <Lucide icon="Minus" class="h-5 w-5" v-else />
      </Button>
    </div>
    <div v-show="toogleExpand">
      <!--DATA-->
      <div class="mb-5" v-for="(item, index) in privilegesSelected" :key="index">
        <FormCheck class="mb-2" @change="actionCheckAllPrivileges(item)">
          <FormCheck.Input
            :id="item.name"
            type="checkbox"
            :indeterminate="item.indeterminate"
            v-model="item.checkAll" />
          <FormCheck.Label :htmlFor="item.name" class="font-medium text-base">
            {{ item.name }}
          </FormCheck.Label>
        </FormCheck>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6" v-for="(role, rid) in item.role" :key="rid">
            <p class="p-3 bg-light dark:bg-darkmode-600 rounded">
              <FormSwitch @change="actionCheckOnePrivileges">
                <FormSwitch.Input
                  :id="item.name + '_' + role.name"
                  type="checkbox"
                  :name="item.name + '_' + role.name"
                  :value="role.name"
                  v-model="role.active" />
                <FormSwitch.Label :htmlFor="item.name + '_' + role.name">
                  {{ role.name.toUpperCase() }}
                </FormSwitch.Label>
              </FormSwitch>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
