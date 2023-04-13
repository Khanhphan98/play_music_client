<script setup lang="ts">
  import { FormInput, FormLabel } from "@/base-components/Form";
  import Button from "@/base-components/Button";
  import Lucide from "@/base-components/Lucide";
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  import HeadlessUiMenuDropdown from "@/base-components/iCustom/HeadlessUiMenuDropdown.vue";
  import HeadlessUiCombobox from "@/base-components/iCustom/HeadlessUiCombobox.vue";
  import { ref } from 'vue'
  const emit = defineEmits(['searchFilter']);
  const MenuDrop = ref(false);
  const searchKey = ref<string>('');

  const filterItem = ref<any>([
    {
      keyword: '',
      zIdx: 'z-[0]'
    }
  ]);

  function addFilter() {
    filterItem.value.push({
      keyword: ''
    })
  }
  function addToSearch() {
    const s = ref<string[]>([]);
    filterItem.value.forEach((_it: any) => {
      s.value.push(_it.keyword.name);
    });
    searchKey.value = s.value.join(';');
  }
</script>

<template>
  <div class="search-filter-ui-base">
    <div class="relative">
      <Button class="absolute left-0 border-none h-full text-slate-500 dark:hover:text-slate-400" @click.stop="this.$emit('searchFilter', searchKey)">
        <Lucide icon="Search" class="w-4 h-4"/>
      </Button>
      <FormInput v-model="searchKey" name="searchFilter" type="text" class="dark:border-slate-600 px-10" placeholder="Tìm kiếm..." @keyup.enter="this.$emit('searchFilter', searchKey)"/>
      <Menu as="div" class="absolute right-0 inline-block text-left h-full" v-slot="{ close }">
        <MenuButton
            class="py-2 px-3 text-slate-500 dark:hover:text-slate-400"
            @click="MenuDrop = !MenuDrop"
        >

          <Lucide icon="ChevronDown" class="h-5 w-5"/>
        </MenuButton>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems class="menu-item">
            <div class="pt-3 pb-2 px-3">
              <div class="filter-item mb-3" v-for="(list, idx) in filterItem" :key="idx">
                <div class="flex relative">
<!--                  <FormInput type="text" placeholder="Thêm trường lọc" :name="'key-'+idx" v-model="list.keyword"/>-->
                  <HeadlessUiCombobox v-model="list.keyword" @selected="(vl) => list.keyword = vl"/>
                  <div class="pl-3 shrink-0" v-if="idx > 0">
                    <Button class="h-full" variant="soft-danger" @click="filterItem.splice(idx, 1)">
                      <Lucide icon="X" class="w-4 h-4"/>
                    </Button>
                  </div>
                </div>
              </div>
              <Button class="add-filter" @click="addFilter()">
                <Lucide icon="Filter" class="w-4 h-4 mr-2"/>
                Thêm trường lọc
              </Button>
              <div class="text-right grid grid-cols-2 gap-3 mt-5 sticky -bottom-3.5 py-2 bg-white dark:bg-darkmode-400">
                <Button variant="secondary" @click="close()">
                  Bỏ qua
                </Button>
                <Button variant="primary" class="whitespace-nowrap" @click="addToSearch(); close()">
                  Thêm vào tìm kiếm
                </Button>
              </div>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>

<style lang="scss">
  .search-filter-ui-base {
    @apply inline-flex min-w-[13rem] relative;
    button {
      &.add-filter {
        @apply border-dashed border-slate-300 dark:border-darkmode-200 w-full mt-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:border-primary/50 dark:hover:text-primary;
      }
    }
    .menu-item {
      @apply absolute right-0 mt-2 min-w-[20rem] origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-darkmode-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none;
    }
  }
</style>