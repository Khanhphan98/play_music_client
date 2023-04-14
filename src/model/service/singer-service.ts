import { IProfession } from '@/model/interface/IProfession';
import axiosInstance from '@/config/Interceptors';
import { ISinger } from '@/model/interface/ISinger';

class SingerService {
  list(): Promise<any> {
    return axiosInstance.get('/api/singer/');
  }

  save(singer: ISinger): Promise<any> {
    return axiosInstance.post('/api/singer/', singer);
  }

  update(singer: ISinger): Promise<any> {
    return axiosInstance.put(`/api/singer/${singer.id}/`, singer);
  }

  remove(singer: ISinger): Promise<any> {
    return axiosInstance.delete(`/api/singer/${singer.id}/`);
  }
}

export default new SingerService();
