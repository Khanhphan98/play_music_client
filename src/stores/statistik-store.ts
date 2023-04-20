import { defineStore } from 'pinia';
import { IStatistik } from '@/model/interface/IStatistik';
import StatistikService from '@/model/service/statistik-service';

export const StatistikStore = defineStore('statistikStore', () => {

  async function actionSaveStatistikSinger() {
    // init value
    const request = { singer_play_count: 0 } as IStatistik;
    // call request
    const response = await StatistikService.save(request);
    if (response.data) {
      return response.data as IStatistik;
    }
  }

  async function actionSaveStatistikSong() {
    // init value
    const request = { song_play_count: 0 } as IStatistik;
    // call request
    const response = await StatistikService.save(request);
    if (response.data) {
      return response.data as IStatistik;
    }
  }

  async function actionIncreaseViewStatistikSinger(statistik: IStatistik) {
    // init value
    const request = { id: statistik.id, singer_play_count: statistik.singer_play_count + 1 } as IStatistik;
    // call request
    await StatistikService.update(request);
  }

  async function actionIncreaseViewStatistikSong(statistik: IStatistik) {
    // init value
    const request = { id: statistik.id, song_play_count: statistik.song_play_count + 1 } as IStatistik;
    // call request
    await StatistikService.update(request);
  }


  return {
    actionSaveStatistikSinger,
    actionSaveStatistikSong,
    actionIncreaseViewStatistikSong,
    actionIncreaseViewStatistikSinger
  };
});
