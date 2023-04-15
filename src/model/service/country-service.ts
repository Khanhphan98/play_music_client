import { ICountry } from '@/model/interface/ICountry';
import axiosInstance from '@/config/Interceptors';

class CountryService {
  list(): Promise<any> {
    return axiosInstance.get('/api/country/');
  }

  save(country: ICountry): Promise<any> {
    return axiosInstance.post('/api/country/', country);
  }

  update(country: ICountry): Promise<any> {
    return axiosInstance.put(`/api/country/${country.id}/`, country);
  }

  remove(country: ICountry): Promise<any> {
    return axiosInstance.delete(`/api/country/${country.id}/`);
  }
}

export default new CountryService();
