<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import TopBar from '@/components/TopBar/TopBar.vue';
  import MobileMenu from '../../components/MobileMenu/AdminMobileMenu.vue';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import NotificationToastify from '@/base-components/iCustom/NotificationCustom/Main.vue';
  import { enter, FormattedMenu, leave, nestedMenu } from '@/layouts/Admin/admin-menu';
  import Divider from '@/layouts/Admin/Divider.vue';
  import Button from '@/base-components/Button/Button.vue';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Menu from '@/layouts/Admin/Menu.vue';
  import { useClientMenuStore } from '@/stores/client-menu';
  import PlayMusicPlayer from '@/pages/PlayMusicPlayer.vue';

  const route = useRoute();
  const formattedMenu = reactive<Array<FormattedMenu | 'divider'>>([]);
  const setFormattedMenu = (computedFormattedMenu: Array<FormattedMenu | 'divider'>) => {
    Object.assign(formattedMenu, computedFormattedMenu);
  };
  const clientMenuStore = useClientMenuStore();
  const sideMenu = computed(() => nestedMenu(clientMenuStore.menu, route));

  watch(sideMenu, () => {
    setFormattedMenu(sideMenu.value);
  });

  onMounted(() => {
    setFormattedMenu(sideMenu.value);
  });

  const menuExtend = ref<boolean>(false);
</script>

<template>
  <div class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15] dark:bg-transparent">
    <MobileMenu />
    <div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
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
            <img src='/favicon/android-chrome-192x192.png' width='30' height='30'>
            <span class="text-xl text-white/80 ml-2">Play music</span>
          </RouterLink>
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
      <!-- BEGIN: Content -->
      <div
        :class="[
          'rounded-[30px] md:rounded-[35px/50px_0px_0px_0px] min-w-0 min-h-screen max-w-full md:max-w-none bg-slate-100 flex-1 pb-10 px-4 md:px-6 relative md:ml-4 dark:bg-darkmode-700',
          'before:content-[\'\'] before:w-full before:h-px before:block',
          'after:content-[\'\'] after:z-[-1] after:rounded-[40px_0px_0px_0px] after:w-full after:inset-y-0 after:absolute after:left-0 after:bg-white/10 after:mt-8 after:-ml-4 after:dark:bg-darkmode-400/50',
        ]">
        <TopBar />
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>
  </div>
  <!-- Template Music -->
  <PlayMusicPlayer />
  <!-- Template Music -->
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
