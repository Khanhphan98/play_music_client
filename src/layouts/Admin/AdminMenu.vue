<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import logoUrl from '@/assets/images/logo.svg';
  import Divider from './Divider.vue';
  import Menu from './Menu.vue';
  import TopBarAdmin from '@/components/TopBar/TopBarAdmin.vue';
  import DarkModeSwitcher from '../../components/DarkModeSwitcher';
  import MainColorSwitcher from '../../components/MainColorSwitcher';
  import MobileMenu from '../../components/MobileMenu/AdminMobileMenu.vue';
  import { useAdminMenuStore } from '@/stores/admin-menu';
  import { FormattedMenu, nestedMenu, enter, leave } from './admin-menu';
  import { watch, reactive, computed, onMounted, ref } from 'vue';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Button from '@/base-components/Button/Button.vue';
  import Tippy from '@/base-components/Tippy/Tippy.vue';
  import NotificationToastify from '@/base-components/iCustom/NotificationCustom/Main.vue';
  import { FormSelect } from '@/base-components/Form';
  import { AccountStore } from '@/stores/account-store';
  import { IAccount } from '@/model/interface/IAccount';

  const route = useRoute();
  const accountStore = AccountStore();
  const myAccount = computed(() => accountStore.myAccount as IAccount);
  const formattedMenu = reactive<Array<FormattedMenu | 'divider'>>([]);
  const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu | 'divider'>) => {
    Object.assign(formattedMenu, computedFormattedMenu);
  };
  const adminMenuStore = useAdminMenuStore();
  const sideMenu = computed(() => nestedMenu(adminMenuStore.menu, route));

  watch(sideMenu, () => {
    setFormattedMenu(sideMenu.value);
  });

  onMounted(() => {
    setFormattedMenu(sideMenu.value);
  });

  const menuExtend = ref<boolean>(false);

  function PageTitle($router: any) {
    const regexTitle = /^[a-z]+(?=(_|\s){1})/gm; // regex giá trị title có dạng: string_string (chữ thường)
    let _title = $router.meta.title;
    if (!regexTitle.test(_title)) {
      // return console.warn(_title + ' is not format!')
    }
    const _params = $router.params.tplId;
    if (_params) {
      _title += '_' + _params;
    }
    if (!_title) {
      _title = 'routemetatitle';
    }
    return _title;
  }
</script>

<template>
  <div class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15] dark:bg-transparent">
    <MobileMenu />
    <div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <aside
        class="sidebar-menu relative hidden md:block px-5 pb-16"
        :class="[menuExtend ? 'w-[250px]' : 'md:w-[105px] xl:w-[250px]']">
        <Button
          class="bg-[#0986b9] border-[#0986b9] dark:bg-darkmode-800 dark:border-darkmode-800 dark:text-white/50 dark:hover:bg-darkmode-600 text-white absolute left-full top-[20px] z-10 p-1 xl:hidden"
          @click="menuExtend = !menuExtend">
          <Lucide icon="ChevronsRight" v-if="!menuExtend" class="h-5 w-5" />
          <Lucide icon="ChevronsLeft" v-else class="h-5 w-5" />
        </Button>
        <nav class="overflow-x-hidden">
          <RouterLink :to="{ name: 'side-menu-dashboard-overview-1' }" class="flex items-center mt-3 intro-x">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="43px"
              height="45px">
              <image
                x="0px"
                y="0px"
                width="43px"
                height="45px"
                xlink:href="data:img/png;base64,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" />
            </svg>
            <span class="text-xl text-white/80 ml-2">iPanel</span>
          </RouterLink>
          <Divider type="div" class="my-3"></Divider>
          <div class="flex flex-col xl:flex-row items-center load-averages">
            <Tippy
              :as="Button"
              size="sm"
              content="Load Averages [Enable/Disable]"
              class="mb-1 xl:mb-0 xl:mr-2 bg-secondary/30 text-white/50 border-secondary/30">
              <Lucide icon="Locate" class="h-4 w-4" />
            </Tippy>
            <span class="text-white/60 hidden xl:block">Load: 0.01 0.04 0.00</span>
          </div>
          <Divider type="div" class="my-3"></Divider>
          <ul>
            <!-- BEGIN: First Child -->
            <template v-for="(menu, menuKey) in formattedMenu">
              <Divider
                v-if="menu == 'divider'"
                type="li"
                :class="[
                  'my-6',

                  // Animation
                  `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                    (menuKey + 1) * 10
                  }`,
                ]"
                :key="'divider-' + menuKey"></Divider>
              <li v-else :key="menuKey">
                <Menu
                  :class="{
                    // Animation
                    [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                      (menuKey + 1) * 10
                    }`]: !menu.active,
                  }"
                  :menu="menu"
                  :formattedMenuState="[formattedMenu, setFormattedMenu]"
                  level="first"></Menu>
                <!-- BEGIN: Second Child -->
                <Transition @enter="enter" @leave="leave">
                  <ul
                    v-if="menu.subMenu && menu.activeDropdown"
                    :class="[
                      'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                      'before:content-[\'\'] before:block before:inset-0 before:bg-primary/60 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                      { block: menu.activeDropdown },
                      { hidden: !menu.activeDropdown },
                    ]">
                    <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                      <Menu
                        :class="{
                          // Animation
                          [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                            (subMenuKey + 1) * 10
                          }`]: !subMenu.active,
                        }"
                        :menu="subMenu"
                        :formattedMenuState="[formattedMenu, setFormattedMenu]"
                        level="second"></Menu>
                      <!-- BEGIN: Third Child -->
                      <Transition @enter="enter" @leave="leave" v-if="subMenu.subMenu">
                        <ul
                          v-if="subMenu.subMenu && subMenu.activeDropdown"
                          :class="[
                            'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                            'before:content-[\'\'] before:block before:inset-0 before:bg-primary/60 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                            { block: subMenu.activeDropdown },
                            { hidden: !subMenu.activeDropdown },
                          ]">
                          <li v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu" :key="lastSubMenuKey">
                            <Menu
                              :class="{
                                // Animation
                                [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                  (lastSubMenuKey + 1) * 10
                                }`]: !lastSubMenu.active,
                              }"
                              :menu="lastSubMenu"
                              :formattedMenuState="[formattedMenu, setFormattedMenu]"
                              level="third"></Menu>
                          </li>
                        </ul>
                      </Transition>
                      <!-- END: Third Child -->
                    </li>
                  </ul>
                </Transition>
                <!-- END: Second Child -->
              </li>
            </template>
            <!-- END: First Child -->
          </ul>
        </nav>
      </aside>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div
        :class="[
          'rounded-[30px] md:rounded-[35px/50px_0px_0px_0px] min-w-0 min-h-screen max-w-full md:max-w-none bg-slate-100 flex-1 pb-10 px-4 md:px-6 relative md:ml-4 dark:bg-darkmode-700',
          'before:content-[\'\'] before:w-full before:h-px before:block',
          'after:content-[\'\'] after:z-[-1] after:rounded-[40px_0px_0px_0px] after:w-full after:inset-y-0 after:absolute after:left-0 after:bg-white/10 after:mt-8 after:-ml-4 after:dark:bg-darkmode-400/50',
        ]">
        <TopBarAdmin />
        <h2 class="text-lg font-medium intro-x">{{ $t(PageTitle($route)) }}</h2>
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>
  </div>
  <!-- MESSSAGE TOAST -->
  <NotificationToastify />
  <!-- MESSSAGE TOAST -->
</template>

<style lang="scss">
  .i-panel {
    aside {
      &.w-\[250px\] {
        .h-\[50px\] {
          > .hidden {
            display: flex;
          }
        }
        .load-averages {
          > .hidden {
            display: inline-block;
          }
        }
      }
    }
  }
</style>
