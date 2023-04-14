import { IProfession } from '@/model/interface/IProfession';
import axiosInstance from '@/config/Interceptors';

class ProfessionService {
  list(): Promise<any> {
    return axiosInstance.get('/api/profession/');
  }

  save(profession: IProfession): Promise<any> {
    return axiosInstance.post('/api/profession/', profession);
  }

  update(profession: IProfession): Promise<any> {
    return axiosInstance.put(`/api/profession/${profession.id}/`, profession);
  }

  remove(profession: IProfession): Promise<any> {
    return axiosInstance.delete(`/api/profession/${profession.id}/`);
  }
}

export default new ProfessionService();
