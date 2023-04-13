<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import Lucide from '../../base-components/Lucide';
  import { FormattedMenu, linkTo } from './top-menu';

  interface MenuProps {
    class?: string | object;
    menu: FormattedMenu;
    level: 'first' | 'second' | 'third';
  }

  const router = useRouter();
  const props = defineProps<MenuProps>();
</script>

<template>
  <a
    :href="
    props.menu.subMenu
      ? '#'
      : ((pageName: string | undefined) => {
          try {
            return router.resolve({
              name: pageName,
            }).fullPath;
          } catch (err) {
            return '';
          }
        })(props.menu.pageName)
  "
    :class="[
      'h-[55px] flex items-center px-5 mr-1 text-white relative rounded-full xl:rounded-xl',
      props.level == 'first' && 'mt-[3px]',
      props.level == 'first' && props.menu.active && 'bg-slate-100 xl:bg-primary dark:bg-darkmode-700',
      props.level == 'first' &&
        props.menu.active &&
        'before:content-[\'\'] before:hidden xl:before:block before:inset-0 before:bg-white/[0.08] before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/10 before:dark:border-black/10 before:dark:bg-darkmode-700',
      props.level != 'first' && 'px-0 mr-0',
      props.class,
    ]"
    @click="(event: MouseEvent) => {
      event.preventDefault();

      linkTo(props.menu, router);
      }">
    <div
      :class="[
        'z-10 dark:text-slate-400',
        props.level == 'first' && '-mt-[3px]',
        props.level == 'first' && props.menu.active && 'dark:text-white text-primary xl:text-white',
      ]">
      <Lucide :icon="props.menu.icon" />
    </div>
    <div
      :class="[
        'ml-3 flex items-center whitespace-nowrap z-10 dark:text-slate-400',
        props.level == 'first' && '-mt-[3px]',
        props.level == 'first' &&
          props.menu.active &&
          'font-medium dark:text-white text-slate-800 xl:text-white',
        props.level != 'first' && 'w-full',
      ]">
      {{ props.menu.title }}
      <Lucide
        v-if="props.menu.subMenu"
        icon="ChevronDown"
        :class="[
          'hidden transition ease-in duration-100 w-4 h-4 xl:block',
          props.level == 'first' && 'ml-2',
          props.level != 'first' && 'ml-auto',
        ]" />
    </div>
  </a>
</template>
