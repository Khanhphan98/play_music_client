import { defineStore } from 'pinia';
import MediaService from '@/model/service/media-service';
import { IFileUpload } from '@/model/interface/IFileUpload';
import { computed, ref } from 'vue';
import { ISong } from '@/model/interface/ISong';
import { SongStore } from '@/stores/song-store';
import SongService from '@/model/service/song-service';
import { IStatistik } from '@/model/interface/IStatistik';
import { StatistikStore } from '@/stores/statistik-store';

export const MediaStore = defineStore('mediaStore', () => {
  const songStore = SongStore();
  const statistikStore = StatistikStore();
  const song = ref<ISong>({ name: '' } as ISong);
  const songs = computed(() => songStore.songs as ISong[]);

  async function removeFileImage(filename: string) {
    // init value file in directory image
    const fileRemove = { path: 'image/' + filename } as IFileUpload;
    // call request
    await MediaService.delete(fileRemove);
  }

  async function removeFileMp3(filename: string) {
    // init value file in directory image
    const fileRemove = { path: 'songs/' + filename } as IFileUpload;
    // call request
    await MediaService.delete(fileRemove);
  }

  async function initSongStore (item: ISong) {
    // init value
    const request = { id: item.id } as ISong;
    // call request
    const response = await SongService.recent(request);
    if (response.data) {
      song.value = response.data.data[0] as ISong;
      // init request statistij
      const statistik  = song.value.statistik as IStatistik;
      // call request
      await statistikStore.actionIncreaseViewStatistikSong(statistik);
    }
  }

  function actionNextSong() {
    const index = songs.value.indexOf(song.value);
    song.value = songs.value[index + 1] || songs.value[0];
  }

  function actionPrevSong() {
    const index = songs.value.indexOf(song.value);
    song.value = songs.value[index - 1] || songs.value[songs.value.length - 1];
  }

  return {
    song,
    initSongStore,
    removeFileImage,
    removeFileMp3,
    actionNextSong,
    actionPrevSong
  };
});
