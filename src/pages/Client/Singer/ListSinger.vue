<script setup lang='ts'>
  import { env } from '@/utils/my-variables';
  import { formatDate } from '@/utils/helper';
  import { toHHMMSS } from '@/utils/my-function';
  import { computed, onMounted } from 'vue';
  import Lucide from '@/base-components/Lucide';
  import { SingerStore } from '@/stores/singer-store';
  import { ISinger } from '@/model/interface/ISinger';

  const singerStore = SingerStore();
  const singers = computed(() => singerStore.singers as ISinger[]);

  // value scope

  onMounted(() => {
    singerStore.recent();
  })
</script>

<template>
  <div :class="[
      'z-40 grid gap-6 -mb-10 -mx-[16px] md:-mx-[22px] relative px-[22px] min-h-[400px] xl:-mt-5 2xl:-mt-8 2xl:z-10',
      'before:content-[\'\'] before:rounded-t-[30px] xl:before:rounded-t-[30px] before:rounded-b-[30px] xl:before:shadow-[0px_3px_20px_#0000000b] before:w-full before:h-full before:bg-slate-100 before:absolute before:top-0 before:left-0 before:right-0 before:dark:bg-darkmode-700',
    ]"
  >
    <div class="relative z-10 col-span-12 2xl:col-span-3">
      <div class="pb-10 intro-y">
        <div class="grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Recent Activities -->
          <!-- END: Recent Activities -->
          <div class="col-span-12 mt-3 md:col-span-12 xl:col-span-12 2xl:col-span-12 2xl:mt-12">
            <div class="flex items-center h-10 mt-6">
              <h2 class="mr-5 text-3xl font-medium">Bảng xếp hạng #PM</h2>
            </div>
            <div class="mt-5">
              <div v-for='(singer, idx) in singers' :key='singer.id' class="intro-x">
                <div class="flex items-center px-5 py-3 mb-3 zoom-in border-2 rounded-md">
                  <div class='text-3xl font-bold border-white' :class="{
                    'text-blue-500' : idx === 0,
                    'text-red-500' : idx === 1,
                    'text-yellow-500' : idx === 2,
                  }">
                    {{ idx + 1 }}
                  </div>
                  <div class='text-3xl opacity-30 mx-4'>
                    -
                  </div>
                  <div class="flex-none w-10 h-10 overflow-hidden rounded-md image-fit relative">
                    <img :alt="singer.name" :src="env.backendServer + singer.avatar" class='z-0' />
                    <Lucide icon="Play" class="w-4 h-4 z-50 text-white absolute" />
                  </div>
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">{{ singer.name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ formatDate(singer.birthday, 'DD/MM/YYYY') }}
                    </div>
                  </div>
                  <div class='text-slate-500 mr-5'>
                    {{ singer.description.slice(0,50) }}
                  </div>
                  <div class="text-slate-500">
                    {{ toHHMMSS(String(singer.name)) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
