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
  const repeatType = ref(0);

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

  async function actionUpToView (item: ISong) {
    // init value
    const request = { id: item.id } as ISong;
    // call request
    const response = await SongService.recent(request);
    if (response.data) {
      const song_up_view = response.data.data[0] as ISong;
      // init request statistij
      const statistik  = song_up_view.statistik as IStatistik;
      // call request
      await statistikStore.actionIncreaseViewStatistikSong(statistik);
    }
  }

  async function actionNextSong() {
    const index = songs.value.findIndex(s => s.id === song.value.id);
    song.value = songs.value[index + 1] || songs.value[0];
    await actionUpToView(song.value);
  }

  async function actionPrevSong() {
    const index = songs.value.findIndex(s => s.id === song.value.id);
    song.value = songs.value[index - 1] || songs.value[songs.value.length - 1];
    await actionUpToView(song.value);
  }

  function actionRepeatSong() {
    repeatType.value = (repeatType.value + 1) % 3;
  }

  async function actionNextSongByRepeat () {
    const index = songs.value.findIndex(s => s.id === song.value.id);
    // Nếu lặp lại một lần và chạy hết bai hát cuoi cung thì sẽ tạm dừng
    if (repeatType.value === 2 && !songs.value[index + 1]) {
      return;
    }
    song.value = songs.value[index + 1] || songs.value[0];
    await actionUpToView(song.value);
  }

  return {
    song,
    repeatType,
    initSongStore,
    removeFileImage,
    removeFileMp3,
    actionNextSong,
    actionPrevSong,
    actionRepeatSong,
    actionNextSongByRepeat
  };
});
