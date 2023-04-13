import { defineStore } from 'pinia';
// @ts-ignore
import { Icon } from '@/base-components/Lucide/Lucide.vue';

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
        icon: 'User',
        pageName: 'admin-menu-profession',
        title: 'User Account',
        i18nkey: 'users',
        subMenu: [
          {
            icon: 'UserPlus',
            pageName: 'admin-menu-users-new-profession',
            title: 'New Account',
            i18nkey: 'newaccount',
          },
          {
            icon: 'Users',
            pageName: 'admin-menu-users-list-profession',
            title: 'List Account',
            i18nkey: 'listaccount',
          },
        ],
      },
    ],
  }),
});
