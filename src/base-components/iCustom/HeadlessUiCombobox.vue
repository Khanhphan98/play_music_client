<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    TransitionRoot,
  } from '@headlessui/vue';
  import Lucide from '@/base-components/Lucide';

  const props = defineProps({
    modalValue: {
      type: String
    }
  });
  const emits = defineEmits(['selected']);

  const people = [
    {
      id: 0,
      name: 'Select User',
    },
    { id: 1, name: 'Wade Cooper' },
    { id: 2, name: 'Arlene Mccoy' },
    { id: 3, name: 'Devon Webb' },
    { id: 4, name: 'Tom Cook' },
    { id: 5, name: 'Tanya Fox' },
    { id: 6, name: 'Hellen Schmidt' },
  ];

  const selected = computed({
    get: () => props.modalValue,
    set: (_vl) => emits('selected', _vl)
  });
  const query = ref('');

  const filteredPeople = computed(() =>
    query.value === ''
      ? people
      : people.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.value.toLowerCase().replace(/\s+/g, '')),
        ),
  );
</script>

<template>
  <div class="w-full">
    <Combobox v-model="selected">
      <div class="relative">
        <div class="combobox-input-button">
          <ComboboxInput
              class="cb-input"
            :displayValue="(person) => person.name"
            @change="this.$emit('selected', $event.target.value)" />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <Lucide icon="ChevronsUpDown" class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''">
          <ComboboxOptions class="combobox-options">
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700">
              Nothing found.
            </div>

            <ComboboxOption
              v-for="person in filteredPeople"
              as="template"
              :key="person.id"
              :value="person"
              v-slot="{ selected, active }">
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{'bg-primary text-white': active, 'text-gray-900 dark:text-slate-300': !active,}"
              >
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ person.name }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-primary': !active }">
                  <Lucide icon="Check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<style lang="scss">
  .combobox {
    &-options {
       @apply absolute z-10 mt-1 max-h-60 w-full min-w-[15rem] right-0 overflow-auto rounded-md bg-white dark:bg-darkmode-200 py-1 text-base shadow-lg;
     }
  }
  .combobox-input-button {
    .cb-input {
      @apply w-full py-2.5 pl-3 pr-10 text-sm leading-5 text-gray-900 border-slate-200 focus:border-primary/70 rounded-md dark:bg-darkmode-800 dark:text-slate-300 dark:border-slate-600 focus:ring-4 focus:ring-primary/30 dark:focus:border-primary/70;
    }
  }
</style>