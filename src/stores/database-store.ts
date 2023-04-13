import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { getNestedPropValue } from '@/utils/my-function';
import { AccountStore } from '@/stores/account-store';
import { IActionDatabase, IActionUserDatabase, IDatabase, IPrivileges } from '@/model/interface/IDatabase';
import DatabaseService from '@/model/service/database-service';
import { defaultLimitPerPage } from '@/utils/my-variables';

export const DatabaseStore = defineStore('databaseStore', () => {
  const accountStore = AccountStore();
  const databaseInfo = ref('');
  const databaseResponse = ref<IDataResponse>({
    data: [] as IDatabase[],
    limit: defaultLimitPerPage,
    total: 0,
    offset: 0,
    currentPage: 1,
    totalPage: 0,
    filter: { username: '', role_slug: '' },
  } as IDataResponse);
  const listSupportedCharset = ref<{ [key: string]: string }>({ key: 'value' });
  const listPrivileges = ref<IPrivileges>({ data: [], structure: [] });
  async function actionGetInfo() {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await DatabaseService.getInfoRequest();
      if (response.data) {
        const responseData = response.data as IDataResponse;
        if (getNestedPropValue(responseData, 'data')) {
          databaseInfo.value = responseData.data;
        }
      }
    }
  }
  async function actionGetListDatabase() {
    if (accountStore.myAuthorization.access_token) {
      //init value
      let hasData = false;
      //call request
      const response = await DatabaseService.getListDatabaseRequest(databaseResponse.value);
      if (getNestedPropValue(response.data, 'data')) {
        const responseData = response.data.data as IDataResponse;
        databaseResponse.value.data = responseData.data;
        databaseResponse.value.total = responseData.total;
        databaseResponse.value.limit = responseData.limit;
        databaseResponse.value.offset = responseData.offset;
        databaseResponse.value.totalPage = Math.ceil(responseData.total / responseData.limit);
        hasData = true;
      }
      if (!hasData) {
        //reset value
        databaseResponse.value.data = [];
      }
    }
  }

  async function actionGetListSupportedCharset() {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await DatabaseService.getListSupportedCharsetRequest();
      if (response.data) {
        const responseData = response.data as IDataResponse;
        if (getNestedPropValue(responseData, 'data')) {
          listSupportedCharset.value = responseData.data;
        }
      }
    }
  }

  async function actionGetListPrivileges() {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await DatabaseService.getListPrivilegesRequest();
      if (response.data) {
        const responseData = response.data as IDataResponse;
        if (getNestedPropValue(responseData, 'data')) {
          listPrivileges.value = responseData.data as IPrivileges;
        }
      }
    }
  }
  async function actionRestartDatabaseService() {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.restartDatabaseServiceRequest();
    }
  }
  async function actionCreateUserDatabase(data: IActionUserDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.createUserDatabaseRequest(data);
    }
  }
  async function actionCreateDatabase(data: IActionDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.createDatabaseRequest(data);
    }
  }
  async function actionDeleteDatabase(data: IActionDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.deleteDatabaseRequest(data);
    }
  }
  async function actionDeleteUserDatabase(data: IActionUserDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.deleteUserDatabaseRequest(data);
    }
  }

  async function actionChangeUserDatabasePrivileges(data: IActionUserDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.changeUserDatabasePrivilegesRequest(data);
    }
  }

  async function actionChangeUserDatabaseHost(data: IActionUserDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.changeUserDatabaseHostRequest(data);
    }
  }

  async function actionChangeUserDatabasePassword(data: IActionUserDatabase) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await DatabaseService.changeUserDatabasePasswordRequest(data);
    }
  }

  return {
    databaseInfo,
    databaseResponse,
    listSupportedCharset,
    listPrivileges,
    actionGetInfo,
    actionGetListDatabase,
    actionGetListSupportedCharset,
    actionGetListPrivileges,
    actionRestartDatabaseService,
    actionCreateUserDatabase,
    actionCreateDatabase,
    actionDeleteUserDatabase,
    actionChangeUserDatabasePrivileges,
    actionChangeUserDatabaseHost,
    actionChangeUserDatabasePassword,
    actionDeleteDatabase,
  };
});
