import { defineStore } from 'pinia';
import MediaService from '@/model/service/media-service';
import { IFileUpload } from '@/model/interface/IFileUpload';
import { ref } from 'vue';
import { ISong } from '@/model/interface/ISong';

export const MediaStore = defineStore('mediaStore', () => {
  const song = ref<ISong>({ name: '' } as ISong);

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

  function initSongStore (item: ISong) {
    song.value = item;
  }

  return {
    song,
    initSongStore,
    removeFileImage,
    removeFileMp3,
  };
});
