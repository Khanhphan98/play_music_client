import { apiMultipart } from '@/http-common';
import axiosInstance from '@/config/Interceptors';
import { IFileUpload } from '@/model/interface/IFileUpload';

class MediaService {
  upload(token: string, formData: FormData): Promise<any> {
    return apiMultipart(token).post('/api/upload_file/', formData);
  }

  delete(file: IFileUpload): Promise<any> {
    return axiosInstance.post('/api/delete_file/', file);
  }
}

export default new MediaService();
