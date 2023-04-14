import { apiClient } from '@/http-common';
import { IProfession } from '@/model/interface/IProfession';

class ProfessionService {
  list(token: string): Promise<any> {
    return apiClient(token).get('/api/profession/');
  }

  save(token: string, profession: IProfession): Promise<any> {
    return apiClient(token).post('/api/profession/', profession);
  }
}

export default new ProfessionService();
