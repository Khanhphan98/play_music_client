import { defineStore } from "pinia";
import { handleExceptionError } from "@/utils/my-function";
import { ref } from "vue";
import { ISong } from "@/model/interface/ISong";
import SongService from "@/model/service/song-service";
import { MyStore } from "@/stores/my-store";
import { IStatistik } from "@/model/interface/IStatistik";
import { StatistikStore } from "@/stores/statistik-store";

export const SongStore = defineStore("songStore", () => {
  const songs = ref<ISong[]>([]);
  const myStore = MyStore();
  const statistikStore = StatistikStore();
  const currentTrack = null;
  const trackTime = ref<string>("0:00");
  const lyricsPosition = ref<string>("0:00");

  async function list() {
    try {
      // call request
      const response = await SongService.list();
      if (response.data) {
        songs.value = response.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function save(song: ISong) {
    // init statistik before when create singer
    const statistik = (await statistikStore.actionSaveStatistikSong()) as IStatistik;
    // init value
    const request = {
      name: song.name,
      release: song.release,
      time: song.time,
      lyric: song.lyric,
      description: song.description,
      file_mp3: song.file_mp3,
      picture: song.picture,
      categories: song.categories,
      countries: song.countries,
      singers: song.singers,
      statistik: Number(statistik.id),
    } as ISong;
    // call request
    await SongService.save(request);
    // show toasti
    myStore.showToastMessage();
  }

  async function update(song: ISong) {
    // init value
    const request = {
      id: song.id,
      name: song.name,
      release: song.release,
      time: song.time,
      lyric: song.lyric,
      description: song.description,
      file_mp3: song.file_mp3,
      picture: song.picture,
      categories: song.categories,
      countries: song.countries,
      singers: song.singers,
    } as ISong;
    // call request
    await SongService.update(request);
    // show toasti
    myStore.showToastMessage();
  }

  async function remove(song: ISong) {
    // init value
    const request = { id: song.id } as ISong;
    // call request
    await SongService.remove(request);
    // show toasti
    myStore.showToastMessage();
  }

  async function search(song: ISong) {
    // init value
    const request = { id: song.id } as ISong;
    // call request
    return await SongService.search(request);
  }

  async function recent() {
    // call request
    try {
      // init value
      const request = { id: "" } as ISong;
      // call request
      const response = await SongService.recent(request);
      if (response.data) {
        songs.value = response.data.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function searchByCountry(ids: string[]) {
    // call request
    try {
      // init value
      const request = { country_ids: ids };
      // call request
      if (ids.length > 1) {
        const response = await SongService.search_by_exclude_country(request);
        if (response.data) {
          songs.value = response.data.data;
        }
      } else {
        const response = await SongService.search_by_country(request);
        if (response.data) {
          songs.value = response.data.data;
        }
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  function actionUpdateSongs(new_songs: ISong[]) {
    songs.value = new_songs;
  }

  return {
    songs,
    trackTime,
    currentTrack,
    lyricsPosition,
    list,
    save,
    update,
    remove,
    search,
    recent,
    searchByCountry,
    actionUpdateSongs,
  };
});
