import { env } from '@/utils/my-variables';
import axiosInstance from '@/config/Interceptors';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { getNestedPropValue } from '@/utils/my-function';
import { IPackage } from '@/model/interface/IPackage';

class PackageService {
  getListPackage(pagination: IDataResponse): Promise<any> {
    let params = '';
    if (pagination.limit) params += 'limit=' + pagination.limit + '&';
    if (pagination.offset) params += 'offset=' + pagination.offset + '&';
    if (getNestedPropValue(pagination.filter, 'target_username'))
      params += 'target_username=' + pagination.filter.target_username + '&';
    if (getNestedPropValue(pagination.filter, 'search_name'))
      params += 'search_name=' + pagination.filter.search_name + '&';
    return axiosInstance.get(env.backendServer + '/api/private/package?' + params);
  }
  createResellerPackage(data: IPackage): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/package/reseller', data);
  }
  createEndUserPackage(data: IPackage): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/package/end_user', data);
  }
  deletePackage(data: IPackage): Promise<any> {
    return axiosInstance.delete(env.backendServer + '/api/private/package/' + data.id);
  }
}

export default new PackageService();
