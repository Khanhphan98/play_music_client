<script setup lang="ts">
  import { env } from "@/utils/my-variables";
  import { computed, onMounted, reactive, ref } from "vue";
  import Lucide from "@/base-components/Lucide";
  import { SingerStore } from "@/stores/singer-store";
  import { ISinger } from "@/model/interface/ISinger";
  import ImageZoom from "@/base-components/ImageZoom/ImageZoom.vue";
  import { useRoute } from "vue-router";
  import { t } from "@/config/i18n";
  import router from "@/router";
  import { ISong } from "@/model/interface/ISong";
  import { IStatistik } from "@/model/interface/IStatistik";
  import LoadingIcon from "@/base-components/LoadingIcon/LoadingIcon.vue";

  const route = useRoute();
  const singerStore = SingerStore();
  const singers = computed(() => singerStore.singers as ISinger[]);
  const songsBySinger = computed(() => singerStore.songsBySinger);

  // value scope
  const singerInfo = computed(() => songsBySinger.value.singer as ISinger);
  const songs = computed(() => songsBySinger.value.songs as ISong[]);

  onMounted(() => {
    singerStore.recent();

    if (route.params && route.params.name) {
      singerStore.getSongsBySinger(String(route.params.name));
    }
  });
</script>

<template>
  <div class="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
    <div class="flex items-center justify-center flex-1 px-5 lg:justify-start">
      <div class="relative flex-none w-25 h-25 sm:w-30 sm:h-30 lg:w-36 lg:h-36 image-fit mt-5 ml-2">
        <ImageZoom :alt="singerInfo.name" :src="env.backendServer + singerInfo.avatar" class="rounded" />
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
        <span class="my-1"
          ><span class="font-medium">{{ t("birthday") }}:</span> {{ singerInfo.birthday }}</span
        >
        <span class="my-1"
          ><span class="font-medium">{{ t("address") }}:</span> {{ singerInfo.address }}</span
        >
        <span class="my-1"
          ><span class="font-medium">{{ t("description") }}:</span> {{ singerInfo.description }}</span
        >
      </div>
    </div>
  </div>
  <div class="grid grid-cols-12 mt-4 ml-2">
    <div class="col-span-12 mb-2">
      <h2 class="mr-5 text-xl font-medium">Bài hát nổi bật</h2>
    </div>
    <div v-for="(song, idx) in songs" :key="song.id" class="intro-x col-span-4 mr-2">
      <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
        <Lucide icon="Music" class="w-5 h-5 mr-4 text-slate-500" />
        <div class="flex-none w-10 h-10 overflow-hidden rounded-md image-fit">
          <img :alt="song.name" :src="env.backendServer + song.picture" />
        </div>
        <div class="ml-4 mr-auto">
          <div class="font-medium">{{ song.name }}</div>
          <div class="text-slate-500 text-xs mt-0.5">
            <span v-for="(singer, idx) in song.singers" :key="singer.name">
              {{ singer.name }}<span v-if="idx !== song.singers.length - 1">, </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
