import { defineStore } from 'pinia';
import { handleExceptionError } from '@/utils/my-function';
import professionService from '@/model/service/profession-service';
import { ref } from 'vue';
import { IProfession } from '@/model/interface/IProfession';

export const ProfessionStore = defineStore('professionStore', () => {
  const professions = ref<IProfession[]>([]);

  async function list() {
    try {
      // call request
      const response = await professionService.list();
      if (response.data) {
        professions.value = response.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function save(profession: IProfession) {
    // init value
    const request = { name: profession.name } as IProfession;
    // call request
    await professionService.save(request);
  }



  return {
    professions,
    list,
    save
  };
});
