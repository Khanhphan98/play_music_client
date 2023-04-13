import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IAccount, IActionAccount } from '@/model/interface/IAccount';
import AccountService from '@/model/service/account-service';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { MyStore } from '@/stores/my-store';
import router from '@/router';
import { getNestedPropValue, handleExceptionError } from '@/utils/my-function';
import { defaultLimitPerPage } from '@/utils/my-variables';

export const AccountStore = defineStore('accountStore', () => {
  const myStore = MyStore();
  const myAuthorization = ref<IAccount>({
    access_token: '',
    username: '',
    refresh_token: '',
    password: '',
  } as IAccount);
  const myAccount = ref<IAccount>({} as IAccount);
  const hasLogged = ref(false);
  const listChildUser = ref<IDataResponse>({
    data: [] as IAccount[],
    limit: defaultLimitPerPage,
    total: 0,
    offset: 0,
    currentPage: 1,
    totalPage: 0,
    filter: { username: '', role_slug: '' },
  } as IDataResponse);

  function actionRemoveToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    myAuthorization.value.access_token = '';
    myAuthorization.value.refresh_token = '';
    hasLogged.value = false;
  }

  function actionGetToken() {
    myAuthorization.value.access_token = localStorage.getItem('accessToken') as string;
    myAuthorization.value.refresh_token = localStorage.getItem('refreshToken') as string;
  }

  async function actionLogin(data: IAccount, rememberMe: boolean) {
    //init request
    const dataRequest = { username: data.username, password: data.password } as IAccount;
    //call request
    try {
      const response = await AccountService.loginRequest(dataRequest);
      if (response.data) {
        const responseData = response.data as IDataResponse;
        const account = responseData.data as IAccount;
        localStorage.setItem('accessToken', account.access_token);
        //Check remember me
        if (rememberMe) {
          localStorage.setItem('refreshToken', account.refresh_token);
        }
        //redirect to dashboard
        await router.push('/');
      } else {
        myStore.showToastMessage(undefined, true);
      }
    } catch (e) {
      actionRemoveToken();
      handleExceptionError(e);
    }
  }

  async function actionGetUser() {
    if (myAuthorization.value.access_token) {
      try {
        //call request
        const response = await AccountService.getUserRequest();
        if (response.data) {
          const responseData = response.data as IDataResponse;
          const account = responseData.data as IAccount;
          hasLogged.value = !!account.email;
          //set value for my account
          myAccount.value = account;
          if (!hasLogged.value) {
            actionRemoveToken();
          }
        }
      } catch (e) {
        // Refresh token has expired or invalid
        actionRemoveToken();
        location.reload();
      }
    }
  }

  async function actionCreateUser(request: IAccount) {
    if (myAuthorization.value.access_token) {
      await AccountService.createUserRequest(request);
    }
  }

  async function actionListChildUser() {
    if (myAuthorization.value.access_token) {
      //init value
      let hasData = false;
      //call request
      const response = await AccountService.listChildUserRequest(listChildUser.value);
      if (getNestedPropValue(response.data, 'data')) {
        const responseData = response.data.data as IDataResponse;
        listChildUser.value.data = responseData.data;
        listChildUser.value.total = responseData.total;
        listChildUser.value.limit = responseData.limit;
        listChildUser.value.offset = responseData.offset;
        listChildUser.value.totalPage = Math.ceil(responseData.total / responseData.limit);
        hasData = true;
      }
      if (!hasData) {
        listChildUser.value.data = [];
      }
    }
  }

  async function actionSuspendUser(data: IActionAccount) {
    if (myAuthorization.value.access_token) {
      //call request
      await AccountService.suspendUserRequest(data);
    }
  }

  async function actionResumeUser(data: IActionAccount) {
    if (myAuthorization.value.access_token) {
      //call request
      await AccountService.resumeUserRequest(data);
    }
  }

  async function actionResetChildPassword(data: IAccount) {
    if (myAuthorization.value.access_token) {
      //call request
      await AccountService.resetChildPasswordRequest(data);
    }
  }

  async function actionDeleteChildUser(data: IActionAccount) {
    if (myAuthorization.value.access_token) {
      //call request
      await AccountService.deleteChildUserRequest(data);
    }
  }

  async function actionChangePackage(data: IActionAccount) {
    if (myAuthorization.value.access_token) {
      //call request
      await AccountService.changePackageRequest(data);
    }
  }

  async function actionLoginAs(data: IAccount) {
    if (myAuthorization.value.access_token) {
      //call request
      await AccountService.loginAs(data);
    }
  }

  return {
    myAuthorization,
    myAccount,
    listChildUser,
    hasLogged,
    actionGetToken,
    actionRemoveToken,
    actionLogin,
    actionGetUser,
    actionCreateUser,
    actionListChildUser,
    actionSuspendUser,
    actionResumeUser,
    actionResetChildPassword,
    actionDeleteChildUser,
    actionChangePackage,
    actionLoginAs,
  };
});
