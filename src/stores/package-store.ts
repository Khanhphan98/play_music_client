import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IPackage } from '@/model/interface/IPackage';
import { IDataResponse } from '@/model/interface/IDataResponse';
import PackageService from '@/model/service/package-service';
import { getNestedPropValue, handleExceptionError } from '@/utils/my-function';
import { AccountStore } from '@/stores/account-store';
import { defaultLimitPerPage } from '@/utils/my-variables';

export const PackageStore = defineStore('packageStore', () => {
  const accountStore = AccountStore();
  const listPackage = ref<IDataResponse>({
    data: [] as IPackage[],
    limit: defaultLimitPerPage,
    total: 0,
    offset: 0,
    currentPage: 1,
    totalPage: 0,
    filter: { target_username: '', search_name: '' },
  } as IDataResponse);

  async function actionGetListPackage() {
    if (accountStore.myAuthorization.access_token) {
      try {
        //init value
        let hasData = false;
        //call request
        const response = await PackageService.getListPackage(listPackage.value);
        if (response.data) {
          const responseData = response.data as IDataResponse;
          if (getNestedPropValue(responseData, 'data')) {
            const responseData = response.data.data as IDataResponse;
            listPackage.value.data = responseData.data;
            listPackage.value.total = responseData.total;
            listPackage.value.limit = responseData.limit;
            listPackage.value.offset = responseData.offset;
            listPackage.value.totalPage = Math.ceil(responseData.total / responseData.limit);
            hasData = true;
          }
        }
        if (!hasData) {
          // reset value
          listPackage.value.data = [];
        }
      } catch (e) {
        handleExceptionError(e);
      }
    }
  }

  async function actionCreateResellerPackage(data: IPackage) {
    if(accountStore.myAuthorization.access_token){
        //call request
        const res = await PackageService.createResellerPackage(data);
        console.log('res', res.data)
    }
  }

  async function actionCreateEndUserPackage(data: IPackage) {
    if(accountStore.myAuthorization.access_token){
        //call request
        await PackageService.createEndUserPackage(data);
    }
  }

  async function actionDeletePackage(data: IPackage) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await PackageService.deletePackage(data);
    }
  }

  return {
    listPackage,
    actionGetListPackage,
    actionDeletePackage,
    actionCreateResellerPackage,
    actionCreateEndUserPackage
  };
});
