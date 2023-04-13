<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import Lucide from '../../base-components/Lucide';
  import Tippy from '../../base-components/Tippy';
  import { FormattedMenu, linkTo } from './simple-menu';

  interface MenuProps {
    class?: string | object;
    menu: FormattedMenu;
    formattedMenuState: [
      (FormattedMenu | 'divider')[],
      (computedFormattedMenu: Array<FormattedMenu | 'divider'>) => void,
    ];
    level: 'first' | 'second' | 'third';
  }

  const router = useRouter();
  const props = defineProps<MenuProps>();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;
</script>

<template>
  <Tippy
    as="a"
    :options="{
      placement: 'left',
    }"
    :content="props.menu.title"
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
      'h-[50px] flex items-center pl-5 text-white mb-1 relative rounded-xl',
      {
        'dark:text-slate-300': props.menu.active && props.level != 'first',
        'text-white/70 dark:text-slate-400': !props.menu.active && props.level != 'first',
        'bg-primary dark:bg-transparent': props.menu.active && props.level == 'first',
        'before:content-[\'\'] before:block before:inset-0 before:bg-white/[0.08] before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/10 before:dark:border-black/10 before:dark:bg-darkmode-700':
          props.menu.active && props.level == 'first',
        'hover:bg-primary/60 hover:dark:bg-transparent hover:before:block hover:before:inset-0 hover:before:bg-white/[0.04] hover:before:rounded-xl hover:before:absolute hover:before:z-[-1] hover:before:dark:bg-darkmode-700':
          !props.menu.active && !props.menu.activeDropdown && props.level == 'first',
      },
      props.class,
    ]"
    @click="(event: MouseEvent) => {
        event.preventDefault();
        linkTo(props.menu, router);
        setFormattedMenu([...formattedMenu]);
    }">
    <div
      :class="{
        'z-10 dark:text-slate-300': props.menu.active && props.level == 'first',
        'dark:text-slate-400': !props.menu.active && props.level == 'first',
      }">
      <Lucide :icon="props.menu.icon" />
    </div>
  </Tippy>
</template>
