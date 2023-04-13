import axiosInstance from '@/config/Interceptors';
import { env } from '@/utils/my-variables';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { IIpGroup } from '@/model/interface/IIpGroup';

class IpGroupManagerService {
  getListIpGroup(pagination: IDataResponse): Promise<any> {
    let params = '';
    if (pagination.limit) params += 'limit=' + pagination.limit + '&';
    if (pagination.offset) params += 'offset=' + pagination.offset + '&';
    return axiosInstance.get(env.backendServer + '/api/private/ip_group?' + params);
  }
  saveIpGroup(data: IIpGroup): Promise<any> {
    return axiosInstance.post(env.backendServer + '/api/private/ip_group', data);
  }
  deleteIpGroup(data: IIpGroup): Promise<any> {
    return axiosInstance.delete(env.backendServer + '/api/private/ip_group/' + data.id);
  }
}

export default new IpGroupManagerService();
