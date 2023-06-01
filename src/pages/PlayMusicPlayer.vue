<script setup lang="ts">
  import Lucide from "@/base-components/Lucide";
  import { computed, ref, watch } from "vue";
  import { MediaStore } from "@/stores/media-store";
  import { ISong } from "@/model/interface/ISong";
  import { env } from "@/utils/my-variables";
  import FileIcon from "@/base-components/FileIcon/FileIcon.vue";
  import { toHHMMSS } from "@/utils/my-function";
  import Progress from "@/base-components/Progress";
  import SliderProgressbar from "@/base-components/SliderProgressbar";
  import SliderPlayMusic from "@/base-components/SliderProgressbar/SliderPlayMusic.vue";
  import FavoriteSong from "@/pages/Client/Songs/FavoriteSong.vue";

  const mediaStore = MediaStore();
  const SongPlay = computed(() => mediaStore.song as ISong);

  let audio = null as unknown as HTMLAudioElement;
  const showPlay = ref(true);
  const showModal = ref(false);
  const mutePlay = ref(false);
  const shuffle = ref(false);
  const hasFavorite = ref(false);
  const currentTime = ref();
  const percentTime = ref();
  const volumeValue = ref<Number>(50);
  const volumeValueRepeat = ref<Number>(50);
  const repeatSong: any = ref([{ icon: "Repeat" }, { icon: "Repeat" }, { icon: "Repeat1" }]);
  const repeatType = computed(() => mediaStore.repeatType);

  watch(
    () => SongPlay.value,
    (song: ISong) => {
      if (audio) {
        audio.pause();
      }
      if (song.file_mp3) {
        audio = new Audio(env.backendServer + song.file_mp3);
        audio.play();
        hasFavorite.value = false;

        audio.addEventListener("timeupdate", () => {
          let mins = Math.floor(audio.currentTime / 60) as String | Number;
          if (mins < 10) {
            mins = "0" + String(mins);
          }
          let secs = Math.floor(audio.currentTime % 60) as String | Number;
          if (secs < 10) {
            secs = "0" + String(secs);
          }

          percentTime.value = ((audio.currentTime / audio.duration) * 100).toFixed(2);
          currentTime.value = mins + ":" + secs;

          if (Number(parseInt(percentTime.value).toFixed(0)) === 100) {
            // Lặp vô hạn
            if (repeatType.value === 1) {
              mediaStore.actionNextSongByRepeat();
            }
            // Lặp một lần
            else if (repeatType.value === 2) {
              // back lại bài hát
              if (shuffle) {
                audio.currentTime = 0;
                audio.play();
                // Up view
                mediaStore.actionUpToView(SongPlay.value);
              } else {
                mediaStore.actionNextSongByRepeat();
              }
            } else {
              audio.currentTime = 0;
              showPlay.value = true;
            }
          }
        });

        showPlay.value = false;
      }
      showModal.value = true;
    },
  );

  function actionStopMusic() {
    if (audio) {
      audio.pause();
    }
  }

  function actionPlayMusic() {
    if (audio) {
      audio.play();
    }
  }

  function actionVolumeMusic(volume_value: number) {
    volumeValueRepeat.value = volume_value;
    audio.volume = Number((volume_value / 100).toFixed(2));
    if (audio.volume > 0) {
      mutePlay.value = false;
    }
  }

  function actionMuteMusic() {
    mutePlay.value = !mutePlay.value;
    if (mutePlay.value) {
      audio.volume = volumeValue.value = 0;
    } else {
      audio.volume = Number((Number(volumeValueRepeat.value) / 100).toFixed(2));
      volumeValue.value = Number(volumeValueRepeat.value);
    }
  }

  function actionHandleFavoriteSong(song: ISong) {
    hasFavorite.value = !hasFavorite.value;
    if (hasFavorite.value) {
      mediaStore.actionPushFavoriteSong(song);
    } else {
      mediaStore.actionRemoveFavoriteSong(song);
    }
  }

  function actionDragMusic(count: number) {
    audio.volume = 0;
    audio.currentTime = (count / 100) * audio.duration;
    // audio.volume = Number((Number(volumeValue.value) / 100).toFixed(2));
  }
</script>

<template>
  <div class="fixed bottom-0 bg-black/80 w-full py-3 px-5 z-50" v-if="showModal">
    <div class="relative">
      <div class="grid grid-cols-12 gap-6 intro-y mt-2">
        <div class="col-span-4">
          <div class="flex items-center intro-x">
            <FileIcon class="w-16 h-16 rounded-lg" variant="image" :src="env.backendServer + SongPlay.picture" />
            <div class="grid mx-2">
              <span class="font-semibold text-base text-slate-100">{{ SongPlay.name }}</span>
              <div>
                <span class="text-sm text-slate-400" v-for="(name_singer, idx) in SongPlay.singers" :key="name_singer">
                  {{ name_singer }}<span v-if="idx !== SongPlay.singers.length - 1">, </span>
                </span>
              </div>
            </div>
            <div class="mx-5">
              <button @click="actionHandleFavoriteSong(SongPlay)">
                <Lucide icon="Heart" class="w-4 h-4 z-50" :class="hasFavorite ? 'text-violet-600' : 'text-white'" />
              </button>
            </div>
          </div>
        </div>
        <div class="col-span-4 mt-1">
          <div class="flex text-center justify-center">
            <button
              class="btn p-2 mr-7 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
              @click="shuffle = !shuffle">
              <Lucide
                icon="Shuffle"
                class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5"
                :style="{
                  color: shuffle ? '#7e03b2' : '#fff',
                }" />
            </button>
            <button
              class="btn p-2 mr-7 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
              @click="
                mediaStore.actionPrevSong();
                hasFavorite = false;
              ">
              <Lucide icon="SkipBack" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
            <button
              class="border-solid btn rounded-full p-1.5 btn-music"
              v-show="showPlay"
              @click="
                actionPlayMusic();
                showPlay = false;
              ">
              <Lucide icon="Play" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
            <button
              class="border-solid btn rounded-full btn-music p-1.5"
              v-show="!showPlay"
              @click="
                actionStopMusic();
                showPlay = true;
              ">
              <Lucide icon="Equal" class="w-5 h-5 z-50 ml-0.5 mt-0.5" />
            </button>
            <button
              class="btn p-2 ml-7 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
              @click="
                mediaStore.actionNextSong();
                hasFavorite = false;
              ">
              <Lucide icon="SkipForward" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
            <div class="relative">
              <button
                v-for="(song_c, ids) in repeatSong"
                :key="song_c.id"
                class="absolute btn p-2 ml-6 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
                @click="mediaStore.actionRepeatSong()">
                <Lucide
                  :icon="song_c.icon"
                  class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5"
                  v-show="ids === repeatType"
                  :style="{
                    color: ids === 1 || ids === 2 ? '#7e03b2' : '#fff',
                  }" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-12 mt-4">
            <div class="-mt-2 mr-2">{{ currentTime }}</div>
            <div class="col-span-10 -mt-2">
              <SliderPlayMusic
                :percent="percentTime"
                @dragmusic="actionDragMusic"
                @mouseupmusic="audio.volume = Number((Number(volumeValue) / 100).toFixed(2))" />
            </div>
            <div class="-mt-2 ml-2">{{ toHHMMSS(String(SongPlay.time)) }}</div>
          </div>
        </div>
        <div class="col-span-4 text-right">
          <div class="flex justify-end text-center">
            <div class="mt-5">
              <SliderProgressbar :progress-bar-value="volumeValue" @progressbar="actionVolumeMusic" />
            </div>
            <div class="mt-3 ml-8">
              <button class="btn p-2" @click="actionMuteMusic">
                <Lucide v-if="mutePlay" icon="VolumeX" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
                <Lucide v-else icon="Volume2" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
              </button>
            </div>
            <div class="mt-3">
              <FavoriteSong />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .btn-music {
    border: 2px solid #fff !important;
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
</style>
