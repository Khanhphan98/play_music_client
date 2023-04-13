import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AccountStore } from '@/stores/account-store';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { getNestedPropValue } from '@/utils/my-function';
import { defaultLimitPerPage, defaultTimeoutSubmit } from '@/utils/my-variables';
import { IIpGroup } from '@/model/interface/IIpGroup';
import IpGroupManagerService from '@/model/service/ip-group-manager-service';

export const IpGroupManagerStore = defineStore('ipGroupManagerStore', () => {
  const accountStore = AccountStore();
  const listIpGroup = ref<IDataResponse>({
    data: [] as IIpGroup[],
    limit: defaultLimitPerPage,
    total: 0,
    offset: 0,
    currentPage: 1,
    totalPage: 0,
  } as IDataResponse);
  const showIpGroupCreate = ref(''); // show ip Group created
  const showIpGroupDelete = ref(''); // show ip Group deleted

  async function actionGetListIpGroup() {
    if (accountStore.myAuthorization.access_token) {
      //init value
      let hasData = false;
      //call request
      const response = await IpGroupManagerService.getListIpGroup(listIpGroup.value);
      if (getNestedPropValue(response.data, 'data')) {
        const responseData = response.data.data as IDataResponse;
        listIpGroup.value.data = responseData.data;
        listIpGroup.value.total = responseData.total;
        listIpGroup.value.limit = responseData.limit;
        listIpGroup.value.offset = responseData.offset;
        listIpGroup.value.totalPage = Math.ceil(responseData.total / responseData.limit);
        hasData = true;
      }
      if (!hasData) {
        // reset value
        listIpGroup.value.data = [];
      }
    }
  }

  async function actionSaveIpGroup(ipGroup: IIpGroup) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await IpGroupManagerService.saveIpGroup(ipGroup);
      if (!response.data.error) {
        showIpGroupCreate.value = ipGroup.name;
        await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
        showIpGroupCreate.value = '';
      }
    }
  }

  async function actionDeleteIpGroup(ipGroup: IIpGroup) {
    if (accountStore.myAuthorization.access_token) {
      //call request
      const response = await IpGroupManagerService.deleteIpGroup(ipGroup);
      if (!response.data.error) {
        showIpGroupDelete.value = ipGroup.name;
        await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
        showIpGroupDelete.value = '';
      }
    }
  }

  return {
    listIpGroup,
    showIpGroupCreate,
    showIpGroupDelete,
    actionSaveIpGroup,
    actionDeleteIpGroup,
    actionGetListIpGroup,
  };
});
