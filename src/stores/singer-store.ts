import { defineStore } from 'pinia';
import { handleExceptionError } from '@/utils/my-function';
import { ref } from 'vue';
import { ISinger } from '@/model/interface/ISinger';
import SingerService from '@/model/service/singer-service';

export const SingerStore = defineStore('singerStore', () => {
  const singers = ref<ISinger[]>([]);

  async function list() {
    try {
      // call request
      const response = await SingerService.list();
      if (response.data) {
        singers.value = response.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function save(singer: ISinger) {
    // init value
    const request = { name: singer.name, birthday: singer.birthday, address: singer.address, description: singer.description, avatar: singer.avatar, professions: singer.professions } as ISinger;
    // call request
    await SingerService.save(request);
  }

  async function update(singer: ISinger) {
    // init value
    const request = { id: singer.id, name: singer.name } as ISinger;
    // call request
    await SingerService.update(request);
  }

  async function remove(singer: ISinger) {
    // init value
    const request = { id: singer.id } as ISinger;
    // call request
    await SingerService.remove(request);
  }


  return {
    singers,
    list,
    save,
    update,
    remove
  };
});
