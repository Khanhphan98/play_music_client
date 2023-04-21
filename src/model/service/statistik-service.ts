import { IStatistik } from '@/model/interface/IStatistik';
import { apiClientNotAuthorization } from '@/http-common';

class StatistikService {
  save(statistik: IStatistik): Promise<any> {
    return apiClientNotAuthorization().post('/api/statistik/', statistik);
  }

  update(statistik: IStatistik): Promise<any> {
    return apiClientNotAuthorization().put(`/api/statistik/${statistik.id}/`, statistik);
  }

}

export default new StatistikService();
