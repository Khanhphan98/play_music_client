<script setup lang='ts'>
  import Lucide from '@/base-components/Lucide';
  import { computed, ref, watch } from 'vue';
  import { MediaStore } from '@/stores/media-store';
  import { ISong } from '@/model/interface/ISong';
  import { env } from '@/utils/my-variables';
  import FileIcon from '@/base-components/FileIcon/FileIcon.vue';
  import { toHHMMSS } from '@/utils/my-function';

  const mediaStore = MediaStore();
  const SongPlay = computed(() => mediaStore.song as ISong);

  let audio = null as unknown as HTMLAudioElement;
  const showPlay = ref(true);
  const showModal = ref(false);
  const currentTime = ref();

  watch(() => SongPlay.value, (song: ISong) => {
    if (audio) {
      audio.pause();
    }
    if (song.file_mp3) {
      audio = new Audio(env.backendServer + song.file_mp3);
      audio.play();

      audio.addEventListener('timeupdate', () => {
        let mins = Math.floor(audio.currentTime / 60) as String | Number;
        if (mins < 10) {
          mins = '0' + String(mins);
        }
        let secs = Math.floor(audio.currentTime % 60) as String | Number;
        if (secs < 10) {
          secs = '0' + String(secs);
        }
        currentTime.value = mins + ':' + secs;
      })

      showPlay.value = false;
    }
    showModal.value = true;
  })

  function actionStopMusic () {
    if (audio) {
      audio.pause();
    }
  }

  function actionPlayMusic () {
    if (audio) {
      audio.play();
    }
  }

</script>

<template>
  <div class='fixed bottom-0 bg-black/80 w-full py-3 px-5 z-50' v-if='showModal'>
    <div class="relative">
      <div class="grid grid-cols-12 gap-6 intro-y mt-2">
        <div class="col-span-4">
          <div class="flex items-center intro-x">
            <FileIcon class="w-16 h-16 rounded-lg" variant="image" :src="env.backendServer + SongPlay.picture" />
            <div class='grid mx-2'>
              <span class='font-semibold text-base'>{{ SongPlay.name }}</span>
              <div>
                <span class='text-sm text-slate-400' v-for='(name_singer, idx) in SongPlay.singers' :key='name_singer'>
                  {{ name_singer }}<span v-if='idx !== SongPlay.singers.length - 1'>, </span>
                </span>
              </div>
            </div>
            <div class='mx-5'>
              <Lucide icon="Heart" class="w-4 h-4 z-50 text-white" />
            </div>
          </div>
        </div>
        <div class='col-span-4 mt-1'>
          <div class='flex text-center justify-center'>
            <button class='btn p-2 mr-7 hover:bg-teal-50/20 hover:rounded-full hover:duration-500' @click='mediaStore.actionPrevSong()'>
              <Lucide icon="SkipBack" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
            <button class='border-solid btn rounded-full p-1.5 btn-music' v-show='showPlay' @click='actionPlayMusic(); showPlay = false'>
              <Lucide icon="Play" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
            <button class='border-solid btn rounded-full btn-music p-1.5' v-show='!showPlay' @click='actionStopMusic(); showPlay = true'>
              <Lucide icon="Equal" class="w-5 h-5 z-50 ml-0.5 mt-0.5" />
            </button>
            <button class='btn p-2 ml-7 hover:bg-teal-50/20 hover:rounded-full hover:duration-500' @click='mediaStore.actionNextSong()'>
              <Lucide icon="SkipForward" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
          </div>
          <div class='grid grid-cols-12 mt-4'>
            <div class='-mt-2 mr-2'>{{ currentTime }}</div>
            <div class="h-1 col-span-10 btn-progressbar-music rounded bg-teal-50/20">
              <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class='-mt-2 ml-2'>{{ toHHMMSS(String(SongPlay.time)) }}</div>
          </div>
        </div>
        <div class='col-span-4 text-right'>
          <div class='mt-1'>
            <button class='btn p-2 ml-7'>
              <Lucide icon="ListOrdered" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .btn-music {
      border: 2px solid #fff!important;
      transition: 0.4s;
      svg {
          color: #fff;
          transition: 0.4s;
      }
  }
  .btn-music:hover {
      border-color: #dc1ddc !important;
      svg {
          color: #dc1ddc !important;
      }
  }
  .btn-progressbar-music {}
</style>
