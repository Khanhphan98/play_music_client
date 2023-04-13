import { apiClient } from '@/http-common';
import { IUser } from '@/model/interface/IUser';

class UserService {
  login(data: IUser): Promise<any> {
    return apiClient('').post('/api/token', data);
  }
}

export default new UserService();
