import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AccountStore } from '@/stores/account-store';
import IpManagerService from '@/model/service/ip-manager-service';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { getNestedPropValue } from '@/utils/my-function';
import { IIpAddress } from '@/model/interface/IIpAddress';
import { defaultLimitPerPage, defaultTimeoutSubmit } from '@/utils/my-variables';

export const IpManagerStore = defineStore('ipManagerStore', () => {
  const accountStore = AccountStore();
  const listIpAddress = ref<IDataResponse>({
    data: [] as IIpAddress[],
    limit: defaultLimitPerPage,
    total: 0,
    offset: 0,
    currentPage: 1,
    totalPage: 0,
  } as IDataResponse);
  const showIpCreate = ref(''); // show ip created
  const showIpDelete = ref(''); // show ip deleted

  async function actionGetListIpAddress() {
    if (accountStore.myAuthorization.access_token) {
      //init value
      let hasData = false;
      //call request
      const response = await IpManagerService.getListIpAddress(listIpAddress.value);
      if (getNestedPropValue(response.data, 'data')) {
        const responseData = response.data.data as IDataResponse;
        listIpAddress.value.data = responseData.data;
        listIpAddress.value.total = responseData.total;
        listIpAddress.value.limit = responseData.limit;
        listIpAddress.value.offset = responseData.offset;
        listIpAddress.value.totalPage = Math.ceil(responseData.total / responseData.limit);
        hasData = true;
      }
      if (!hasData) {
        // reset value
        listIpAddress.value.data = [];
      }
    }
  }

  async function actionSaveIpAddress(ipAddress: IIpAddress) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await IpManagerService.saveIpAddress(ipAddress);
      if (!response.data.error) {
        showIpCreate.value = ipAddress.ip;
        await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
        showIpCreate.value = '';
      }
    }
  }

  async function actionDeleteIpAddress(ipAddress: IIpAddress) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await IpManagerService.deleteIpAddress(ipAddress);
      if (!response.data.error) {
        showIpDelete.value = ipAddress.ip;
        await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
        showIpDelete.value = '';
      }
    }
  }

  async function actionSetPrimaryIp(ipAddress: IIpAddress) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      await IpManagerService.setPrimaryIpAddress(ipAddress);
    }
  }

  return {
    showIpCreate,
    showIpDelete,
    listIpAddress,
    actionGetListIpAddress,
    actionSaveIpAddress,
    actionDeleteIpAddress,
    actionSetPrimaryIp,
  };
});
