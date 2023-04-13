import axiosInstance from '@/config/Interceptors';
import { env } from '@/utils/my-variables';
import { IIpAddress } from '@/model/interface/IIpAddress';
import { IDataResponse } from '@/model/interface/IDataResponse';

class IpManagerService {
  getListIpAddress(pagination: IDataResponse): Promise<any> {
    let params = '';
    if (pagination.limit) params += 'limit=' + pagination.limit + '&';
    if (pagination.offset) params += 'offset=' + pagination.offset + '&';
    return axiosInstance.get(env.backendServer + '/api/private/ip_manager?' + params);
  }
  saveIpAddress(data: IIpAddress): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/ip_manager', data);
  }
  deleteIpAddress(data: IIpAddress): Promise<any> {
    return axiosInstance.delete(env.backendServer + '/api/private/ip_manager/' + data.ip);
  }
  setPrimaryIpAddress(data: IIpAddress): Promise<any> {
    return axiosInstance.patch(env.backendServer + '/api/private/ip_manager/primary/' + data.ip);
  }
}

export default new IpManagerService();
