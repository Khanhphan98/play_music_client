<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { SongStore } from "@/stores/song-store";
  import { ISong } from "@/model/interface/ISong";
  import { env } from "@/utils/my-variables";
  import { t } from "@/config/i18n";
  import FileIcon from "@/base-components/FileIcon/FileIcon.vue";
  import { toHHMMSS } from "@/utils/my-function";
  import { SingerStore } from "@/stores/singer-store";
  import { ISinger } from "@/model/interface/ISinger";
  import Lucide from "@/base-components/Lucide/Lucide.vue";
  import { formatDate } from "@/utils/helper";
  import LoadingIcon from "@/base-components/LoadingIcon/LoadingIcon.vue";
  import { MediaStore } from "@/stores/media-store";
  import { IStatistik } from "@/model/interface/IStatistik";
  import router from "@/router";

  const songStore = SongStore();
  const songsRecent = computed(() => {
    return [...songStore.songs]
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      .slice(0, 5) as ISong[]; // Sắp xếp bản sao
  });
  const songsBanner = computed(() => songStore.songs.slice(0, 4) as ISong[]);
  const songsTopView = computed(() => {
    return songStore.songs
      .sort((a: any, b: any) => {
        return b.statistik.song_play_count - a.statistik.song_play_count;
      })
      .slice(0, 5);
  });

  const singerStore = SingerStore();
  const singers = computed(() => singerStore.singers.slice(0, 5) as ISinger[]);

  const mediaStore = MediaStore();
  const SongPlay = computed(() => mediaStore.song);

  // value scope
  const countriesMusic = ref([
    { name: "Việt Nam", class: "bg-vn" },
    { name: "US-UK", class: "bg-us" },
    { name: "Kpop", class: "bg-kpop" },
  ]);

  const showRecent = ref();

  function renderView(statistik: IStatistik) {
    return statistik.song_play_count;
  }

  onMounted(() => {
    songStore.recent();
    singerStore.recent();
  });
</script>

<template>
  <div
    class="max-w-full md:max-w-none rounded-[30px] md:rounded-none min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-2 pb-10 md:mt-1 relative dark:bg-darkmode-700 before:content-[''] before:w-full before:h-px before:block my-10">
    <div class="grid grid-cols-12 gap-6 mt-2 intro-y">
      <div class="col-span-12">
        <div class="flex items-center intro-x">
          <h2 class="text-lg font-medium truncate">{{ t("release") }}</h2>
        </div>
      </div>
      <div
        v-for="(song, idx) in songsBanner"
        :key="song.id"
        @mouseover="showRecent = idx"
        @mouseleave="showRecent = ''"
        class="col-span-6 intro-y sm:col-span-3 md:col-span-3 2xl:col-span-3">
        <div class="relative rounded">
          <div class="relative">
            <FileIcon class="w-full mx-auto rounded" variant="image" :src="env.backendServer + song.picture" />
            <div
              v-show="showRecent === idx || song.id === SongPlay.id"
              class="absolute rounded w-full h-full bg-black/50 top-0 flex justify-center align-center duration-500">
              <button
                class="btn btn-primary opacity-40 relative w-25 h-25 p-24"
                @click="mediaStore.initSongStore(song)">
                <LoadingIcon v-show="song.id === SongPlay.id" icon="audio" />
                <Lucide v-show="song.id !== SongPlay.id" icon="Play" class="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
          <div class="text-xl text-slate-500 text-center mt-0.5 sm:text-lg">
            {{ song.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-12 my-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 intro-y sm:gap-4" @click="router.push('/song')">
        <div
          v-for="music_c in countriesMusic"
          :key="music_c.name"
          class="before:block before:absolute before:w-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black/90 before:to-black/10 image-fit">
          <div class="relative bg-cover rounded" :class="music_c.class">
            <div class="z-10 h-[150px] w-full px-10 py-6 bg-black/70 rounded">
              <a href="#" class="grid text-center font-medium">
                <span class="rounded px-5 py-2 grid">
                  <span class="text-xl">{{ music_c.name }}</span>
                  <span class="text-violet-400">#Play music</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-12 my-10">
      <div class="grid grid-cols-12 gap-6 mt-2 intro-y">
        <!-- BEGIN: Song -->
        <div class="col-span-12 intro-y sm:col-span-4 md:col-span-4 2xl:col-span-4">
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">Top</h2>
          </div>
          <div class="mt-5">
            <div
              v-for="(song, idx) in songsTopView"
              @mouseover="showRecent = idx"
              @mouseleave="showRecent = ''"
              :key="song.id"
              class="intro-x"
              @click="mediaStore.initSongStore(song)">
              <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                <Lucide icon="Music" class="w-5 h-5 mr-4 text-slate-500" />
                <div class="flex-none w-10 h-10 overflow-hidden rounded-md image-fit">
                  <img :alt="song.name" :src="env.backendServer + song.picture" />
                  <div
                    v-show="showRecent === idx || song.id === SongPlay.id"
                    class="absolute flex inset-x-0 bg-black/80 w-full h-full justify-center align-center">
                    <button class="btn btn-primary" v-show="song.id !== SongPlay.id">
                      <Lucide icon="Play" class="w-4 h-4 text-white" />
                    </button>
                    <button class="btn btn-primary opacity-40 p-1.5" v-show="song.id === SongPlay.id">
                      <LoadingIcon icon="audio" />
                    </button>
                  </div>
                </div>
                <div class="ml-4 mr-auto">
                  <div class="font-medium">{{ song.name }}</div>
                  <div class="text-slate-500 text-xs mt-0.5">
                    <span v-for="(singer, idx) in song.singers" :key="singer.name">
                      {{ singer.name }}<span v-if="idx !== song.singers.length - 1">, </span>
                    </span>
                  </div>
                </div>
                <div class="text-slate-500 flex">{{ renderView(song.statistik as IStatistik) }} {{ t("listens") }}</div>
              </div>
            </div>
            <a
              @click="router.push('/song')"
              class="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500">
              {{ t("view_more") }}
            </a>
          </div>
        </div>
        <!-- END: Song -->
        <!-- BEGIN: Song -->
        <div class="col-span-12 intro-y sm:col-span-4 md:col-span-4 2xl:col-span-4">
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">{{ t("newly_released") }}</h2>
          </div>
          <div class="mt-5">
            <div
              v-for="(song, idx) in songsRecent"
              @mouseover="showRecent = idx"
              @mouseleave="showRecent = ''"
              :key="song.id"
              class="intro-x"
              @click="mediaStore.initSongStore(song)">
              <div class="flex items-center px-5 py-3 mb-3 box zoom-in">
                <Lucide icon="Music" class="w-5 h-5 mr-4 text-slate-500" />
                <div class="flex-none w-10 h-10 overflow-hidden rounded-md image-fit">
                  <img :alt="song.name" :src="env.backendServer + song.picture" />
                  <div
                    v-show="showRecent === idx || song.id === SongPlay.id"
                    class="absolute flex inset-x-0 bg-black/80 w-full h-full justify-center align-center">
                    <button class="btn btn-primary" v-show="song.id !== SongPlay.id">
                      <Lucide icon="Play" class="w-4 h-4 text-white" />
                    </button>
                    <button class="btn btn-primary opacity-40 p-1.5" v-show="song.id === SongPlay.id">
                      <LoadingIcon icon="audio" />
                    </button>
                  </div>
                </div>
                <div class="ml-4 mr-auto">
                  <div class="font-medium">{{ song.name }}</div>
                  <div class="text-slate-500 text-xs mt-0.5">
                    {{ formatDate(song.release, "DD/MM/YYYY") }}
                  </div>
                </div>
                <div class="text-success">
                  {{ toHHMMSS(String(song.time)) }}
                </div>
              </div>
            </div>
            <a
              href="#"
              @click="router.push('/song')"
              class="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500">
              {{ t("view_more") }}
            </a>
          </div>
        </div>
        <!-- END: Song -->
        <!-- BEGIN: Singer -->
        <div class="col-span-12 intro-y sm:col-span-4 md:col-span-4 2xl:col-span-4">
          <div class="flex items-center h-10 intro-x">
            <h2 class="mr-5 text-lg font-medium truncate">{{ t("singer") }}</h2>
            <a href="/singer" class="ml-auto truncate opacity-40 text-violet-500"> {{ t("view_more") }} </a>
          </div>
          <div
            class="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
            <div
              class="relative flex items-center mb-3 intro-x"
              v-for="singer in singers"
              :key="singer.id"
              @click="singerStore.searchInfoSinger(singer.id)">
              <div
                class="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                <div class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                  <img :alt="singer.name" :src="env.backendServer + singer.avatar" />
                </div>
              </div>
              <div class="flex-1 px-5 py-3 ml-4 box zoom-in">
                <div class="flex items-center">
                  <div class="font-medium">
                    {{ singer.name }}
                  </div>
                  <div class="ml-auto text-xs text-slate-500">
                    <Lucide icon="Heart" class="w-5 h-5" />
                  </div>
                </div>
                <div class="text-slate-500">
                  <div class="mt-1">{{ singer.description ? String(singer.description).slice(0, 30) : "" }}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: Singer -->
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-12">
      <div class="flex items-center h-10 intro-x">
        <h2 class="text-lg font-medium truncate mr-2">{{ t("trending_artist") }}</h2>
        <Lucide icon="Heart" class="w-4 h-4 text-white" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2 intro-y sm:gap-6">
        <div
          v-for="singer in singers"
          :key="singer.id"
          @click="singerStore.searchInfoSinger(singer.id)"
          class="before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black/90 before:to-black/10 image-fit">
          <div class="relative rounded">
            <FileIcon class="w-full mx-auto shadow-2xl" variant="image" :src="env.backendServer + singer.avatar" />
          </div>
          <div class="absolute bottom-0 z-10 px-5 pb-6 text-white">
            <div class="text-white">
              <a @click="singerStore.searchInfoSinger(singer.id)" class="font-medium text-3xl sm:text-sm">
                <span class="px-2 py-1 rounded bg-white/20 flex"
                  >{{ singer.name }} <Lucide icon="Star" class="w-3 h-3 ml-1 mt-0.5"
                /></span>
              </a>
            </div>
            <a @click="singerStore.searchInfoSinger(singer.id)" class="block mt-3 sm:text-sm font-medium text-xl">{{ singer.description.slice(0, 50) }}...</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .bg-vn {
    background-image: url("https://server.music.kdeveloper.net/api/media/banners/vietnam.jpeg");
  }

  .bg-us {
    background-image: url("https://server.music.kdeveloper.net/api/media/banners/usuk.jpeg");
  }

  .bg-kpop {
    background-image: url("https://server.music.kdeveloper.net/api/media/banners/kpop.png");
  }
</style>
