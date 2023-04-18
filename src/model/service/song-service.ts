import axiosInstance from '@/config/Interceptors';
import { ISong } from '@/model/interface/ISong';
import { apiClient } from '@/http-common';

class SongService {
  list(): Promise<any> {
    return axiosInstance.get('/api/song/');
  }

  save(song: ISong): Promise<any> {
    return axiosInstance.post('/api/song/', song);
  }

  update(song: ISong): Promise<any> {
    return axiosInstance.put(`/api/song/${song.id}/`, song);
  }

  remove(song: ISong): Promise<any> {
    return axiosInstance.delete(`/api/song/${song.id}/`);
  }

  search(song: ISong): Promise<any> {
    return axiosInstance.get(`/api/song/${song.id}/`);
  }

  recent(song: ISong): Promise<any> {
    return apiClient('').get('/api/song/recent/')
  }
}

export default new SongService();
