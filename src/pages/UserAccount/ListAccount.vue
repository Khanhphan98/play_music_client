<script setup lang="ts">
  import _ from 'lodash';
  import { ref, computed, onMounted } from 'vue';
  import fakerData from '@/utils/faker';
  import Button from '@/base-components/Button';
  import { FormSelect, FormSwitch } from '@/base-components/Form';
  import Lucide from '@/base-components/Lucide';
  import Tippy from '@/base-components/Tippy';
  import Table from '@/base-components/Table';
  import Progress from '@/base-components/Progress';
  import { Menu, MenuButton, MenuItems, MenuItem, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import UserAccountBandWidthModal from '@/pages/UserAccount/partial/BandWidthModal.vue';
  import UserAccountEditDnsZoneModal from '@/pages/UserAccount/partial/EditDnsZoneModal.vue';
  import UserAccountDiskUsageModal from '@/pages/UserAccount/partial/DiskUsageModal.vue';
  import UserAccountChangePasswordModal from '@/pages/UserAccount/partial/ChangePasswordModal.vue';
  import EditAccountModal from '@/pages/UserAccount/partial/EditAccountModal.vue';
  import { AccountStore } from '@/stores/account-store';
  import { IDataResponse } from '@/model/interface/IDataResponse';
  import { IAccount, IActionAccount, RoleUser, StatusUser } from '@/model/interface/IAccount';
  import { defaultLimitPerPage, rangePerPage } from '@/utils/my-variables';
  import PaginationCustom from '@/base-components/iCustom/PaginationCustom.vue';
  import { PackageStore } from '@/stores/package-store';
  import { t } from '@/config/i18n';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import Alert from '@/base-components/Alert';
  import PageSizeCustom from '@/base-components/iCustom/PageSizeCustom.vue';
  import { ModalConfig, ModalSize, TemplateModal } from '@/model/dto/ModalConfig';
  import { tryCallRequest } from '@/utils/my-function';
  import { tableScrollHorizontal } from '@/utils/table-scroll-horizontal';
  import MoreMassiveTasksModal from '@/pages/UserAccount/partial/MoreMassiveTasksModal.vue';
  import DataTableNotFound from '@/base-components/iCustom/DataTableNotFound.vue';
  import StatisticsView from '@/base-components/iCustom/StatisticsView.vue';
  import SearchFilterUiBase from '@/base-components/iCustom/SearchFilterUiBase.vue';
  import TippyContent from "@/base-components/TippyContent/TippyContent.vue";
  const listAcc = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('username')),
          val: 'username',
        },
        {
          title: computed(() => t('domain')),
          val: 'domain',
        },
        {
          title: computed(() => t('ip')),
          val: 'ip',
        },
        {
          title: computed(() => t('setuptime')),
          val: 'setuptime',
        },
        {
          title: computed(() => t('package')),
          val: 'package',
        },
        {
          title: computed(() => t('owner')),
          val: 'owner',
        },
        {
          title: computed(() => t('acl')),
          val: 'acl',
        },
        {
          title: computed(() => t('bandwidth')),
          val: 'bandwidth',
        },
        {
          title: computed(() => t('diskusage')),
          val: 'diskusage',
        },
        {
          title: computed(() => t('action')),
          val: 'action',
        },
      ],
    },
    sortField: {
      selected: '',
    },
    pagination: {
      showLen: defaultLimitPerPage,
    },
  });
  const storageTotal = ref<number>(268000000000);
  const bandWidthModal = ref(false);
  const diskUsageModal = ref(false);
  const listAccountSelect = ref<any>({});
  //Dattqh
  const packageStore = PackageStore();
  const accountStore = AccountStore();
  const myAccount = computed(() => accountStore.myAccount as IAccount);
  const listPackage = computed(() => packageStore.listPackage as IDataResponse);
  const listChildUser = computed(() => accountStore.listChildUser as IDataResponse);
  const modalDeleteAccountOptions = {
    title: t('are_you_sure', { action: t('delete_account') }),
    template: TemplateModal.DEL,
    size: ModalSize.XL,
  } as ModalConfig;
  const findUser = ref('');
  const statusSelected = ref('');
  const accountSelected = ref<IAccount>({ username: '' } as IAccount);
  const perPageSelected = ref(defaultLimitPerPage);
  const getListChildUser = computed(() => {
    const childUser = listChildUser.value.data ? (listChildUser.value.data as IAccount[]) : [];
    if (childUser.length > 0) {
      //logic set suspend active
      for (const item of childUser) {
        item.suspend = item.status === StatusUser.ADMIN_DISABLED || item.status === StatusUser.DISABLED;
      }
    }
    return childUser.filter(({ username, hostname }) =>
      [username, hostname].some((val) => val.toLowerCase().includes(findUser.value)),
    );
  });

  async function actionFindAccount() {
    listChildUser.value.currentPage = 1;
    listChildUser.value.offset = 0;
    listChildUser.value.filter.username = findUser.value;
    await tryCallRequest(async () => {
      await accountStore.actionListChildUser();
    });
  }

  async function onChangeStatusSelected() {
    listChildUser.value.currentPage = 1;
    listChildUser.value.offset = 0;
    listChildUser.value.filter.status = statusSelected.value;
    await tryCallRequest(async () => {
      await accountStore.actionListChildUser();
    });
  }

  async function onPageChange(page: number) {
    listChildUser.value.currentPage = page;
    listChildUser.value.offset = (listChildUser.value.currentPage - 1) * listChildUser.value.limit;
    await tryCallRequest(async () => {
      await accountStore.actionListChildUser();
    });
  }

  async function onPerPageChange(perPage: number) {
    listChildUser.value.currentPage = 1;
    listChildUser.value.offset = 0;
    listChildUser.value.limit = perPage;
    await tryCallRequest(async () => {
      await accountStore.actionListChildUser();
    });
  }

  async function actionChangePackage(item: IAccount) {
    await tryCallRequest(async () => {
      //init value
      const request = {
        new_package_id: item.package.packageIdChanged,
        usernames: [item.username],
      } as IActionAccount;
      await accountStore.actionChangePackage(request);
      //change value package of user changed
      for (const pk of listPackage.value.data) {
        if (item.package.packageIdChanged === pk.id) item.package = pk;
      }
      //close change package
      item.package.changePackage = false;
    });
  }

  async function actionSuspendUser(item: IAccount) {
    await tryCallRequest(async () => {
      //Neu suspend
      if (item.suspend) {
        //init request
        const request = { usernames: [item.username] } as IActionAccount;
        //call request
        await accountStore.actionSuspendUser(request);
      }
      //Neu resume
      else {
        const isAdminSuspend =
          myAccount.value.role_slug === RoleUser.ROOT || myAccount.value.role_slug === RoleUser.ADMIN;
        if (isAdminSuspend || item.status !== StatusUser.ADMIN_DISABLED) {
          await accountStore.actionResumeUser({ usernames: [item.username] } as IActionAccount);
        } else {
          item.suspend = true;
        }
      }
    });
  }

  async function actionDeleteChildUser() {
    await tryCallRequest(async () => {
      //init request
      const request = { usernames: [accountSelected.value.username] } as IActionAccount;
      await accountStore.actionDeleteChildUser(request);
      //close modal
      deleteAccountModal.value = false;
    });
  }

  async function actionLoginAs(username: string) {
    await tryCallRequest(async () => {
      //init request
      const request = { username: username } as IAccount;
      await accountStore.actionLoginAs(request);
    });
  }

  const tableScrollH = ref();
  onMounted(async () => {
    //init list child user
    await accountStore.actionListChildUser();
    new tableScrollHorizontal(tableScrollH.value);
  });
  // BEGIN: Edit DNS Zone
  const fileEditorModal = ref(false);
  const fileEditorTxtDemo = ref(`
Generated by CWP
            ; Zone file for hung.com
            $TTL 14400
            @    86400        IN      SOA     ns1.centos-webpanel.com. postmaster.hung.com. (
            2023030213 ; serial, todays date+todays
            3600            ; refresh, seconds
            7200            ; retry, seconds
            1209600         ; expire, seconds
            86400 )         ; minimum, seconds
            @\t86400\tIN\tNS\t\tns1.centos-webpanel.com.
            @\t86400\tIN\tNS\t\tns2.centos-webpanel.com.
            @ IN A 103.75.185.207
            localhost.hung.com. IN A 127.0.0.1
            @ IN MX 0 hung.com.
            mail 14400 IN CNAME hung.com.
            smtp 14400 IN CNAME hung.com.
            pop  14400 IN CNAME hung.com.
            pop3 14400 IN CNAME hung.com.
            imap 14400 IN CNAME hung.com.
            webmail 14400 IN A 103.75.185.207
            cpanel 14400 IN A 103.75.185.207
            cwp 14400 IN A 103.75.185.207
            www 14400 IN CNAME hung.com.
            ftp 14400 IN CNAME hung.com.
            _dmarc\t14400\tIN\tTXT\t"v=DMARC1; p=none"
            @\t14400\tIN\tTXT\t"v=spf1 +a +mx +ip4:103.75.185.207 ~all"
            default._domainkey 14400 IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCz/ZLL/sx6Et+eSJVAhPxKo3ujrE9XoEI3EnuyCP49rZTDA6UtVj4LR6Uip712v1sQWt+OypVUAY64CL6ib6ikz6/l9Z8fxR01oA/HPB6fFv0jUINdxaRW3lEn4fhdyC+f0kmFhpNKYGeVrViShqGwxPYWNomYdzdxT6aVQr3SPwIDAQAB"
`);

  function saveFileEditor() {
    console.log(fileEditorTxtDemo.value);
  }

  // END: Edit DNS Zone
  // BEGIN: Change Password
  const changePasswordModal = ref(false);
  // END: Change Password
  // BEGIN: Edit Account
  const editAccountModal = ref(false);
  // END: Edit Account
  // BEGIN: Delete Account
  const deleteAccountModal = ref(false);
  // END: Delete Account
  // BEGIN: Export CSV
  function tableToCSV() {
    // Variable to store the final csv data
    const csv_data = ref<any>([]);
    // Get header row
    const titles = [
      { name: 'username', location: 'username' },
      { name: 'domain', location: 'primary_domain.domain' },
      { name: 'ip', location: 'primary_domain.ip' },
      { name: 'setuptime', location: 'created_at' },
      { name: 'package', location: 'package.name' },
      { name: 'owner', location: 'owner' },
    ];
    // Push header row to csv_data
    csv_data.value.push(
      titles.map((item) => listAcc.value.table.thead.find((t: { val: string }) => t.val === item.name).title).join(';'),
    );

    const listUser: any = getListChildUser.value;
    // Get each row data
    for (let i = 0; i < listUser.length; i++) {
      // Stores each csv row data
      const csvRow = [];

      // lọc theo danh sách titles
      for (const title of titles) {
        let users = listUser[i];
        const keys = title.location.split('.');
        for (const key of keys) {
          users = users[key];
          if (!(users instanceof Object)) {
            break;
          }
        }
        // Nếu title.location là create_at thì format
        if (title.location === 'created_at') {
          users = formatDate(users);
        }
        csvRow.push(users);
      }

      // Combine each column value with tab
      csv_data.value.push(csvRow.join(';'));
    }

    // Combine each row data with new line character
    csv_data.value = csv_data.value.join('\n');

    // Call this function to download csv file
    downloadCSVFile(csv_data.value);
  }

  function downloadCSVFile(csv_data: any) {
    // Create CSV file object and feed
    // our csv_data into it
    const CSVFile = new Blob(['\uFEFF' + csv_data], {
      type: 'text/csv; charset=utf-8',
    });

    // Create to temporary link to initiate
    // download process
    const temp_link = document.createElement('a');

    // Download csv file
    temp_link.download = 'user-account-list.csv';
    temp_link.href = window.URL.createObjectURL(CSVFile);

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
  const moreMassiveTasksModal = ref(false);
  // END: Package Change
  const filterSort = ref<any>({});
  listAcc.value.table.thead.forEach((_it: any) => {
    if (!filterSort.value[_it.val]) {
      filterSort.value[_it.val] = { sort: false };
    }
  });

  function clickSort(_obj: Object) {
    return getListChildUser.value.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  }

  function formatDate(_date: Date) {
    const d = new Date(_date);
    return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
  }
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: General Report -->
    <div class="col-span-12">
      <div class="grid grid-cols-12 gap-6 mt-5 intro-y">
        <div class="col-span-12 sm:col-span-6">
          <statistics-view :options="{ total: 100, title: 'page_account_total_created', lucide: { icon: 'User' } }">
            <template #maincontent>
              {{ getListChildUser.length || 0 }}
            </template>
          </statistics-view>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <statistics-view
            :options="{
              total: 100,
              title: 'diskusage',
              lucide: { icon: 'HardDrive', color: 'text-primary' },
            }">
            <template #maincontent>
              <div>
                <Progress class="h-8">
                  <Progress.Bar
                    :style="{ width: 50 + '%' }"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100">
                    {{ 50 }}%
                  </Progress.Bar>
                </Progress>
              </div>
            </template>
          </statistics-view>
        </div>
      </div>
    </div>
    <!-- END: General Report -->
  </div>
  <div class="p-3 bg-white dark:bg-darkmode-900 rounded mt-10 -intro-y shadow-md">
    <div class="grid grid-cols-12 gap-6 mb-5">
      <div class="col-span-6 sm:col-span-12 lg:col-span-5 flex flex-col md:flex-row">
        <page-size-custom
          :per-page="rangePerPage"
          :per-page-selected="perPageSelected"
          @perpagechanged="onPerPageChange"
          class="w-full sm:w-44 lg:w-20 mb-3 md:mb-0 md:mr-3" />
        <div class="w-full lg:w-32 mb-3 md:mb-0 md:mr-3">
          <FormSelect v-model="statusSelected" aria-label="Show" name="find_status" @change="onChangeStatusSelected">
            <option value="">{{ t('all') }}</option>
            <option value="activated">{{ t('active') }}</option>
            <option value="disabled">{{ t('suspend') }}</option>
            <option
              value="admin_disabled"
              v-if="myAccount.role_slug === RoleUser.ADMIN || myAccount.role_slug === RoleUser.ROOT">
              {{ t('admin_suspend') }}
            </option>
          </FormSelect>
        </div>
        <RouterLink to="/user-account/new-account" class="whitespace-nowrap">
          <Button variant="primary" class="w-full md:w-auto">
            <Lucide icon="UserPlus" class="mr-2 h-5 w-5 shrink-0" />
            {{ t('create_account') }}
          </Button>
        </RouterLink>
      </div>
      <div class="col-span-6 sm:col-span-12 lg:col-span-7">
        <div class="flex flex-col md:flex-row items-center justify-end">
          <div class="relative w-full lg:w-64 mb-3 md:mb-0 md:mr-3">
            <!--            <FormInput type="search" :placeholder="t('find', {name: t('username')}) + '...'" class="pr-10 dark:border-slate-600" v-model="findUser" name="find-user" @change="actionFindAccount"/>
                        <Button class="border-none shadow-none absolute inset-y-0 right-0 text-gray-400 hover:text-gray-600" @click="actionFindAccount">
                          <Lucide icon="Search" class="w-5 h-5"/>
                        </Button>-->
            <search-filter-ui-base></search-filter-ui-base>
          </div>
          <Button
            variant="secondary"
            class="whitespace-nowrap w-full md:w-auto mb-3 md:mb-0 md:mr-3"
            @click="tableToCSV()">
            <Lucide icon="FileText" class="h-5 w-5 mr-2 shrink-0" />
            {{ t('export_to', { name: 'CSV' }) }}
          </Button>
          <Button
            class="whitespace-nowrap w-full md:w-auto border-secondary bg-white dark:bg-darkmode-300 text-primary hover:border-primary"
            @click="moreMassiveTasksModal = true">
            {{ t('button.more') }}
            <Lucide icon="MoreVertical" class="h-5 w-5 ml-1 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto" ref="tableScrollH">
      <Table sm bordered hover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="whitespace-nowrap" v-for="th in listAcc.table.thead" :key="th.val">
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
          <Table.Tr v-if="getListChildUser.length === 0">
            <data-table-not-found :colspan="listAcc.table.thead.length" />
          </Table.Tr>
          <Table.Tr v-for="(item, idx) in getListChildUser" :key="item.username" class="text-slate-600 dark:text-slate-300">
            <Table.Td>
              <div class="tooltip-content">
                <TippyContent :to="'tip-'+idx" :options="{trigger: 'mouseenter focus'}">
                  Mô tả <b>{{item.username}}</b> ở đây
                </TippyContent>
              </div>
              {{ item.username }} <Lucide icon="Info" class="w-5 h-5 inline-block ml-2" :data-tooltip="'tip-'+idx"/>
              <div class="flex items-center mt-2">
                <Tippy
                  as="a"
                  size="sm"
                  :href="item.username"
                  class="mr-3"
                  :content="'Open UserDir https://103.75.185.207/' + item.username">
                  <Lucide icon="Link" class="h-4 w-4" />
                </Tippy>
                <Tippy
                  as="a"
                  size="sm"
                  @click="actionLoginAs(item.username)"
                  href="#"
                  :content="'Open UserDir https://103.75.185.207/' + item.username">
                  <Lucide icon="Settings" class="h-4 w-4" />
                </Tippy>
              </div>
            </Table.Td>
            <Table.Td>
              <div class="flex justify-between" v-if="item.primary_domain">
                {{ item.primary_domain.domain }}
                <Tippy
                  as="a"
                  size="sm"
                  :href="item.primary_domain.domain"
                  class="ml-2"
                  :content="'Open site https://103.75.185.207/' + item.primary_domain.domain">
                  <Lucide icon="Link" class="h-4 w-4" />
                </Tippy>
              </div>
            </Table.Td>
            <Table.Td>
              {{ item.primary_domain ? item.primary_domain.ip : '' }}
            </Table.Td>
            <Table.Td class="whitespace-nowrap">
              {{ formatDate(item.created_at) }}
            </Table.Td>
            <Table.Td>
              <div class="flex items-center" v-if="!item.package.changePackage">
                <span class="whitespace-nowrap">
                  {{ item.package.name }}
                </span>
                <div class="flex items-center ml-2">
                  <Tippy
                    :as="Button"
                    size="sm"
                    class="mr-2 shadow-none border-none"
                    :content="t('change_package')"
                    @click="item.package.changePackage = true">
                    <Lucide icon="Edit" class="h-4 w-4" />
                  </Tippy>
                </div>
              </div>
              <div v-else>
                <div class="flex items-center">
                  <FormSelect
                    class="min-w-[120px] rounded-r-none"
                    form-select-size="sm"
                    v-model="item.package.packageIdChanged"
                    name="list_package">
                    <option disabled value="">{{ t('choose') }}</option>
                    <option v-for="pk in listPackage.data" :value="pk.id" :key="pk.id">
                      {{ pk.name }}
                    </option>
                  </FormSelect>
                  <Popover class="relative" v-if="item.package.packageIdChanged">
                    <PopoverButton class="py-1.5 px-2 bg-white border border-slate-200 -ml-[1px] mr-2 rounded-r">
                      <Lucide icon="Search" class="w-4 h-4" />
                    </PopoverButton>

                    <transition
                      enter-active-class="transition duration-200 ease-out"
                      enter-from-class="translate-y-1 opacity-0"
                      enter-to-class="translate-y-0 opacity-100"
                      leave-active-class="transition duration-150 ease-in"
                      leave-from-class="translate-y-0 opacity-100"
                      leave-to-class="translate-y-1 opacity-0">
                      <PopoverPanel
                        class="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-xs">
                        <div class="overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <ul v-if="listPackage.data.find((value) => value.id === item.package.packageIdChanged).ips">
                            <li
                              class="p-3"
                              v-for="ip in listPackage.data.find((value) => value.id === item.package.packageIdChanged)
                                .ips"
                              :key="ip">
                              {{ t('ip') + ': ' + ip }}
                            </li>
                          </ul>
                        </div>
                      </PopoverPanel>
                    </transition>
                  </Popover>
                  <Tippy
                    :as="Button"
                    content="Lưu gói đã chọn"
                    variant="primary"
                    class="rounded-r-none"
                    size="sm"
                    @click="actionChangePackage(item)">
                    <Lucide icon="Save" class="h-4 w-4" />
                  </Tippy>
                  <Button
                    variant="secondary"
                    class="rounded-l-none"
                    size="sm"
                    @click="item.package.changePackage = false">
                    <Lucide icon="X" class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Table.Td>
            <Table.Td>
              {{ item.owner }}
            </Table.Td>
            <Table.Td>
              {{ item.acl_name }}
            </Table.Td>
            <Table.Td>
              <Progress class="h-4">
                <Progress.Bar class="w-1/2" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  20%
                </Progress.Bar>
              </Progress>
              <div class="text-center mt-2">
                <Button
                  variant="soft-secondary"
                  size="sm"
                  @click="
                    bandWidthModal = true;
                    listAccountSelect.userName = item.username;
                  ">
                  <Lucide icon="BarChart" class="w-4 h-4" />
                </Button>
              </div>
            </Table.Td>
            <Table.Td>
              <Progress class="h-4">
                <Progress.Bar class="w-1/5" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  10%
                </Progress.Bar>
              </Progress>
              <div class="text-center mt-2">
                <Button
                  variant="soft-secondary"
                  size="sm"
                  @click="
                    diskUsageModal = true;
                    listAccountSelect.userName = item.username;
                  ">
                  <Lucide icon="MoreHorizontal" class="w-4 h-4" />
                </Button>
              </div>
            </Table.Td>
            <Table.Td>
              <div class="flex items-center">
                <Tippy as="div" :content="t('suspend_account')">
                  <FormSwitch @change="actionSuspendUser(item)">
                    <FormSwitch.Input
                      class="dark:bg-darkmode-100"
                      id="backup"
                      type="checkbox"
                      :value="item.status === StatusUser.ADMIN_DISABLED || item.status === StatusUser.DISABLED"
                      v-model="item.suspend" />
                  </FormSwitch>
                </Tippy>
                <Menu as="div" class="relative inline-block ml-2">
                  <MenuButton class="py-1 px-2 bg-light dark:bg-darkmode-500 rounded">
                    <Lucide icon="MoreVertical" class="h-5 w-5" />
                  </MenuButton>
                  <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0">
                    <MenuItems
                      class="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-darkmode-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[
                              active ? 'bg-secondary/50 dark:bg-secondary/10' : 'text-gray-600 dark:text-slate-400',
                              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                            @click="
                              accountSelected = item;
                              changePasswordModal = true;
                            ">
                            <Lucide icon="Key" :active="active" class="w-5 h-5 mr-2 text-gray-400" />
                            {{ t('change_password') }}
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[
                              active ? 'bg-secondary/50 dark:bg-secondary/10' : 'text-gray-600 dark:text-slate-400',
                              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                            @click="
                              accountSelected = item;
                              editAccountModal = true;
                              listAccountSelect.userName = item.username;
                            ">
                            <Lucide icon="UserCog" :active="active" class="w-5 h-5 mr-2 text-gray-400" />
                            {{ t('edit_account') }}
                          </button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button
                            :class="[
                              active ? 'bg-secondary/50 dark:bg-secondary/10' : 'text-gray-600 dark:text-slate-400',
                              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                            @click="
                              accountSelected = item;
                              deleteAccountModal = true;
                              listAccountSelect.userName = item.username;
                            ">
                            <Lucide icon="Trash" :active="active" class="w-4 h-4 mr-2 text-primary-three" />
                            {{ t('delete_account') }}
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <!-- BEGIN: Modal DiskUsage -->
      <UserAccountDiskUsageModal
        :open-close="diskUsageModal"
        @closeModal="diskUsageModal = false"
        :content="{ data: _.take(fakerData, 2), account: listAccountSelect }" />
      <!-- END: Modal DiskUsage -->
      <!-- BEGIN: Modal BandWidth  -->
      <UserAccountBandWidthModal
        :open-close="bandWidthModal"
        @update:openClose="bandWidthModal = false"
        :content="listAccountSelect" />
      <!-- END: Modal BandWidth -->
      <!-- BEGIN: Modal Edit DNS Zone  -->
      <UserAccountEditDnsZoneModal
        :content="fileEditorTxtDemo"
        :open-close="fileEditorModal"
        @update:openClose="fileEditorModal = false"
        @saveDnsZone="saveFileEditor" />
      <!-- END: Modal BandWidth -->
      <!-- BEGIN: Modal Change Password  -->
      <UserAccountChangePasswordModal
        :open-modal="changePasswordModal"
        @closeModal="changePasswordModal = false"
        :username="accountSelected.username" />
      <!-- END: Modal Change Password -->
      <!-- BEGIN: Modal Edit Account  -->
      <EditAccountModal
        :open-modal="editAccountModal"
        @openModal="editAccountModal = false"
        :account-selected="accountSelected" />
      <!-- END: Modal Edit Account -->
      <!-- BEGIN: Modal Delete Account -->
      <HeadlessUiDialogModal
        :open-modal="deleteAccountModal"
        @closeModal="deleteAccountModal = false"
        :modal-options="modalDeleteAccountOptions"
        @call-back-action="actionDeleteChildUser">
        <template #modalbody>
          <p class="text-xl text-center my-3">
            {{ t('are_you_sure', { action: t('delete', { name: accountSelected.username }) }) }}
          </p>
          <Alert variant="soft-pending" class="text-base mb-3">
            <p>{{ t('are_you_sure_1', { action: t('delete', { name: accountSelected.username }) }) }}</p>
            <p>{{ t('are_you_sure_2') }}</p>
          </Alert>
        </template>
      </HeadlessUiDialogModal>
      <!-- END: Modal Delete Account -->
      <!-- BEGIN: Modal Package Change -->
      <MoreMassiveTasksModal
        :open-close="moreMassiveTasksModal"
        @openClose="moreMassiveTasksModal = false"
        :list-child-user="listChildUser.data"
        :list-package="listPackage.data" />
      <!-- END: Modal Package Change -->
    </div>
    <!-- BEGIN: PAGINATION -->
    <pagination-custom
      :current-page="listChildUser.currentPage"
      :total-pages="listChildUser.totalPage"
      :per-page="rangePerPage"
      @pagechanged="onPageChange"
      @perpagechanged="onPerPageChange" />
    <!-- END: PAGINATION -->
  </div>
</template>
