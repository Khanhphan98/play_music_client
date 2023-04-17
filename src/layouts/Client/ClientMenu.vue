<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import Divider from './Divider.vue';
  import Menu from './Menu.vue';
  import TopBarAdmin from '@/components/TopBar/TopBarAdmin.vue';
  import MobileMenu from '../../components/MobileMenu/AdminMobileMenu.vue';
  import { watch, reactive, computed, onMounted, ref } from 'vue';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Button from '@/base-components/Button/Button.vue';
  import NotificationToastify from '@/base-components/iCustom/NotificationCustom/Main.vue';

  const route = useRoute();

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
      _title = '';
    }
    return _title;
  }
</script>

<template>
  <div class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15] dark:bg-transparent">
    <MobileMenu />
    <div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
      <!-- BEGIN: Content -->
      <div
        :class="[
          'rounded-[30px] md:rounded-[35px/50px_0px_0px_0px] min-w-0 min-h-screen max-w-full md:max-w-none bg-slate-100 flex-1 pb-10 px-4 md:px-6 relative md:ml-4 dark:bg-darkmode-700',
          'before:content-[\'\'] before:w-full before:h-px before:block',
          'after:content-[\'\'] after:z-[-1] after:rounded-[40px_0px_0px_0px] after:w-full after:inset-y-0 after:absolute after:left-0 after:bg-white/10 after:mt-8 after:-ml-4 after:dark:bg-darkmode-400/50',
        ]">
        <TopBarAdmin />
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
