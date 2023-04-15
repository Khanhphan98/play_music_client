import { defineStore } from 'pinia';
// @ts-ignore
import { Icon } from '@/base-components/Lucide/Lucide.vue';
import { Box, Music } from 'lucide-vue-next';

export interface AdminMenu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: AdminMenu[];
  ignore?: boolean;
  i18nkey: string;
}

export interface SideMenuState {
  menu: Array<AdminMenu | 'divider'>;
}

export const useAdminMenuStore = defineStore('adminMenu', {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: 'Home',
        pageName: 'side-menu-dashboard-overview-1',
        title: 'Dashboard',
        i18nkey: 'dashboard',
      },
      {
        icon: 'Music',
        pageName: 'admin-menu-song',
        title: 'Song',
        i18nkey: 'song',
        subMenu: [
          {
            icon: 'Newspaper',
            pageName: 'admin-menu-users-new-song',
            title: 'New Song',
            i18nkey: 'newsong',
          },
          {
            icon: 'Newspaper',
            pageName: 'admin-menu-users-list-song',
            title: 'List Song',
            i18nkey: 'listsong',
          },
        ],
      },
      {
        icon: 'User',
        pageName: 'admin-menu-singer',
        title: 'Singer',
        i18nkey: 'singer',
        subMenu: [
          {
            icon: 'Newspaper',
            pageName: 'admin-menu-users-new-singer',
            title: 'New Singer',
            i18nkey: 'newsinger',
          },
          {
            icon: 'Newspaper',
            pageName: 'admin-menu-users-list-singer',
            title: 'List Singer',
            i18nkey: 'listsinger',
          },
        ],
      },
      {
        icon: 'Box',
        pageName: 'admin-menu-profession',
        title: 'Profession',
        i18nkey: 'users',
        subMenu: [
          {
            icon: 'Newspaper',
            pageName: 'admin-menu-users-list-profession',
            title: 'List Profession',
            i18nkey: 'listprofession',
          },
        ],
      },
      {
        icon: 'Banknote',
        pageName: 'admin-menu-categories',
        title: 'Category',
        i18nkey: 'category',
        subMenu: [
          {
            icon: 'Banknote',
            pageName: 'admin-menu-users-list-categories',
            title: 'List Category',
            i18nkey: 'listcategory',
          },
        ],
      },
      {
        icon: 'MapPin',
        pageName: 'admin-menu-countries',
        title: 'Country',
        i18nkey: 'country',
        subMenu: [
          {
            icon: 'MapPin',
            pageName: 'admin-menu-users-list-countries',
            title: 'List Country',
            i18nkey: 'listcountry',
          },
        ],
      },
    ],
  }),
});
