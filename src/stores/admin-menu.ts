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
        pageName: 'admin-menu-users',
        title: 'User Account',
        i18nkey: 'users',
        subMenu: [
          {
            icon: 'UserPlus',
            pageName: 'admin-menu-users-new-account',
            title: 'New Account',
            i18nkey: 'newaccount',
          },
          {
            icon: 'Users',
            pageName: 'admin-menu-users-list-account',
            title: 'List Account',
            i18nkey: 'listaccount',
          },
          {
            icon: 'ListChecks',
            pageName: 'admin-menu-users-list-acl',
            title: 'List ACL',
            i18nkey: 'listacl',
          },
        ],
      },
      {
        icon: 'Package',
        pageName: 'admin-menu-packages',
        title: 'Packages',
        i18nkey: 'packages',
        subMenu: [
          {
            icon: 'Boxes',
            pageName: 'admin-menu-packages-list',
            title: 'packages_list',
            i18nkey: 'packagelist',
          },
          {
            icon: 'LayoutTemplate',
            pageName: 'admin-menu-packages-template',
            title: 'packages_template',
            i18nkey: 'packagetemplate',
          },
        ],
      },
      {
        icon: 'Database',
        pageName: 'admin-menu-database',
        title: 'SQL Services',
        i18nkey: 'sqlservices',
        subMenu: [
          {
            icon: 'ChevronRight',
            pageName: 'admin-menu-mysql-manager',
            title: 'MySQL Manager',
            i18nkey: 'mysqlmanager',
          },
        ],
      },
      {
        icon: 'Wrench',
        pageName: 'admin-menu-cwp-settings',
        title: 'CWP Settings',
        i18nkey: 'cwpsettings',
        subMenu: [
          {
            icon: 'Minus',
            pageName: 'admin-menu-ip-manager',
            title: 'IP Manager',
            i18nkey: 'ipmanager',
          },
          {
            icon: 'Minus',
            pageName: 'admin-menu-ip-group-manager',
            title: 'IP Group Manager',
            i18nkey: 'ipgroupmanager',
          },
        ],
      },
    ],
  }),
});
