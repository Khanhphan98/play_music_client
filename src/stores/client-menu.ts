import { defineStore } from 'pinia';
// @ts-ignore
import { Icon } from '@/base-components/Lucide/Lucide.vue';
import { Box, Music } from 'lucide-vue-next';

export interface ClientMenu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: ClientMenu[];
  ignore?: boolean;
  i18nkey: string;
}

export interface SideMenuState {
  menu: Array<ClientMenu | 'divider'>;
}

export const useClientMenuStore = defineStore('ClientMenu', {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: 'CircleDot',
        pageName: 'client-menu-users-list-discovery',
        title: 'Discovery',
        i18nkey: 'discovery',
      },
      {
        icon: 'Music',
        pageName: 'client-menu-users-list-discovery-song',
        title: 'Song',
        i18nkey: 'song',
      },
      {
        icon: 'Mic2',
        pageName: 'client-menu-users-list-discovery-singer',
        title: 'Singer',
        i18nkey: 'singer',
      },
    ],
  }),
});
