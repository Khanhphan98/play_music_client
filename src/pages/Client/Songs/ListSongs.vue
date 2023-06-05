<script setup lang="ts">
  import { env } from "@/utils/my-variables";
  import { formatDate } from "@/utils/helper";
  import { toHHMMSS } from "@/utils/my-function";
  import { SongStore } from "@/stores/song-store";
  import { computed, onMounted, ref } from "vue";
  import Lucide from "@/base-components/Lucide";
  import { MediaStore } from "@/stores/media-store";
  import LoadingIcon from "@/base-components/LoadingIcon/LoadingIcon.vue";
  import { IStatistik } from "@/model/interface/IStatistik";
  import FormInput from "@/base-components/Form/FormInput.vue";
  import { t } from "@/config/i18n";
  import Button from "@/base-components/Button";

  const songStore = SongStore();
  const songs = computed(() => {
    return songStore.songs.sort((a, b) => {
      let x = a.statistik as IStatistik;
      let y = b.statistik as IStatistik;
      return y.song_play_count - x.song_play_count;
    });
  });

  const mediaStore = MediaStore();
  const SongPlay = computed(() => mediaStore.song);

  // value scope
  const searchModel = ref("");
  const showAction = ref();
  const isActiveCountry = ref();
  // value scope
  const countriesMusic = ref([
    { ids: ["1"], name: "Việt Nam", image: "./src/assets/images/banners/vietnam.jpeg" },
    { ids: ["2"], name: "Kpop", image: "./src/assets/images/banners/kpop.png" },
    { ids: ["1", "2"], name: "US-UK", image: "./src/assets/images/banners/usuk.jpeg" },
  ]);

  async function filterCountry(ids: string[]) {
    await songStore.searchByCountry(ids);
  }

  function renderView(statistik: IStatistik) {
    return statistik.song_play_count;
  }

  onMounted(() => {
    songStore.recent();
  });
</script>

<template>
  <div
    v-if="songs && songs.length > 0"
    :class="[
      'z-40 grid gap-6 -mb-10 -mx-[16px] md:-mx-[22px] relative px-[22px] min-h-[400px] xl:-mt-5 2xl:-mt-8 2xl:z-10',
      'before:content-[\'\'] before:rounded-t-[30px] xl:before:rounded-t-[30px] before:rounded-b-[30px] xl:before:shadow-[0px_3px_20px_#0000000b] before:w-full before:h-full before:bg-slate-100 before:absolute before:top-0 before:left-0 before:right-0 before:dark:bg-darkmode-700',
    ]">
    <div class="relative z-10 col-span-12 2xl:col-span-3">
      <div class="pb-10">
        <div class="grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Recent Activities -->
          <!-- END: Recent Activities -->
          <div class="col-span-12 mt-3 md:col-span-12 xl:col-span-12 2xl:col-span-12 2xl:mt-12">
            <div class="flex items-center h-10 mt-6">
              <h2 class="mr-5 text-3xl font-medium">{{ t("the_leader_board") }} #PM</h2>
            </div>
            <div class="mt-5 grid grid-cols-12 gap-6">
              <div class="col-span-2 md:col-span-4 lg:col-span-3 relative">
                <div class="md:block">
                  <img
                    :alt="songs[0].name"
                    :src="env.backendServer + songs[0].picture"
                    class="cursor-pointer w-full h-auto rounded-lg"
                    @click="mediaStore.initSongStore(songs[0])" />
                  <div class="mt-2">
                    <h1 class="text-center text-2xl font-bold font-serif">{{ songs[0].name }}</h1>
                    <div class="text-center text-lg font-serif">
                      <span v-for="(name_singer, idx) in songs[0].singers" :key="name_singer">
                        {{ name_singer }}<span v-if="idx !== songs[0].singers.length - 1">, </span>
                      </span>
                    </div>
                    <h3 class="text-center text-slate-500 mt-1">
                      {{ t("release") }}: {{ formatDate(songs[0].release, "DD/MM/YYYY") }}
                    </h3>
                    <div class="text-center">
                      <button class="p-2 border-teal-50 border-solid">
                        <Lucide icon="Heart" class="w-5 h-5 z-50 ml-0.5 mt-0.5" />
                      </button>
                      <button class="">
                        <Lucide icon="Music" class="w-5 h-5 z-50 ml-0.5 mt-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-span-10 md:col-span-8 lg:col-span-9">
                <div class="grid grid-cols-12 mb-4">
                  <div class="flex col-span-8">
                    <span
                      v-for="(music_c, idx) in countriesMusic"
                      :key="music_c.name"
                      @click="
                        filterCountry(music_c.ids);
                        isActiveCountry = idx;
                      "
                      class="cursor-pointer border-solid font-serif dark:border-violet-600/20 border-2 px-8 py-2 rounded-3xl mr-3"
                      :class="{ 'bg-violet-800/80': isActiveCountry === idx }">
                      <span
                        class="text-base"
                        :class="{
                          'text-blue-500': idx === 0,
                          'text-red-500': idx === 1,
                          'text-yellow-500': idx === 2,
                          'text-white': isActiveCountry === idx,
                        }"
                        >{{ music_c.name }}</span
                      >
                    </span>
                  </div>
                  <div class="col-span-4 justify-end">
                    <div class="relative w-full md:w-64 md:ml-auto">
                      <FormInput
                        type="search"
                        :placeholder="t('find', { name: t('song').toLowerCase() }) + '...'"
                        class="pr-10 dark:border-slate-600"
                        v-model="searchModel"
                        name="find-song" />
                      <Button
                        class="border-none shadow-none absolute inset-y-0 right-0 text-gray-400 hover:text-gray-600">
                        <Lucide icon="Search" class="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(song, idx) in songs.filter((s) =>
                    searchModel ? s.name.toLowerCase().includes(searchModel.toLowerCase()) : s,
                  )"
                  :key="song.id"
                  class="intro-x"
                  @mouseover="showAction = idx"
                  @mouseleave="showAction = ''">
                  <div
                    class="flex items-center px-5 py-3 mb-3 zoom-in border-2 rounded-md"
                    @click="mediaStore.initSongStore(song)">
                    <div
                      class="text-3xl font-bold border-white"
                      :class="{
                        'text-blue-500': idx === 0,
                        'text-red-500': idx === 1,
                        'text-yellow-500': idx === 2,
                      }">
                      {{ idx + 1 }}
                    </div>
                    <div class="text-3xl opacity-30 mx-4">-</div>
                    <div class="flex-none w-10 h-10 overflow-hidden rounded-md image-fit p-0">
                      <img :alt="song.name" :src="env.backendServer + song.picture" class="z-0" />
                      <div
                        v-show="showAction === idx || song.id === SongPlay.id"
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
                        <span v-for="(name_singer, idx) in song.singers" :key="name_singer">
                          {{ name_singer }}<span v-if="idx !== song.singers.length - 1">, </span>
                        </span>
                      </div>
                    </div>
                    <div class="text-slate-500 mr-5 flex">
                      <Lucide icon="Music" class="w-3.5 h-3.5 mr-1 mt-0.5 text-violet-600" />
                      {{ song.lyric.slice(0, 50) }}
                    </div>
                    <div class="text-slate-500 mr-5 flex">
                      <Lucide icon="Timer" class="w-3.5 h-3.5 mr-1 mt-0.5 text-sky-500" />
                      {{ toHHMMSS(String(song.time)) }}
                    </div>
                    <div class="text-slate-500 flex">
                      <Lucide icon="PlayCircle" class="w-3.5 h-3.5 mr-1 mt-0.5 text-red-500" />
                      {{ renderView(song.statistik as IStatistik) }} {{ t("listens") }}
                    </div>
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
