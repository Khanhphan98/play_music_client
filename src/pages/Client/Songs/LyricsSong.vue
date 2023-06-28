<script setup lang="ts">
  import { computed } from "vue";
  import { XMarkIcon } from "@heroicons/vue/24/outline";
  import { ISong } from "@/model/interface/ISong";
  import { env } from "@/utils/my-variables";
  import {MediaStore} from '@/stores/media-store';
  import Lucide from "@/base-components/Lucide/Lucide.vue";
  import FileIcon from "@/base-components/FileIcon/FileIcon.vue";
  import SongLyric from "@/pages/Client/Lyrics/SongLyric.vue";

  const mediaStore = MediaStore();
  const song = computed(() => mediaStore.song as ISong);
</script>

<template>
  <div id="lyrics" class="overlay" style='z-index: 98'>
    <div class="overlay-content">
      <div class="flex h-full w-full flex-col bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90">
        <div class="relative flex-1 px-4 sm:px-6">
          <div class="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
            <button type="button" class="rounded-md text-gray-300 mt-1.5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white z-50"
                    @click="mediaStore.showHideLyrics()">
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <!-- Your content -->
          <section class="relative overflow-hidden sm:py-12 lg:px-8">
            <div class="mx-auto w-4/6">
              <figure class="mt-10 grid grid-cols-2 h-screen">
                <figcaption class="col-span-1 h-full flex mt-20">
                  <div class='fixed'>
                    <FileIcon v-if='song.picture'
                              class="w-96 h-96 mx-auto bg-indigo-500 shadow-lg shadow-pink-600/40"
                              variant="image"
                              :src="env.backendServer + song.picture" />
                    <div class="mt-4 flex items-center justify-center space-x-3 text-base">
                      <div class="font-serif text-white text-2xl flex">
                        <Lucide icon="Heart" class="w-4 h-4 mt-2 mr-2" />
                        {{ song.name }}
                      </div>
                      <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" class="fill-gray-900">
                        <circle cx="1" cy="1" r="1" />
                      </svg>
                      <div class="text-white flex">
                      <span class="text-xl" v-for="(name_singer, idx) in song.singers" :key="name_singer">
                        {{ name_singer }}<span v-if="idx !== song.singers.length - 1">, </span>
                      </span>
                        <Lucide icon="Heart" class="w-4 h-4 mt-2 ml-2" />
                      </div>
                    </div>
                  </div>
                </figcaption>
                <div class='col-span-1 h-4/5 keep-scrolling'>
                  <blockquote class="leading-8 sm:text-lg sm:leading-9">
                    <SongLyric :lyrics-song="song.lyric" />
                  </blockquote>
                </div>
              </figure>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.overlay {
  height: 0;
  width: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0, 0.9);
  overflow-y: hidden;
  transition: 0.5s;
  display: none;

  .keep-scrolling {
    width: 100%;
    height: 80%;
    overflow-y: scroll; /* Add the ability to scroll the y axis */

    /* Hide the scrollbar for Internet Explorer, Edge and Firefox */
    -ms-overflow-style: none;  /* Internet Explorer and Edge */
    scrollbar-width: none;  /* Firefox */

    /* Hide the scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    border: none;
  }
}

@media screen and (max-height: 450px) {
  .overlay {overflow-y: auto}
  .overlay .closebtn {
  }
}
</style>
