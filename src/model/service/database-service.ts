import axiosInstance from '@/config/Interceptors';
import { env } from '@/utils/my-variables';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { IActionDatabase, IActionUserDatabase } from '@/model/interface/IDatabase';
import { getNestedPropValue } from '@/utils/my-function';

class IDatabaseService {
  getInfoRequest(): Promise<any> {
    return axiosInstance.get(env.backendServer + '/api/private/dbms/info');
  }
  getListDatabaseRequest(pagination: IDataResponse): Promise<any> {
    let params = '';
    if (pagination.limit) params += 'limit=' + pagination.limit + '&';
    if (pagination.offset) params += 'offset=' + pagination.offset + '&';
    if (getNestedPropValue(pagination.filter, 'search_name'))
      params += 'search_name=' + pagination.filter.search_name + '&';
    if (getNestedPropValue(pagination.filter, 'target_username'))
      params += 'target_username=' + pagination.filter.target_username + '&';
    return axiosInstance.get(env.backendServer + '/api/private/dbms/databases?' + params);
  }
  getListSupportedCharsetRequest(): Promise<any> {
    return axiosInstance.get(env.backendServer + '/api/public/dbms/charsets');
  }
  getListPrivilegesRequest(): Promise<any> {
    return axiosInstance.get(env.backendServer + '/api/public/dbms/privileges');
  }
  restartDatabaseServiceRequest(): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/dbms/restart');
  }
  createDatabaseRequest(data: IActionDatabase): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/dbms/create_database', data);
  }
  createUserDatabaseRequest(data: IActionUserDatabase): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/dbms/user', data);
  }
  deleteDatabaseRequest(data: IActionDatabase): Promise<any> {
    return axiosInstance.delete(env.backendServer + '/api/private/dbms/database/' + data.database_id);
  }
  deleteUserDatabaseRequest(data: IActionUserDatabase): Promise<any> {
    return axiosInstance.delete(env.backendServer + '/api/private/dbms/user', { data: data });
  }
  //user database
  changeUserDatabasePrivilegesRequest(data: IActionUserDatabase): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/dbms/privileges', data);
  }
  changeUserDatabaseHostRequest(data: IActionUserDatabase): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/dbms/user/host', data);
  }
  changeUserDatabasePasswordRequest(data: IActionUserDatabase): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/dbms/user/password', data);
  }
}

export default new IDatabaseService();
