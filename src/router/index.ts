import { createRouter, createWebHistory } from 'vue-router';
import AdminMenu from '../layouts/Admin/AdminMenu.vue';
import DashboardOverview1 from '../pages/DashboardOverview1.vue';
import Login from '../pages/Login.vue';
import ErrorPage from '../pages/ErrorPage.vue';
import { handleExceptionError } from '@/utils/my-function';
import { UserStore } from '@/stores/user-store';
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
    path: '/songs',
    redirect: '/list-singer/list-songs',
    name: 'admin-menu-users-songs',
    component: AdminMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-menu-users-list-songs',
        component: () => import('@/pages/Songs/ListSong.vue'),
        meta: {
          title: 'list_songs',
        },
      },
      {
        path: 'save-songs',
        name: 'admin-menu-users-new-songs',
        component: () => import('@/pages/Songs/NewSong.vue'),
        meta: {
          title: 'new_songs',
        },
      },
      {
        path: 'save-songs/:id',
        name: 'admin-menu-users-save-songs',
        component: () => import('@/pages/Songs/NewSong.vue'),
        meta: {
          title: 'save_songs',
        },
      },
    ],
  },
  {
    path: '/profession',
    redirect: '/list-profession',
    name: 'admin-menu-users-profession',
    component: AdminMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-menu-users-list-profession',
        component: () => import('@/pages/Profession/ListProfession.vue'),
        meta: {
          title: 'list_profession',
        },
      },
    ],
  },
  {
    path: '/singer',
    redirect: '/list-singer/list-singer',
    name: 'admin-menu-users-singer',
    component: AdminMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-menu-users-list-singer',
        component: () => import('@/pages/Singer/ListSinger.vue'),
        meta: {
          title: 'list_singer',
        },
      },
      {
        path: 'save-singer',
        name: 'admin-menu-users-new-singer',
        component: () => import('@/pages/Singer/NewSinger.vue'),
        meta: {
          title: 'new_singer',
        },
      },
      {
        path: 'save-singer/:id',
        name: 'admin-menu-users-save-singer',
        component: () => import('@/pages/Singer/NewSinger.vue'),
        meta: {
          title: 'save_singer',
        },
      },
    ],
  },
  {
    path: '/categories',
    redirect: '/list-categories',
    name: 'admin-menu-users-categories',
    component: AdminMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-menu-users-list-categories',
        component: () => import('@/pages/Categories/ListCategories.vue'),
        meta: {
          title: 'list_caregories',
        },
      },
    ],
  },
  {
    path: '/countries',
    redirect: '/list-countries',
    name: 'admin-menu-users-countries',
    component: AdminMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-menu-users-list-countries',
        component: () => import('@/pages/Country/ListCountry.vue'),
        meta: {
          title: 'countries',
        },
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
  //init value
  const userStore = UserStore();
  const localeStore = LocaleStore();
  //set locale
  localeStore.actionSetDefaultLocale();
  //get token
  userStore.actionGetToken();
  //nếu giá trị rỗng thì chuyển route về login
  if (to.matched.some((record) => record.meta.requiresAuth) && !userStore.myUser.access_token) {
    next('/login');
  }
  //nếu co jwt hop le check dang vao route login ko, neu dung thi redirect ve trang chu admin
  else if (userStore.myUser.access_token && to.path === '/login') {
    next('/');
  }
  //Cho phép truy cập khac binh thuong
  else {
    //next route
    next();
  }
});


export default router;
