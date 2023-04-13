<script setup lang="ts">
  import { ref, onMounted, computed, reactive } from 'vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Table from '@/base-components/Table';
  import Tippy from '@/base-components/Tippy';
  import { Dialog } from '@/base-components/Headless';
  import { FormInput, FormSelect, InputGroup } from '@/base-components/Form';
  import Alert from '@/base-components/Alert';
  import ChangeHost from '@/pages/EndUser/SQLServices/partial/ChangeHost.vue';
  import ChangePassword from '@/pages/EndUser/SQLServices/partial/ChangePassword.vue';
  import ChangeUserPriviligies from '@/pages/EndUser/SQLServices/partial/ChangeUserPriviligies.vue';
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import FormLabel from '@/base-components/Form/FormLabel.vue';
  import { t } from '@/config/i18n';
  import { DatabaseStore } from '@/stores/database-store';
  import PageSizeCustom from '@/base-components/iCustom/PageSizeCustom.vue';
  import {
    defaultLimitPerPage,
    defaultTimeoutSubmit,
    rangePerPage,
    validateDatabaseName,
    validatePassword,
    validateUsername,
  } from '@/utils/my-variables';
  import { tryCallRequest } from '@/utils/my-function';
  import { IActionDatabase, IActionUserDatabase, IDatabase, IUserDatabase } from '@/model/interface/IDatabase';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import DataTableNotFound from '@/base-components/iCustom/DataTableNotFound.vue';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { ModalConfig, ModalSize, TemplateModal } from '@/model/dto/ModalConfig';
  import { MyStore } from '@/stores/my-store';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { IDataResponse } from '@/model/interface/IDataResponse';
  import { toFieldValidator } from '@vee-validate/zod';
  import * as zod from 'zod';
  import { useForm } from 'vee-validate';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import HeadlessUiCombobox from "@/base-components/iCustom/HeadlessUiCombobox.vue";
  const listAcc = ref({
    table: {
      thead: [
        {
          title: computed(() => t('database')),
          val: 'databasename',
          tailwincss: '',
        },
        {
          title: computed(() => t('owner')),
          val: 'owner',
          tailwincss: '',
        },
        {
          title: computed(() => t('username') + ' ' + t('database')),
          val: 'users',
          tailwincss: '',
        },
        {
          title: computed(() => t('action')),
          val: 'actions',
          tailwincss: 'whitespace-nowrap text-right',
        },
      ],
    },
    sortField: {
      selected: '',
    },
  });
  const filterSort = ref({});

  function clickSort(_obj: any) {
    return databaseList.value.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  }

  listAcc.value.table.thead.forEach((_it: any) => {
    if (!filterSort.value[_it.val]) {
      filterSort.value[_it.val] = { sort: false };
    }
  });
  //dattqh start
  const tableScrollH = ref();
  const myStore = MyStore();
  const databaseStore = DatabaseStore();
  const databaseResponse = computed(() => databaseStore.databaseResponse as IDataResponse);
  const charsetList = computed(() => databaseStore.listSupportedCharset);
  const databaseList = computed(() => {
    const data = databaseResponse.value.data ? (databaseResponse.value.data as IDatabase[]) : [];
    return data.filter(({ database_name }) => [database_name].some((val) => val.toLowerCase().includes(find.value)));
  });
  const find = ref('');
  const confirmDeleteDatabase = ref('');
  const perPageSelected = ref(defaultLimitPerPage);
  const databaseSelected = ref<IDatabase>({} as IDatabase);
  const userDatabaseSelected = ref<IUserDatabase>({} as IUserDatabase);
  const newUserDatabase = ref<IUserDatabase>({} as IUserDatabase);
  const newDatabase = reactive({
    database_name: '',
    charset: 'utf8mb4',
    users: {
      database_user: '',
      host: 'localhost',
      password: '',
      privileges: {
        data: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] as string[],
        structure: [
          'CREATE',
          'DROP',
          'REFERENCES',
          'INDEX',
          'ALTER',
          'CREATE VIEW',
          'SHOW VIEW',
          'CREATE ROUTINE',
          'ALTER ROUTINE',
          'EXECUTE',
          'EVENT',
          'TRIGGER',
          'CREATE TEMPORARY TABLES',
          'LOCK TABLES',
        ] as string[],
      },
    },
  });
  const showAddUserExistedForDatabase = ref(false);
  const showAddUserExisted = ref(false);
  const showAddDatabaseModal = ref(false);
  const showUserDatabasePrivilegesModal = ref(false);
  const showChangeHostModal = ref(false);
  const showChangeUserDatabasePasswordModal = ref(false);
  const showDeleteUserDatabaseModal = ref(false);
  const showAddUserDatabaseModal = ref(false);
  const showDeleteDatabaseModal = ref(false);
  const modalAddDatabaseOptions = {
    title: t('add') + ' ' + t('new', { name: t('database') }),
    footer: true,
  } as ModalConfig;
  const modalChangePrivilegesOptions = { title: t('change', { name: t('user_privileges') }) } as ModalConfig;
  const modalChangeHostOptions = { title: t('change', { name: t('host') }) } as ModalConfig;
  const modalChangeUserDatabasePasswordOptions = {
    title: t('change', { name: t('password') + ' ' + t('username') }),
  } as ModalConfig;
  const modalAddUserDatabaseOptions = {
    title: t('add') + ' ' + t('username') + ' ' + t('database'),
  } as ModalConfig;
  const modalDeleteUserDatabaseOptions = {
    title: t('are_you_sure', { action: t('delete_account') }),
    template: TemplateModal.DEL,
    size: ModalSize.MD,
  } as ModalConfig;
  const errorForDelete = ref({});
  //Schema validate
  const schema = toFieldValidator(
    zod.object({
      database_name: zod
        .string()
        .nonempty(t('alert.messages.required', { field: t('database') }))
        .regex(validateDatabaseName, t('alert.messages.regex_database_name')),
      charset: zod.string().nonempty(t('alert.messages.required', { field: t('charset') })),
      users: zod.object({
        database_user: zod
          .string()
          .nonempty(t('alert.messages.required', { field: t('username') }))
          .regex(validateUsername, t('alert.messages.regex_username')),
        password: zod
          .string()
          .nonempty(t('alert.messages.required', { field: t('password') }))
          .regex(validatePassword, t('alert.messages.regex_password')),
        host: zod.string().nonempty(t('alert.messages.required', { field: t('host') })),
      }),
    }),
  );
  // function onInvalidSubmit({ errors }) {
  //   const errorDetail = [] as IErrorResponse[];
  //   for (const item of Object.entries(errors)) {
  //     const error = { detail: item[1] } as IErrorResponse;
  //     errorDetail.push(error);
  //   }
  //   myStore.showToastMessage(undefined, true, errorDetail);
  // }
  //Form action
  const { handleSubmit, errors, isSubmitting, handleReset } = useForm({
    initialValues: newDatabase,
    validationSchema: schema,
  });
  //Action method
  const actionAddDatabase = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));

    await tryCallRequest(async () => {
      //init request
      const request = {
        database_name: values.database_name,
        charset: values.charset,
        database_user: values.users.database_user,
        password: values.users.password,
        privileges: [...newDatabase.users.privileges.data, ...newDatabase.users.privileges.structure],
      } as IActionDatabase;
      //call request
      await databaseStore.actionCreateDatabase(request);
      //reset list
      await databaseStore.actionGetListDatabase();
      //reset form
      handleReset();
      //close modal
      showAddDatabaseModal.value = false;
      //alert success
      myStore.showToastMessage();
    });
  });

  function initDataForNewUserDatabase() {
    newUserDatabase.value = {
      user: '',
      host: 'localhost',
      password: '',
      privileges: {
        data: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
        structure: [
          'CREATE',
          'DROP',
          'REFERENCES',
          'INDEX',
          'ALTER',
          'CREATE VIEW',
          'SHOW VIEW',
          'CREATE ROUTINE',
          'ALTER ROUTINE',
          'EXECUTE',
          'EVENT',
          'TRIGGER',
          'CREATE TEMPORARY TABLES',
          'LOCK TABLES',
        ],
      },
      id: 0,
    } as IUserDatabase;
  }

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

  async function actionChangeUserPrivileges() {
    //init request
    const request = {
      database_user_id: userDatabaseSelected.value.id,
      privileges: [...userDatabaseSelected.value.privileges.data, ...userDatabaseSelected.value.privileges.structure],
    } as IActionUserDatabase;
    await tryCallRequest(async () => {
      await databaseStore.actionChangeUserDatabasePrivileges(request);
      //close modal
      showUserDatabasePrivilegesModal.value = false;
      //alert success
      myStore.showToastMessage();
    });
  }

  async function actionChangeHost() {
    //init request
    const request = {
      database_user_id: userDatabaseSelected.value.id,
      new_host: userDatabaseSelected.value.host,
    } as IActionUserDatabase;
    await tryCallRequest(async () => {
      await databaseStore.actionChangeUserDatabaseHost(request);
      //close modal
      showChangeHostModal.value = false;
      //alert success
      myStore.showToastMessage();
    });
  }

  async function actionChangeUserDatabasePassword() {
    //init request
    const request = {
      database_user_id: userDatabaseSelected.value.id,
      password: userDatabaseSelected.value.password,
    } as IActionUserDatabase;
    await tryCallRequest(async () => {
      await databaseStore.actionChangeUserDatabasePassword(request);
      //close modal
      showChangeUserDatabasePasswordModal.value = false;
      //alert success
      myStore.showToastMessage();
    });
  }

  async function actionDeleteUserDatabase() {
    //init request
    const request = {
      database_user_id: userDatabaseSelected.value.id,
    } as IActionUserDatabase;
    await tryCallRequest(async () => {
      await databaseStore.actionDeleteUserDatabase(request);
      //remove user from database
      const findUser = databaseSelected.value.users.findIndex((value) => value.id === userDatabaseSelected.value.id);
      if (findUser >= 0) {
        databaseSelected.value.users.splice(findUser, 1);
      }
      //close modal
      showDeleteUserDatabaseModal.value = false;
      //alert success
      myStore.showToastMessage();
    });
  }

  async function actionAddUserDatabase() {
    //init request
    const request = {
      database_id: databaseSelected.value.id,
      database_user: newUserDatabase.value.user,
      password: newUserDatabase.value.password,
      host: newUserDatabase.value.host,
      privileges: [...newUserDatabase.value.privileges.data, ...newUserDatabase.value.privileges.structure],
    } as IActionUserDatabase;
    await tryCallRequest(async () => {
      await databaseStore.actionCreateUserDatabase(request);
      //reload data
      await databaseStore.actionGetListDatabase();
      //close modal
      showAddUserDatabaseModal.value = false;
      //alert success
      myStore.showToastMessage();
    });
  }

  async function actionDeleteDatabase() {
    //check valid
    if (confirmDeleteDatabase.value !== databaseSelected.value.database_name) {
      errorForDelete.value = {
        confirm: t('alert.messages.confirmed', {
          field: confirmDeleteDatabase.value,
          target: databaseSelected.value.database_name,
        }),
      };
    } else {
      //remove errror
      errorForDelete.value = {};
      //init request
      const request = {
        database_id: databaseSelected.value.id,
      } as IActionDatabase;
      await tryCallRequest(async () => {
        await databaseStore.actionDeleteDatabase(request);
        //reload data
        await databaseStore.actionGetListDatabase();
        //close modal
        showDeleteDatabaseModal.value = false;
        //alert success
        myStore.showToastMessage();
      });
    }
  }

  onMounted(async () => {
    //init value
    await databaseStore.actionGetListDatabase();
    await databaseStore.actionGetListSupportedCharset();
    await databaseStore.actionGetListPrivileges();
    new tableScrollHorizontal(tableScrollH.value);
  });
  //dattqh end
</script>

<template>
  <div class="database-list">
    <div class="flex flex-col md:flex-row mb-2.5">
      <h3 class="text-xl font-medium grow">{{ t('list', { name: t('database') }) }}</h3>
      <Button variant="primary" class="min-w-[211px]" @click="showAddDatabaseModal = true">
        <Lucide icon="Plus" class="h-4 w-4 mr-2" />
        {{ t('add') + ' ' + t('new', { name: t('database') }) }}
      </Button>
    </div>
    <div class="flex flex-col-reverse md:flex-row mb-5">
      <div class="show-page flex items-center">
        <page-size-custom
          :per-page="rangePerPage"
          :per-page-selected="perPageSelected"
          class="w-full sm:w-44 lg:w-20 mb-3 md:mb-0 md:mr-3"
          @perpagechanged="onPerPageChange" />
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
      <div ref="tableScrollH" class="overflow-x-auto bg-white dark:bg-darkmode-800 -intro-y min-h-[20vh]">
        <Table sm bordered striped hover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th
                v-for="th in listAcc.table.thead"
                :key="th.val"
                class="whitespace-nowrap"
                :class="th.tailwincss">
                <Button
                  class="border-none shadow-none"
                  @click="
                    clickSort(th);
                    filterSort[th.val].sort = !filterSort[th.val].sort;
                  ">
                  {{ th.title }}
                  <Lucide v-if="filterSort[th.val].sort" icon="ChevronUp" class="w-4 h-4 ml-2" />
                  <Lucide v-else icon="ChevronDown" class="w-4 h-4 ml-2" />
                </Button>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="databaseList.length === 0">
              <data-table-not-found :colspan="listAcc.table.thead.length" />
            </Table.Tr>
            <template v-else>
              <Table.Tr v-for="item in databaseList" :key="item.id" class="text-slate-600 dark:text-slate-300">
                <Table.Td v-for="th in listAcc.table.thead" :key="th.val">
                  <div v-if="th.val === 'owner'" class="flex items-center">
                    <Lucide icon="User" class="w-5 h-5 mr-2" />
                    {{ item.owner }}
                  </div>
                  <div v-else-if="th.val === 'databasename'">
                    {{ item.database_name }}
                  </div>
                  <div v-else-if="th.val === 'users'" class="whitespace-nowrap">
                    <p v-if="!item.users || item.users.length === 0" class="font-medium text-center">
                      {{ t('no_associated_user') }}
                    </p>
                    <template v-else>
                      <div
                        v-for="(user, index) in item.users"
                        :key="user.id"
                        class="flex items-center"
                        :class="{ 'border-b border-slate-200 pb-1.5 mb-1.5': index < item.users.length - 1 }">
                        <span class="grow pr-3">
                          {{ user.user }}
                        </span>
                        <div class="group-actions -mx-1 text-right shrink-0">
                          <Tippy
                            :as="Button"
                            :content="t('change', { name: t('user_privileges') })"
                            size="sm"
                            variant="secondary"
                            class="m-1"
                            @click="
                              databaseSelected = item;
                              userDatabaseSelected = user;
                              showUserDatabasePrivilegesModal = true;
                            ">
                            <Lucide icon="UserCog" class="h-4 w-4" />
                          </Tippy>
                          <Tippy
                            :as="Button"
                            :content="t('change', { name: t('host') })"
                            size="sm"
                            variant="secondary"
                            class="m-1"
                            @click="
                              databaseSelected = item;
                              userDatabaseSelected = user;
                              showChangeHostModal = true;
                            ">
                            <Lucide icon="Database" class="h-4 w-4" />
                          </Tippy>
                          <Tippy
                            :as="Button"
                            :content="t('change', { name: t('password') })"
                            size="sm"
                            variant="secondary"
                            class="m-1"
                            @click="
                              databaseSelected = item;
                              userDatabaseSelected = user;
                              showChangeUserDatabasePasswordModal = true;
                            ">
                            <Lucide icon="Key" class="h-4 w-4" />
                          </Tippy>
                          <Tippy
                            :as="Button"
                            :content="t('delete', { name: t('username') })"
                            size="sm"
                            variant="soft-pending"
                            class="m-1"
                            @click="
                              databaseSelected = item;
                              userDatabaseSelected = user;
                              showDeleteUserDatabaseModal = true;
                            ">
                            <Lucide icon="Trash" class="h-4 w-4" />
                          </Tippy>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div v-else-if="th.val === 'actions'" class="text-right">
                    <Tippy
                      :as="Button"
                      type="button"
                      size="sm"
                      variant="soft-primary"
                      class="mr-3"
                      :content="t('add') + ' ' + t('username') + ' ' + t('database')"
                      @click="
                        databaseSelected = item;
                        showAddUserDatabaseModal = true;
                        initDataForNewUserDatabase();
                      ">
                      <Lucide icon="User" class="h-4 w-4" />
                    </Tippy>
                    <Tippy
                      :as="Button"
                      type="button"
                      size="sm"
                      variant="soft-danger"
                      :content="t('delete', { name: t('database') })"
                      @click="
                        databaseSelected = item;
                        showDeleteDatabaseModal = true;
                        confirmDeleteDatabase = '';
                        errorForDelete = {};
                      ">
                      <Lucide icon="Trash" class="h-4 w-4" />
                    </Tippy>
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
  <!-- BEGIN: Modal Change Privileges  -->
  <headless-ui-dialog-modal
    :open-modal="showUserDatabasePrivilegesModal"
    :modal-options="modalChangePrivilegesOptions"
    @close-modal="showUserDatabasePrivilegesModal = false"
    @call-back-action="actionChangeUserPrivileges">
    <template #modalbody>
      <ChangeUserPriviligies :database-selected="databaseSelected" :user-database-selected="userDatabaseSelected" />
    </template>
  </headless-ui-dialog-modal>
  <!-- END: Modal Change Privileges -->
  <!-- BEGIN: Modal Change Host -->
  <headless-ui-dialog-modal
    :open-modal="showChangeHostModal"
    :modal-options="modalChangeHostOptions"
    @close-modal="showChangeHostModal = false"
    @call-back-action="actionChangeHost">
    <template #modalbody>
      <FormLabel html-for="host"
        >{{ t('for') }} <b>{{ userDatabaseSelected.user }}</b></FormLabel
      >
      <ChangeHost :user-database-selected="userDatabaseSelected" />
    </template>
  </headless-ui-dialog-modal>
  <!-- END: Modal Change Host -->
  <!-- BEGIN: Modal Change Password  -->
  <headless-ui-dialog-modal
    :open-modal="showChangeUserDatabasePasswordModal"
    :modal-options="modalChangeUserDatabasePasswordOptions"
    @close-modal="showChangeUserDatabasePasswordModal = false"
    @call-back-action="actionChangeUserDatabasePassword">
    <template #modalbody>
      <FormLabel html-for="host"
        >{{ t('for') }} <b>{{ userDatabaseSelected.user }}</b></FormLabel
      >
      <ChangePassword class="mt-5" :user-database-selected="userDatabaseSelected" />
    </template>
  </headless-ui-dialog-modal>
  <!-- END: Modal Change Password -->
  <!-- BEGIN: Modal Delete user database -->
  <headless-ui-dialog-modal
    :open-modal="showDeleteUserDatabaseModal"
    :modal-options="modalDeleteUserDatabaseOptions"
    @close-modal="showDeleteUserDatabaseModal = false"
    @call-back-action="actionDeleteUserDatabase">
    <template #modalbody>
      <p class="text-xl text-center mt-3">
        <b>{{ userDatabaseSelected.user }}</b>
      </p>
    </template>
  </headless-ui-dialog-modal>
  <!-- END: Modal Delete user database -->
  <!-- BEGIN: Modal Add user database  -->
  <headless-ui-dialog-modal
    :open-modal="showAddUserDatabaseModal"
    :modal-options="modalAddUserDatabaseOptions"
    @close-modal="showAddUserDatabaseModal = false"
    @call-back-action="actionAddUserDatabase">
    <template #modalbody>
      <div v-if="!showAddUserExisted" class="mt-5">
        <FormLabel html-for="add_username_input">
          <b>{{ t('username') }}</b>
        </FormLabel>
        <InputGroup class="mt-2">
          <InputGroup.Text id="input-group-price" class="whitespace-nowrap">
            {{ databaseSelected.owner + '_' }}
          </InputGroup.Text>
          <FormInput
            id="add_username_input"
            v-model="newUserDatabase.user"
            type="text"
            aria-label="Price"
            aria-describedby="input-group-price"
            name="add_username_input" />
        </InputGroup>
        <div class="mt-3">
          <b>{{ t('host') }}:</b>
          <ChangeHost :user-database-selected="newUserDatabase" />
        </div>
        <div class="mt-3">
          <b>{{ t('new', { name: t('password') }) }}:</b>
          <ChangePassword class="mt-2" :user-database-selected="newUserDatabase" />
        </div>
      </div>
      <div v-else class="mt-5">
        <HeadlessUiCombobox/>
        <div class="mt-3">
          <b>{{ t('host') }}:</b>
          <ChangeHost :user-database-selected="newUserDatabase" />
        </div>
      </div>
      <div class="mt-3">
        <Button type="button" size="sm" variant="primary" @click="showAddUserExisted = !showAddUserExisted">
          <Lucide icon="UserPlus" class="w-5 h-5 mr-2" />
          {{
            showAddUserExisted
              ? t('add') + ' ' + t('new', { name: t('username') })
              : t('add') + ' ' + t('username') + ' ' + t('already_exists')
          }}
        </Button>
      </div>
      <div class="mt-5">
        <ChangeUserPriviligies :database-selected="databaseSelected" :user-database-selected="newUserDatabase" />
      </div>
    </template>
  </headless-ui-dialog-modal>
  <!-- END: Modal Add user database -->
  <!-- BEGIN: Modal Delete Database -->
  <Dialog :open="showDeleteDatabaseModal" @close="showDeleteDatabaseModal = false">
    <Dialog.Panel>
      <div class="p-5 flex">
        <div class="shrink-0 mt-3 rounded-full bg-danger/10 w-20 h-20 flex items-center justify-center">
          <Lucide icon="Trash2" class="w-11 h-11 text-danger" />
        </div>
        <div class="grow pl-5">
          <div class="text-2xl">
            {{ t('are_you_sure', { action: t('delete', { name: t('database') }) }) }}
          </div>
          <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">
            {{ databaseSelected.database_name }}
          </p>
          <div class="mt-2 text-slate-500">
            {{ t('confirm') }} <b>{{ databaseSelected.database_name }}</b> {{ t('before') }} {{ t('delete') }}!
          </div>
          <div class="mt-3">
            <FormInput
              v-model="confirmDeleteDatabase"
              type="text"
              :placeholder="t('confirm', { name: t('database') }) + '...'"
              name="confirm_delete_database_input" />
          </div>
          <AlertCustom :errors="errorForDelete"></AlertCustom>
        </div>
      </div>
      <div class="p-5 text-right">
        <Button
          type="button"
          variant="outline-secondary"
          class="min-w-[7rem] mr-3"
          @click="showDeleteDatabaseModal = false">
          {{ t('button.cancel') }}
        </Button>
        <Button type="button" variant="danger" class="min-w-[7rem]" @click="actionDeleteDatabase">
          {{ t('button.delete') }}
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Delete Database -->
  <!-- BEGIN: Modal Add New Database -->
  <HeadlessUiDialogModal
    :open-modal="showAddDatabaseModal"
    :modal-options="modalAddDatabaseOptions"
    @close-modal="showAddDatabaseModal = false">
    <template #modalbody>
      <form @submit="actionAddDatabase">
        <AlertCustom :errors="errors"></AlertCustom>
        <div class="mt-5">
          <FormLabel html-for="database_name">
            {{ t('name') + ' ' + t('database') }}: <span class="text-danger">*</span>
          </FormLabel>
          <FormInput
            v-model="newDatabase.database_name"
            type="text"
            :placehoder="t('name') + ' ' + t('database')"
            class="mt-2"
            name="database_name" />
        </div>
        <div v-if="!showAddUserExistedForDatabase" class="mt-5">
          <FormLabel html-for="database_user">
            {{ t('name') + ' ' + t('username') }}: <span class="text-danger">*</span>
          </FormLabel>
          <FormInput
            v-model="newDatabase.users.database_user"
            type="text"
            :placehoder="t('name') + ' ' + t('username')"
            class="mt-2"
            name="users.database_user" />
          <div class="mt-3">
            <FormLabel html-for="password"> {{ t('password') }}: <span class="text-danger">*</span></FormLabel>
            <ChangePassword class="mt-2" :user-database-selected="newDatabase.users" />
          </div>
        </div>
        <div v-else class="mt-5">
          <HeadlessUiCombobox/>
        </div>
        <div class="mt-5">
          <Button
            type="button"
            size="sm"
            variant="primary"
            @click="showAddUserExistedForDatabase = !showAddUserExistedForDatabase">
            <Lucide icon="UserPlus" class="w-5 h-5 mr-2" />
            {{
              showAddUserExistedForDatabase
                ? t('add') + ' ' + t('new', { name: t('username') })
                : t('add') + ' ' + t('username') + ' ' + t('already_exists')
            }}
          </Button>
        </div>
        <div class="mt-5">
          <FormLabel html-for="charset"> {{ t('charset') }}: <span class="text-danger">*</span></FormLabel>
          <FormSelect v-model="newDatabase.charset" class="w-full mt-2" name="charset">
            <option value="" disabled>{{ t('choose') }}</option>
            <option v-for="value in Object.entries(charsetList)" :key="value[1]" :value="value[1]">
              {{ value[0] }}
            </option>
          </FormSelect>
        </div>
        <div class="mt-5">
          <ChangeUserPriviligies :database-selected="newDatabase" :user-database-selected="newDatabase.users" />
        </div>
        <Alert variant="soft-primary">
          <b>{{ t('important') }}:</b> {{ t('create_new_database_des') }}
        </Alert>
        <div class="grid grid-cols-2 gap-3 sticky bottom-0 bg-white dark:bg-darkmode-400 pb-6 pt-3">
          <Button type="reset" variant="outline-secondary" class="min-w-[7rem]" @click="showAddDatabaseModal = false">
            {{ t('button.cancel') }}
          </Button>
          <Button type="submit" variant="primary" class="min-w-[7rem]" :disabled="isSubmitting">
            {{ t('button.save') }}
            <LoadingIcon v-show="isSubmitting" icon="oval" color="white" class="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </template>
  </HeadlessUiDialogModal>
  <!-- END: Modal Add New Database -->
</template>
