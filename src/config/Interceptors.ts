import axios from 'axios';
import { env } from '@/utils/my-variables';
import { IDataResponse } from '@/model/interface/IDataResponse';
import { handleExceptionError } from '@/utils/my-function';
const axiosInstance = axios.create({
  baseURL: env.backendServer,
  timeout: 20000,
});
let isRefreshing = false;
let refreshSubscribers: any = [];

function onRefreshed(token: any) {
  refreshSubscribers.map((callback: any) => callback(token));
  refreshSubscribers = [];
}
// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  // Add authorization header to the request
  config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  return config;
});
// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for access token refresh
        return new Promise((resolve) => {
          refreshSubscribers.push((token: any) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${env.backendServer}/api/user/access_token`, {
          refresh_token: localStorage.getItem('refreshToken'),
        });
        const responseData = response.data as IDataResponse;
        const { access_token } = responseData.data;
        localStorage.setItem('accessToken', access_token);
        onRefreshed(access_token);

        return axiosInstance(originalRequest);
      } catch (error) {
        // Refresh token has expired or invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        location.reload();
      } finally {
        isRefreshing = false;
      }
    } else {
      handleExceptionError(error);
    }

    return Promise.reject(error);
  },
);
export default axiosInstance;
