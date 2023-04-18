<script setup lang="ts">
  import { ref } from 'vue';
  import DarkModeSwitcher from '@/components/DarkModeSwitcher';
  import Lucide from '../../base-components/Lucide';
  import Breadcrumb from '../../base-components/Breadcrumb';
  import { FormInput } from '../../base-components/Form';
  import { Menu, Popover } from '../../base-components/Headless';
  import fakerData from '../../utils/faker';
  import _ from 'lodash';
  import { TransitionRoot } from '@headlessui/vue';

  const searchDropdown = ref(false);
  const showSearchDropdown = () => {
    searchDropdown.value = true;
  };
  const hideSearchDropdown = () => {
    searchDropdown.value = false;
  };
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div class="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
    <!-- BEGIN: Breadcrumb -->
    <Breadcrumb class="hidden mr-auto -intro-x sm:flex">
      <Breadcrumb.Link to="/">Play music</Breadcrumb.Link>
      <Breadcrumb.Link to="/" :active="true"> Discovery </Breadcrumb.Link>
    </Breadcrumb>
    <!-- END: Breadcrumb -->
    <!-- BEGIN: DarkMode, LightMode-->
    <DarkModeSwitcher class="mr-5 h-5 w-5" />
    <!-- END: DarkMode, LightMode-->
  </div>
  <!-- END: Top Bar -->
</template>
