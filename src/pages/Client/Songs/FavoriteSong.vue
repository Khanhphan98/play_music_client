<script setup lang="ts">
  import Preview from "@/base-components/Preview";
  import { Slideover } from "@/base-components/Headless";
  import Button from "@/base-components/Button";
  import { computed, ref } from "vue";
  import Lucide from "@/base-components/Lucide";
  import { MediaStore } from "@/stores/media-store";
  import { ISong } from "@/model/interface/ISong";
  import { env } from "@/utils/my-variables";
  import { t } from "@/config/i18n";
  import { formatDate } from "@/utils/helper";
  import { toHHMMSS } from "@/utils/my-function";
  import LoadingIcon from "@/base-components/LoadingIcon/LoadingIcon.vue";

  const slide = ref(false);
  const preview = (value: boolean) => {
    slide.value = value;
  };

  const mediaStore = MediaStore();
  const favoriteSong = computed(() => mediaStore.favorites as ISong[]);
  const SongPlay = computed(() => mediaStore.song);

  const showAction = ref();
  const showRecent = ref();

  function handleFavoriteSong(song: ISong) {
    mediaStore.playFavorite = true;
    mediaStore.initSongStore(song);
  }
</script>

<template>
  <div class="col-span-12 intro-y lg:col-span-6">
    <!-- BEGIN: Overlapping Slide Over -->
    <Preview v-slot="{ toggle }">
      <div>
        <Preview.Panel>
          <!-- BEGIN: Slide Over Toggle -->
          <Button class="border-none" @click="(event: MouseEvent) => { event.preventDefault(); preview(true)}">
            <Lucide icon="ListOrdered" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
          </Button>
          <!-- END: Slide Over Toggle -->
          <!-- BEGIN: Slide Over Content -->
          <Slideover
            :open="slide"
            @close="
              () => {
                preview(false);
              }
            ">
            <Slideover.Panel>
              <Slideover.Title class="p-5">
                <h2 class="mr-auto text-base font-medium flex">
                  <Lucide icon="ListMusic" class="w-5 h-5 z-50 text-violet-600 mr-1 mt-0.5" />
                  {{ t("list_favorite_song") }}
                </h2>
                <Lucide icon="Heart" class="w-4 h-4 z-50 text-red-800" />
              </Slideover.Title>
              <Slideover.Description class="px-5 py-5 mt-3 mr-3">
                <div
                  v-if="favoriteSong && favoriteSong.length > 0"
                  :class="[
                    'z-40 -mb-10 -mx-[16px] md:-mx-[22px] relative px-[22px] min-h-[400px] xl:-mt-5 2xl:-mt-8 2xl:z-10',
                    'before:content-[\'\'] before:rounded-t-[20px] xl:before:rounded-t-[20px] before:rounded-b-[20px] xl:before:shadow-[0px_3px_20px_#0000000b] before:w-full before:h-full before:bg-slate-100 before:absolute before:top-0 before:left-3 before:dark:bg-darkmode-700',
                  ]">
                  <div class="relative z-10 pt-3">
                    <div
                      v-for="(song, idx) in favoriteSong"
                      @mouseover="showRecent = idx"
                      @mouseleave="showRecent = ''"
                      :key="song.id"
                      class="intro-x"
                      @click="handleFavoriteSong(song)">
                      <div class="flex items-center px-5 py-3 mb-3 -mr-2 box zoom-in">
                        <Lucide icon="Music" class="w-5 h-5 mr-4 text-slate-500" />
                        <div class="flex-none w-10 h-10 overflow-hidden rounded-md image-fit">
                          <img :alt="song.name" :src="env.backendServer + song.picture" />
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
                            {{ formatDate(song.release, "DD/MM/YYYY") }}
                          </div>
                        </div>
                        <div class="text-success">
                          {{ toHHMMSS(String(song.time)) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Slideover.Description>
            </Slideover.Panel>
          </Slideover>
          <!-- END: Slide Over Content -->
        </Preview.Panel>
      </div>
    </Preview>
    <!-- END: Overlapping Slide Over -->
  </div>
</template>
