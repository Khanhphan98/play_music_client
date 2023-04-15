import axios, { AxiosInstance } from 'axios';
import { env } from './utils/my-variables';

export function apiClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: env.backendServer,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}


export function apiMultipart(token: string): AxiosInstance {
  return axios.create({
    baseURL: env.backendServer,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
  });
}
