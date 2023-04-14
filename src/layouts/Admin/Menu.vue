<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import Lucide from '../../base-components/Lucide';
  import SideMenuTooltip from './AdminMenuTooltip.vue';
  import { FormattedMenu, linkTo } from './admin-menu';

  interface MenuProps {
    class?: string | object;
    menu: FormattedMenu;
    formattedMenuState: [
      (FormattedMenu | 'divider')[],
      (computedFormattedMenu: Array<FormattedMenu | 'divider'>) => void,
    ];
    level: 'first' | 'second' | 'third';
    role?: string;
  }

  const router = useRouter();
  const props = defineProps<MenuProps>();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;
</script>

<template>
  <SideMenuTooltip
    as="a"
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
        'text-white/70 dark:text-white': !props.menu.active && props.level != 'first',
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
        'dark:text-white': !props.menu.active && props.level == 'first',
      }">
      <Lucide :icon="props.menu.icon" />
    </div>
    <div
      :class="[
        'hidden xl:flex w-full ml-3 items-center',
        { 'font-medium': props.menu.active && props.level != 'first' },
        {
          'font-medium z-10 dark:text-slate-300': props.menu.active && props.level == 'first',
        },
        {
          'dark:text-white': !props.menu.active && props.level == 'first',
        },
      ]">
      {{ props.menu.title }}

      <div
        v-if="props.menu.subMenu"
        :class="[
          'transition ease-in duration-100 ml-auto mr-5 hidden xl:block',
          { 'transform rotate-180': props.menu.activeDropdown },
        ]">
        <Lucide class="w-4 h-4" icon="ChevronDown" />
      </div>
    </div>
  </SideMenuTooltip>
</template>
