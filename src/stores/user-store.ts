import { defineStore } from 'pinia';
import { IUser } from '@/model/interface/IUser';
import userService from '@/model/service/user-service';
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
      const response = await userService.login(request);
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
        await router.push('/');
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    myUser.value.access_token = '';
    myUser.value.refresh_token = '';
    hasLogged.value = false;
  }

  return {
    myUser,
    hasLogged,
    login,
    actionGetToken,
    actionRemoveToken
  };
});
