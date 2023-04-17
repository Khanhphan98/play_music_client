import { defineStore } from 'pinia';
import { handleExceptionError } from '@/utils/my-function';
import { ref } from 'vue';
import { ISong } from '@/model/interface/ISong';
import SongService from '@/model/service/song-service';

export const SongStore = defineStore('songStore', () => {
  const songs = ref<ISong[]>([]);

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
    // init value
    const request = { id: song.id, name: song.name, release: song.release, time: song.time, lyric: song.lyric, description: song.description,
      file_mp3: song.file_mp3, picture: song.picture, categories: song.categories, countries: song.countries, singers: song.singers,
    } as ISong;
    // call request
    await SongService.save(request);
  }

  async function update(song: ISong) {
    // init value
    const request = { id: song.id, name: song.name } as ISong;
    // call request
    await SongService.update(request);
  }

  async function remove(song: ISong) {
    // init value
    const request = { id: song.id } as ISong;
    // call request
    await SongService.remove(request);
  }



  return {
    songs,
    list,
    save,
    update,
    remove
  };
});
