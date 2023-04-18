import axiosInstance from '@/config/Interceptors';
import { ISinger } from '@/model/interface/ISinger';
import { apiClient } from '@/http-common';

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

  search(singer: ISinger): Promise<any> {
    return axiosInstance.get(`/api/singer/${singer.id}/`);
  }

  recent(singer: ISinger): Promise<any> {
    return apiClient('').get('/api/singer/recent/')
  }
}

export default new SingerService();
