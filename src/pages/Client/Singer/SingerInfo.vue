<script setup lang='ts'>
  import { env } from '@/utils/my-variables';
  import { formatDate } from '@/utils/helper';
  import { toHHMMSS } from '@/utils/my-function';
  import { computed, onMounted } from 'vue';
  import Lucide from '@/base-components/Lucide';
  import { SingerStore } from '@/stores/singer-store';
  import { ISinger } from '@/model/interface/ISinger';
  import fakerData from '@/utils/faker';
  import _ from 'lodash';
  import ImageZoom from '@/base-components/ImageZoom/ImageZoom.vue';
  import router from '@/router';
  import { useRoute } from 'vue-router';
  const route = useRoute();

  const singerStore = SingerStore();
  const singers = computed(() => singerStore.singers as ISinger[]);
  const singerInfo = computed(() => singerStore.singerInfo as ISinger);
  console.log(singerInfo.value);

  // value scope

  onMounted(() => {
    singerStore.recent();
  })
</script>

<template>
  <div class="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
    <div class="flex items-center justify-center flex-1 px-5 lg:justify-start">
      <div class="relative flex-none w-25 h-25 sm:w-30 sm:h-30 lg:w-36 lg:h-36 image-fit mt-5 ml-2">
        <ImageZoom :alt="singerInfo.name" :src="env.backendServer + singerInfo.avatar" class='rounded' />
        <div class="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
          <Lucide icon="Camera" class="w-4 h-4 text-white" />
        </div>
      </div>
      <div class="ml-5">
        <div class="text-6xl font-serif">
          {{ singerInfo.name }}
          <Lucide icon="HeartHandshake" class="w-4 h-4 text-violet-600 -mt-1 ml-1" />
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
    <div class="flex items-center justify-center flex-1 px-5 py-5 lg:justify-start">
      <div class="grid text-base ml-2">
        <span class='my-1'><span class='font-medium'>Ngày sinh:</span> {{ singerInfo.birthday }}</span>
        <span class='my-1'><span class='font-medium'>Địa chỉ:</span> {{ singerInfo.address }}</span>
        <span class='my-1'><span class='font-medium'>Mô tả:</span> {{ singerInfo.description }}</span>
      </div>
    </div>
  </div>
</template>
