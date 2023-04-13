import { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import { AdminMenu } from '@/stores/admin-menu';
import { slideUp, slideDown } from '@/utils/helper';
import i18nMenuKey from '@/layouts/Admin/role-menu';

interface Route extends RouteLocationNormalizedLoaded {
  forceActiveMenu?: string;
}

export interface FormattedMenu extends AdminMenu {
  active?: boolean;
  activeDropdown?: boolean;
  role?: string[];
  subMenu?: FormattedMenu[];
}

// Setup side menu
const findActiveMenu = (subMenu: AdminMenu[], route: Route): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((route.forceActiveMenu !== undefined && item.pageName === route.forceActiveMenu) ||
        (route.forceActiveMenu === undefined && item.pageName === route.name)) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, route);
    }
  });
  return match;
};

const nestedMenu = (menu: Array<AdminMenu | 'divider'>, route: Route) => {
  const formattedMenu: Array<FormattedMenu | 'divider'> = [];
  menu.forEach((item, idx) => {
    if (typeof item !== 'string') {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        role: ['root'],
        pageName: item.pageName,
        subMenu: item.subMenu,
        ignore: item.ignore,
        i18nkey: item.i18nkey,
      };
      // BEGIN: Demo Role
      if (i18nMenuKey[menuItem.i18nkey]) {
        menuItem.role?.push(...i18nMenuKey[menuItem.i18nkey]);
      }

      // END: Demo Role
      menuItem.active =
        ((route.forceActiveMenu !== undefined && menuItem.pageName === route.forceActiveMenu) ||
          (route.forceActiveMenu === undefined && menuItem.pageName === route.name) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, route))) &&
        !menuItem.ignore;

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, route);

        // Nested menu
        const subMenu: Array<FormattedMenu> = [];
        nestedMenu(menuItem.subMenu, route).map((menu) => typeof menu !== 'string' && subMenu.push(menu));
        menuItem.subMenu = subMenu;
      }

      formattedMenu.push(menuItem);
    } else {
      formattedMenu.push(item);
    }
  });

  return formattedMenu;
};

const linkTo = (menu: FormattedMenu, router: Router) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pageName !== undefined) {
      router.push({
        name: menu.pageName,
      });
    }
  }
};

const enter = (el: HTMLElement) => {
  slideDown(el, 300);
};

const leave = (el: HTMLElement) => {
  slideUp(el, 300);
};

export { nestedMenu, linkTo, enter, leave };
