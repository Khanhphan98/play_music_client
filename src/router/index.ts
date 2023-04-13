import { createRouter, createWebHistory } from 'vue-router';
import AdminMenu from '../layouts/Admin/AdminMenu.vue';
import DashboardOverview1 from '../pages/DashboardOverview1.vue';
import Login from '../pages/Login.vue';
import ErrorPage from '../pages/ErrorPage.vue';
import { AccountStore } from '@/stores/account-store';
import { handleExceptionError } from '@/utils/my-function';
import { PackageStore } from '@/stores/package-store';
import { LocaleStore } from '@/stores/locale-store';

const routes = [
  {
    path: '/',
    component: AdminMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'side-menu-dashboard-overview-1',
        component: DashboardOverview1,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/error-page',
    name: 'error-page',
    component: ErrorPage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, _from, next) => {
  //Check nếu đang truy cập route admin
  const arrays = to.path.split('/');
  const pathAdmin = arrays.some((value) => value === 'admin');
  //init value
  const accountStore = AccountStore();
  const packageStore = PackageStore();
  const localeStore = LocaleStore();
  //set locale
  localeStore.actionSetDefaultLocale();
  //get token
  accountStore.actionGetToken();
  //check 1 lan gui request ve server xem jwt hop le ko
  if (!accountStore.hasLogged) {
    try {
      //require token
      if (accountStore.myAuthorization.access_token) {
        //get user
        accountStore.actionGetUser().then();
        //get packages
        packageStore.actionGetListPackage().then();
      }
    } catch (e) {
      accountStore.actionRemoveToken();
      handleExceptionError(e);
    }
  }
  //nếu giá trị rỗng thì chuyển route về login
  if (to.matched.some((record) => record.meta.requiresAuth) && !accountStore.myAuthorization.access_token) {
    next('/login');
  }
  //nếu co jwt hop le check dang vao route login ko, neu dung thi redirect ve trang chu admin
  else if (accountStore.myAuthorization.access_token && to.path === '/login') {
    next('/');
  }
  //Cho phép truy cập khac binh thuong
  else {
    //next route
    next();
  }
});

export default router;
