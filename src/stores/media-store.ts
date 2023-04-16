import { defineStore } from 'pinia';
import MediaService from '@/model/service/media-service';
import { IFileUpload } from '@/model/interface/IFileUpload';

export const MediaStore = defineStore('mediaStore', () => {

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

  return {
    removeFileImage,
    removeFileMp3
  };
});
