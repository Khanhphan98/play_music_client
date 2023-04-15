import { apiMultipart } from '@/http-common';

class MediaService {
  upload(token: string, formData: FormData): Promise<any> {
    return apiMultipart(token).post('/api/upload_file/', formData);
  }
}

export default new MediaService();
