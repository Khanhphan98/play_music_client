import { defineStore } from 'pinia';
import { handleExceptionError, removeDiacritics } from '@/utils/my-function';
import { ref } from 'vue';
import { ISinger } from '@/model/interface/ISinger';
import SingerService from '@/model/service/singer-service';
import { MyStore } from '@/stores/my-store';
import { StatistikStore } from '@/stores/statistik-store';
import { IStatistik } from '@/model/interface/IStatistik';
import router from '@/router';

export const SingerStore = defineStore('singerStore', () => {
  const myStore = MyStore();
  const statistikStore = StatistikStore();
  const singers = ref<ISinger[]>([]);
  const singerSeleted = ref<ISinger>();
  const singerInfo = ref<ISinger>();

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
    // init statistik before when create singer
    const statistik = await statistikStore.actionSaveStatistikSinger() as IStatistik;
    // init value
    const request = {
      name: singer.name,
      birthday: singer.birthday,
      address: singer.address,
      description: singer.description,
      avatar: singer.avatar,
      professions: singer.professions,
      statistik: Number(statistik.id)
    } as ISinger;
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
    // show toasti
    myStore.showToastMessage();
  }

  async function search(singer: ISinger) {
    // init value
    const request = { id: singer.id } as ISinger;
    // call request
    return await SingerService.search(request);
  }

  async function recent() {
    try {
      // init value
      const request = { id: "" } as ISinger;
      // call request
      const response = await SingerService.recent(request);
      if (response.data) {
        singers.value = response.data.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function searchInfoSinger (singer_id: string) {
    // init value
    const request = { id: singer_id } as ISinger;
    // call request
    const response = await SingerService.recent(request);
    if (response.data) {
      singerInfo.value = response.data.data[0] as ISinger;
      // init request statistik
      const statistik  = singerInfo.value.statistik as IStatistik;
      // call request
      await statistikStore.actionIncreaseViewStatistikSinger(statistik);
      // redirect
      await router.push('/singer/' + singer_id);
    }
  }




  return {
    singers,
    singerInfo,
    singerSeleted,
    list,
    save,
    update,
    remove,
    search,
    recent,
    searchInfoSinger
  };
});
