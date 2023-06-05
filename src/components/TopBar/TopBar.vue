<script setup lang="ts">
  import { ref } from "vue";
  import DarkModeSwitcher from "@/components/DarkModeSwitcher";
  import Breadcrumb from "../../base-components/Breadcrumb";
  import { FormSelect } from "../../base-components/Form";
  import { LocaleStore } from "@/stores/locale-store";
  import Lucide from "@/base-components/Lucide";
  import router from "@/router";

  const localeStore = LocaleStore();
  const languageMode = ref(localStorage.getItem("locale"));
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div class="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
    <!-- BEGIN: Breadcrumb -->
    <Breadcrumb class="hidden mr-auto -intro-x sm:flex">
      <Breadcrumb.Link to="/">Play music</Breadcrumb.Link>
      <Breadcrumb.Link to="/" :active="true"> Discovery</Breadcrumb.Link>
    </Breadcrumb>
    <!-- END: Breadcrumb -->
    <!--      BEGIN: Change Language-->
    <div class="text-right mr-5">
      <FormSelect v-model="languageMode" @change="localeStore.actionChangeLocale(languageMode || '')" name="language">
        <option value="vi">VI</option>
        <option value="en">EN</option>
      </FormSelect>
    </div>
    <!--      END: Change Language-->
    <!-- BEGIN: DarkMode, LightMode-->
    <DarkModeSwitcher class="mr-5 h-5 w-5" />
    <!-- END: DarkMode, LightMode-->
    <button class="btn btn-primary" @click="router.push('/admin')">
      <Lucide icon="User" class="w-5 h-5 z-50 text-white" />
    </button>
  </div>
  <!-- END: Top Bar -->
</template>
