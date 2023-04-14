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

  async function update(profession: IProfession) {
    // init value
    const request = { id: profession.id, name: profession.name } as IProfession;
    // call request
    await professionService.update(request);
  }

  async function remove(profession: IProfession) {
    // init value
    const request = { id: profession.id } as IProfession;
    // call request
    await professionService.remove(request);
  }



  return {
    professions,
    list,
    save,
    update,
    remove
  };
});
