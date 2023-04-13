// Example usage of axios to make an API request
import axios from 'axios';
import { env } from '@/utils/my-variables';
import { IAccount, IActionAccount } from '@/model/interface/IAccount';
import axiosInstance from '@/config/Interceptors';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { getNestedPropValue } from '@/utils/my-function';

class AccountService {
  loginRequest(data: IAccount): Promise<any> {
    return axios.post(env.backendServer + '/api/user/login', data, { timeout: 10000 });
  }
  getUserRequest(): Promise<any> {
    return axiosInstance.get(env.backendServer + '/api/private/user');
  }
  listChildUserRequest(pagination: IDataResponse): Promise<any> {
    let params = '';
    if (pagination.limit) params += 'limit=' + pagination.limit + '&';
    if (pagination.offset) params += 'offset=' + pagination.offset + '&';
    if (getNestedPropValue(pagination.filter, 'username'))
      params += 'username=' + pagination.filter.username + '&';
    if (getNestedPropValue(pagination.filter, 'role_slug'))
      params += 'role_slug=' + pagination.filter.role_slug + '&';
    if (getNestedPropValue(pagination.filter, 'status')) params += 'status=' + pagination.filter.status + '&';
    return axiosInstance.get(env.backendServer + '/api/private/user/child?' + params);
  }
  createUserRequest(data: IAccount): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/user/' + data.child_role_slug, data);
  }
  resetChildPasswordRequest(data: IAccount): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/user/child_password', data);
  }
  suspendUserRequest(data: IActionAccount): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/user/suspend', data);
  }
  resumeUserRequest(data: IActionAccount): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/user/resume', data);
  }
  deleteChildUserRequest(data: IActionAccount): Promise<any> {
    return axiosInstance.delete(env.backendServer + '/api/private/user', { data: data });
  }
  changePackageRequest(data: IActionAccount): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/user/package', data);
  }
  loginAs(data: IAccount): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/user/login_as', data);
  }
}

export default new AccountService();
