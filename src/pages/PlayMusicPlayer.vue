<script setup lang='ts'>
  import Lucide from '@/base-components/Lucide';
  import { computed, ref, watch } from 'vue';
  import { MediaStore } from '@/stores/media-store';
  import { ISong } from '@/model/interface/ISong';
  import { env } from '@/utils/my-variables';

  const mediaStore = MediaStore();
  const SongPlay = computed(() => mediaStore.song as ISong);

  let audio = null as unknown as HTMLAudioElement;
  const showPlay = ref(true);

  watch(() => SongPlay.value, (song: ISong) => {
    if (audio) {
      audio.pause();
    }
    if (song.file_mp3) {
      audio = new Audio(env.backendServer + song.file_mp3);
      audio.play();
      showPlay.value = false;
    }
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
  <div class='absolute bottom-0 bg-black/30 w-full py-5'>
    <div class='relative'>
      <div class='flex text-center justify-center'>
        <button class='btn btn-primary' v-if='showPlay' @click='actionPlayMusic(); showPlay = false'>
          <Lucide icon="Play" class="w-4 h-4 z-50 text-white" />
        </button>
        <button class='btn btn-primary' v-if='!showPlay' @click='actionStopMusic(); showPlay = true'>
          <Lucide icon="Equal" class="w-4 h-4 z-50 text-white" />
        </button>
        {{ SongPlay.name }}
      </div>
    </div>
  </div>
</template>
