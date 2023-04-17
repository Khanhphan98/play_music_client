import { defineStore } from 'pinia';
import { handleExceptionError } from '@/utils/my-function';
import { ref } from 'vue';
import { ICategory } from '@/model/interface/ICategory';
import categoryService from '@/model/service/category-service';

export const CategoryStore = defineStore('categoryStore', () => {
  const categories = ref<ICategory[]>([]);

  async function list() {
    try {
      // call request
      const response = await categoryService.list();
      if (response.data) {
        categories.value = response.data;
      }
    } catch (e) {
      handleExceptionError(e);
    }
  }

  async function save(category: ICategory) {
    // init value
    const request = { name: category.name } as ICategory;
    // call request
    await categoryService.save(request);
  }

  async function update(category: ICategory) {
    // init value
    const request = { id: category.id, name: category.name } as ICategory;
    // call request
    await categoryService.update(request);
  }

  async function remove(category: ICategory) {
    // init value
    const request = { id: category.id } as ICategory;
    // call request
    await categoryService.remove(request);
  }

  return {
    categories,
    list,
    save,
    update,
    remove
  };
});
