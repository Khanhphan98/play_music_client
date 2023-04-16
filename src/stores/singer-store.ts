import { defineStore } from 'pinia';
import { handleExceptionError } from '@/utils/my-function';
import { ref } from 'vue';
import { ISinger } from '@/model/interface/ISinger';
import SingerService from '@/model/service/singer-service';
import { MyStore } from '@/stores/my-store';
import MediaService from '@/model/service/media-service';
import { IFileUpload } from '@/model/interface/IFileUpload';

export const SingerStore = defineStore('singerStore', () => {
  const myStore = MyStore()
  const singers = ref<ISinger[]>([]);
  const singerSeleted = ref<ISinger>();

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
    // show toasti
    myStore.showToastMessage();
  }

  async function update(singer: ISinger) {
    // init value
    const request = { id: singer.id, name: singer.name, birthday: singer.birthday, address: singer.address, description: singer.description, avatar: singer.avatar, professions: singer.professions } as ISinger;
    // call request
    await SingerService.update(request);
    // show toasti
    myStore.showToastMessage();
  }

  async function remove(singer: ISinger) {
    // init value
    const request = { id: singer.id } as ISinger;
    // call request
    await SingerService.remove(request);
  }

  async function search(singer: ISinger) {
    // init value
    const request = { id: singer.id } as ISinger;
    // call request
    return await SingerService.search(request);
  }

  async function removeFileUpload(filename: string) {
    // init value file in directory image
    const fileRemove = { path: 'image/' + filename } as IFileUpload;
    // call request
    await MediaService.delete(fileRemove);
  }

  function setSingerStore (singer: ISinger) {
    if (singer) {
      singerSeleted.value = singer;
    }
  }


  return {
    singers,
    singerSeleted,
    list,
    save,
    update,
    remove,
    search,
    setSingerStore,
    removeFileUpload
  };
});
