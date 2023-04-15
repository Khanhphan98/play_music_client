import { ICategory } from '@/model/interface/ICategory';
import axiosInstance from '@/config/Interceptors';

class CategoryService {
  list(): Promise<any> {
    return axiosInstance.get('/api/category/');
  }

  save(category: ICategory): Promise<any> {
    return axiosInstance.post('/api/category/', category);
  }

  update(category: ICategory): Promise<any> {
    return axiosInstance.put(`/api/category/${category.id}/`, category);
  }

  remove(category: ICategory): Promise<any> {
    return axiosInstance.delete(`/api/category/${category.id}/`);
  }
}

export default new CategoryService();
