import axios, { AxiosInstance } from 'axios';
import { env } from './utils/my-variables';

export function apiClient(cookie: string): AxiosInstance {
  return axios.create({
    baseURL: env.backendServer,
    headers: {
      'Content-Type': 'application/json',
      Authorization: cookie,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
