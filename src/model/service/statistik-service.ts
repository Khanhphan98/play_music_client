import axiosInstance from '@/config/Interceptors';
import { IStatistik } from '@/model/interface/IStatistik';

class StatistikService {
  save(statistik: IStatistik): Promise<any> {
    return axiosInstance.post('/api/statistik/', statistik);
  }

  update(statistik: IStatistik): Promise<any> {
    return axiosInstance.put(`/api/statistik/${statistik.id}/`, statistik);
  }

}

export default new StatistikService();
