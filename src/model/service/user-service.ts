import { apiClient } from '@/http-common';
import { IUser } from '@/model/interface/IUser';
import axiosInstance from '@/config/Interceptors';

class UserService {
  login(data: IUser): Promise<any> {
    return apiClient('').post('/api/token', data);
  }
  getInfoUser(): Promise<any> {
    return axiosInstance.get('/api/user/');
  }
}

export default new UserService();
