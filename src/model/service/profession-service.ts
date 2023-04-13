import { apiClient } from '@/http-common';
import { IProfession } from '@/model/interface/IProfession';

class ProfessionService {
  list(token: string): Promise<any> {
    return apiClient(token).get('/api/profession');
  }
}

export default new ProfessionService();
