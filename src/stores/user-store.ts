import { defineStore } from 'pinia';
import { IUser } from '@/model/interface/IUser';
import UserService from '@/model/service/user-service';
import { ref } from 'vue';
import { handleExceptionError } from '@/utils/my-function';
import router from '@/router';

export const UserStore = defineStore('userStore', () => {
  const myUser = ref<IUser>({ username: '', password: '', access_token: '', refresh_token: '' } as IUser);
  const hasLogged = ref(false);


  async function login(user: IUser) {
    try {
      // init request
      const request = { username: user.username, password: user.password } as IUser;
      // call request
      const response = await UserService.login(request);
      if (response.data) {
        // set user
        myUser.value.username = user.username;
        // init response
        const access_token = response.data.access;
        const refresh_token = response.data.refresh;
        // set token
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        //redirect to dashboard
        await router.push('/admin');
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  function actionGetToken() {
    myUser.value.access_token = localStorage.getItem('access_token') as string;
    myUser.value.refresh_token = localStorage.getItem('refresh_token') as string;
  }

  function actionRemoveToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    myUser.value.access_token = '';
    myUser.value.refresh_token = '';
    hasLogged.value = false;
  }

  async function actionGetInfoUser() {
      try {
        const response = await UserService.getInfoUser();
        if (response.data) {
          myUser.value.username = response.data[0].username;
        }
      } catch (e) {
        actionRemoveToken();
        handleExceptionError(e);
      }
  }

  return {
    myUser,
    hasLogged,
    login,
    actionGetToken,
    actionRemoveToken,
    actionGetInfoUser
  };
});
