import { defineStore } from 'pinia';
import { handleExceptionError } from '@/utils/my-function';
import { ref } from 'vue';
import CountryService from '@/model/service/country-service';
import { ICountry } from '@/model/interface/ICountry';

export const CountryStore = defineStore('countryStore', () => {
  const countries = ref<ICountry[]>([]);

  async function list() {
    try {
      // call request
      const response = await CountryService.list();
      if (response.data) {
        countries.value = response.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function save(country: ICountry) {
    // init value
    const request = { name: country.name } as ICountry;
    // call request
    await CountryService.save(request);
  }

  async function update(country: ICountry) {
    // init value
    const request = { id: country.id, name: country.name } as ICountry;
    // call request
    await CountryService.update(request);
  }

  async function remove(country: ICountry) {
    // init value
    const request = { id: country.id } as ICountry;
    // call request
    await CountryService.remove(request);
  }



  return {
    countries,
    list,
    save,
    update,
    remove
  };
});
