import { defineStore } from 'pinia';
import { IUser } from '@/model/interface/IUser';
import userService from '@/model/service/user-service';

export const UserStore = defineStore('userStore', () => {
  async function login(request: IUser) {
    const response = await userService.login(request);
    if (response) {
      console.log(response);
    }
  }

  return {
    login,
  };
});
