<script setup lang="ts">
  import DarkModeSwitcher from '../components/DarkModeSwitcher';
  import MainColorSwitcher from '../components/MainColorSwitcher';
  import errorIllustration from '../assets/images/error-illustration.svg';
  import Button from '../base-components/Button';
  import Lucide from '@/base-components/Lucide';
</script>

<template>
  <div class="py-2">
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div
        class="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
        <div class="-intro-x lg:mr-20">
          <img
            alt="Midone Tailwind HTML Admin Template"
            class="w-[450px] h-48 lg:h-auto"
            :src="errorIllustration" />
        </div>
        <div class="mt-10 text-white lg:mt-0">
          <div class="font-medium intro-x text-8xl">404</div>
          <div class="mt-5 text-xl font-medium intro-x lg:text-3xl">Oops. This page has gone missing.</div>
          <div class="mt-3 text-lg intro-x">
            You may have mistyped the address or the page may have moved.
          </div>
          <RouterLink
            to="/"
            class="px-4 py-3 mt-5 bg-white/30 hover:bg-white/40 rounded-md text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200 inline-flex items-center">
            <Lucide icon="Home" class="h-5 w-5 mr-3" /> Back to Home
          </RouterLink>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>
