<script setup lang="ts">
  import { ref, computed } from 'vue';
  import DarkModeSwitcher from '@/components/DarkModeSwitcher';
  import Lucide from '@/base-components/Lucide';
  import Breadcrumb from '@/base-components/Breadcrumb';
  import { FormInput, FormSelect } from '@/base-components/Form';
  import { Menu, Popover } from '@/base-components/Headless';
  import fakerData from '@/utils/faker';
  import _ from 'lodash';
  import { TransitionRoot, PopoverButton } from '@headlessui/vue';
  import Button from '@/base-components/Button';
  import router from '@/router';
  import { LocaleStore } from '@/stores/locale-store';
  const languageMode = ref(localStorage.getItem('locale'));
  const searchDropdown = ref(false);
  const localeStore = LocaleStore();
  const showSearchDropdown = () => {
    searchDropdown.value = true;
  };
  const hideSearchDropdown = () => {
    searchDropdown.value = false;
  };

  function breadCrumb(_path: string) {
    const brPath = [] as string[];
    if (_path) {
      const pArr = _path.split('/');
      pArr.forEach((_it) => {
        if (_it) {
          brPath.push(_it);
        }
      });
    }
    return brPath;
  }

  async function actionLogout() {}
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div class="md:h-[67px] z-[51] flex items-center relative">
    <div class="flex my-3 mr-auto">
      <div class="text-center mr-3">
        <Menu>
          <Menu.Button :as="Button" variant="secondary">
            <Lucide icon="Terminal" class="w-4 h-4 mr-2" />
            Terminal
            <Lucide icon="ChevronDown" class="w-4 h-4 ml-2" />
          </Menu.Button>
          <Menu.Items class="w-48">
            <Menu.Item
              as="a"
              href="https://103.75.185.207:2031/cwp_cb96ec624c985fe729d198fd6e586ae3/admin/index.php?module=new_account#"
              target="_blank">
              <Lucide icon="TerminalSquare" class="w-4 h-4 mr-2" /> Simple Terminal
            </Menu.Item>
            <Menu.Item
              as="a"
              href="https://103.75.185.207:2031/cwp_6adeb1195bfbdd85bd8e9b0729131a82/admin/terminal.php"
              target="_blank">
              <Lucide icon="TerminalSquare" class="w-4 h-4 mr-2" /> CWPpro Terminal
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <Button
        as="a"
        href="https://103.75.185.207:2031/cwp_cb96ec624c985fe729d198fd6e586ae3/admin/index.php?module=new_account#"
        target="_blank"
        variant="secondary"
        class="flex items-center">
        <Lucide icon="Files" class="w-4 h-4 mr-2" />
        FileManager
      </Button>
    </div>
    <div class="flex items-center">
      <!-- BEGIN: Search -->
      <div class="relative mr-3 intro-x sm:mr-6">
        <div class="relative hidden sm:block">
          <FormInput
            name="search-input"
            type="text"
            class="border-transparent w-56 shadow-none rounded-full bg-slate-300/50 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
            placeholder="Search..."
            @focus="showSearchDropdown"
            @blur="hideSearchDropdown" />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500" />
        </div>
        <a class="relative text-slate-600 sm:hidden" href="">
          <Lucide icon="Search" class="w-5 h-5 dark:text-slate-500" />
        </a>
        <TransitionRoot
          as="template"
          :show="searchDropdown"
          enter="transition-all ease-linear duration-150"
          enterFrom="mt-5 invisible opacity-0 translate-y-1"
          enterTo="mt-[3px] visible opacity-100 translate-y-0"
          entered="mt-[3px]"
          leave="transition-all ease-linear duration-150"
          leaveFrom="mt-[3px] visible opacity-100 translate-y-0"
          leaveTo="mt-5 invisible opacity-0 translate-y-1">
          <div class="absolute right-0 z-10 mt-[3px]">
            <div class="w-[450px] p-5 box">
              <div class="mb-2 font-medium">Pages</div>
              <div class="mb-5">
                <a href="" class="flex items-center">
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success">
                    <Lucide icon="Inbox" class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Mail Settings</div>
                </a>
                <a href="" class="flex items-center mt-2">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-pending/10 text-pending">
                    <Lucide icon="Users" class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Users & Permissions</div>
                </a>
                <a href="" class="flex items-center mt-2">
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary/80">
                    <Lucide icon="CreditCard" class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Transactions Report</div>
                </a>
              </div>
              <div class="mb-2 font-medium">Users</div>
              <div class="mb-5">
                <a
                  v-for="(faker, fakerKey) in _.take(fakerData, 4)"
                  :key="fakerKey"
                  href=""
                  class="flex items-center mt-2">
                  <div class="w-8 h-8 image-fit">
                    <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
                  </div>
                  <div class="ml-3">{{ faker.users[0].name }}</div>
                  <div class="w-48 ml-auto text-xs text-right truncate text-slate-500">
                    {{ faker.users[0].email }}
                  </div>
                </a>
              </div>
              <div class="mb-2 font-medium">Products</div>
              <a
                v-for="(faker, fakerKey) in _.take(fakerData, 4)"
                :key="fakerKey"
                href=""
                class="flex items-center mt-2">
                <div class="w-8 h-8 image-fit">
                  <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.images[0]" />
                </div>
                <div class="ml-3">{{ faker.products[0].name }}</div>
                <div class="w-48 ml-auto text-xs text-right truncate text-slate-500">
                  {{ faker.products[0].category }}
                </div>
              </a>
            </div>
          </div>
        </TransitionRoot>
      </div>
      <!-- END: Search  -->
      <!--      BEGIN: Change Language-->
      <FormSelect
        v-model="languageMode"
        class="mr-5"
        @change="localeStore.actionChangeLocale(languageMode)"
        name="language">
        <option value="vi">VI</option>
        <option value="en">EN</option>
      </FormSelect>
      <!--      END: Change Language-->
      <!-- BEGIN: DarkMode, LightMode-->
      <DarkModeSwitcher class="mr-5 h-5 w-5" />
      <!-- END: DarkMode, LightMode-->
      <a class="mr-5" href="https://helpdesk.inet.vn" target="_blank">
        <Lucide icon="HelpCircle" class="h-5 w-5" />
      </a>
      <!-- BEGIN: Notifications -->
      <Popover class="intro-x">
        <Popover.Button
          class="relative text-slate-600 outline-none block before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger">
          <Lucide icon="Bell" class="w-5 h-5 dark:text-slate-500" />
        </Popover.Button>
        <Popover.Panel class="w-[280px] sm:w-[350px] p-5 mt-2">
          <div class="mb-5 font-medium">Notifications</div>
          <div
            v-for="(faker, fakerKey) in _.take(fakerData, 5)"
            :key="fakerKey"
            :class="['cursor-pointer relative flex items-center', { 'mt-5': fakerKey }]">
            <div class="relative flex-none w-12 h-12 mr-1 image-fit">
              <img alt="Midone Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
              <div
                class="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
            </div>
            <div class="ml-2 overflow-hidden">
              <div class="flex items-center">
                <a href="" class="mr-5 font-medium truncate">
                  {{ faker.users[0].name }}
                </a>
                <div class="ml-auto text-xs text-slate-400 whitespace-nowrap">
                  {{ faker.times[0] }}
                </div>
              </div>
              <div class="w-full truncate text-slate-500 mt-0.5">
                {{ faker.news[0].shortContent }}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
      <!-- END: Notifications  -->
      <!-- BEGIN: Account Menu -->
      <Menu class="ml-5">
        <Menu.Button class="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
          <img alt="Midone Tailwind HTML Admin Template" :src="fakerData[9].photos[0]" />
        </Menu.Button>
        <Menu.Items class="w-56 mt-px text-white bg-primary">
          <Menu.Header class="font-normal">
            <div class="font-medium">Khanh Phan</div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">Khanh Phan</div>
          </Menu.Header>
          <Menu.Divider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5"> <Lucide icon="User" class="w-4 h-4 mr-2" /> Profile </Menu.Item>
          <Menu.Item class="hover:bg-white/5"> <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Add Account </Menu.Item>
          <Menu.Item class="hover:bg-white/5"> <Lucide icon="Lock" class="w-4 h-4 mr-2" /> Reset Password </Menu.Item>
          <Menu.Item class="hover:bg-white/5"> <Lucide icon="HelpCircle" class="w-4 h-4 mr-2" /> Help </Menu.Item>
          <Menu.Divider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5" @click="actionLogout">
            <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" />
            {{ $t('button.logout') }}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  </div>
  <!-- END: Top Bar -->
  <div class="p-3.5 bg-gradient-to-b from-slate-200 dark:from-darkmode-800 rounded-b-md" v-if="$route.fullPath !== '/'">
    <!-- BEGIN: Breadcrumb -->
    <Breadcrumb class="hidden mr-auto -intro-x sm:flex">
      <Breadcrumb.Link to="/">
        <Lucide icon="Home" class="h-4 w-4" />
      </Breadcrumb.Link>
      <Breadcrumb.Link
        v-for="(br, id) in breadCrumb($route.fullPath)"
        :to="id > 0 ? br : '/' + br"
        :active="true"
        :index="id + 1"
        >{{ br }}</Breadcrumb.Link
      >
    </Breadcrumb>
    <!-- END: Breadcrumb -->
  </div>
</template>
