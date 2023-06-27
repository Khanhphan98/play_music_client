<script setup lang="ts">
  import Lucide from "@/base-components/Lucide";
  import { computed, ref, watch } from "vue";
  import { MediaStore } from "@/stores/media-store";
  import { ISong } from "@/model/interface/ISong";
  import { env } from "@/utils/my-variables";
  import FileIcon from "@/base-components/FileIcon/FileIcon.vue";
  import { toHHMMSS } from "@/utils/my-function";
  import SliderProgressbar from "@/base-components/SliderProgressbar";
  import SliderPlayMusic from "@/base-components/SliderProgressbar/SliderPlayMusic.vue";
  import FavoriteSong from "@/pages/Client/Songs/FavoriteSong.vue";
  import LyricsSong from "@/pages/Client/Songs/LyricsSong.vue";
  import { storeToRefs } from "pinia";
  import { SongStore } from "@/stores/song-store";

  const mediaStore = MediaStore();
  const SongPlay = computed(() => mediaStore.song as ISong);

  let audio = null as unknown as HTMLAudioElement;
  const showPlay = ref(true);
  const showModal = ref(false);
  const mutePlay = ref(false);
  const shuffle = ref(false);
  const hasFavorite = ref(false);
  const currentTime = ref();
  const percentTime = ref("0");
  const volumeValue = ref<number>(50);
  const volumeValueRepeat = ref<number>(50);
  const repeatSong: any = ref([{ icon: "Repeat" }, { icon: "Repeat" }, { icon: "Repeat1" }]);
  const repeatType = computed(() => mediaStore.repeatType);

  const songStore = SongStore();
  const { trackTime } = storeToRefs(songStore);

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
          let mins = Math.floor(audio.currentTime / 60) as string | number;
          if (mins < 10) {
            mins = "0" + String(mins);
          }
          let secs = Math.floor(audio.currentTime % 60) as string | number;
          if (secs < 10) {
            secs = "0" + String(secs);
          }

          percentTime.value = ((audio.currentTime / audio.duration) * 100).toFixed(2);
          trackTime.value = currentTime.value = mins + ":" + secs;

          if (Number(parseInt(percentTime.value).toFixed(0)) === 100) {
            // Lặp vô hạn
            if (repeatType.value === 1) {
              mediaStore.actionNextSongByRepeat();
            }
            // Lặp một lần
            else if (repeatType.value === 2) {
              // back lại bài hát
              if (shuffle.value) {
                audio.currentTime = 0;
                audio.play();
              } else {
                mediaStore.actionNextSongByRepeat();
              }
            } else {
              audio.currentTime = 0;
              showPlay.value = true;
            }
            // Up view
            mediaStore.actionUpToView(SongPlay.value);
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
    if (audio && audio.duration > 0) {
      audio.volume = 0;
      audio.currentTime = (count / 100) * audio.duration;
    }
  }

  function actionUpdateVolumnMusic() {
    audio.volume = Number((Number(volumeValue.value) / 100).toFixed(2));
  }
</script>

<template>
  <div class="fixed bottom-0 bg-black/80 w-full py-3 px-5" v-if="showModal" style='z-index: 99'>
    <div class="relative">
      <div class="grid grid-cols-12 gap-2 intro-y mt-2">
        <div class="col-span-4 sm:col-span-6 md:col-span-4">
          <div class="inline md:flex sm:flex items-center intro-x">
            <FileIcon class="w-16 h-16 rounded-lg mb-2" variant="image" :src="env.backendServer + SongPlay.picture" />
            <div class="grid sm:mx-2">
              <span class="font-semibold text-base text-slate-100">{{ SongPlay.name }}</span>
              <div>
                <span class="text-sm text-slate-400 truncate" v-for="(name_singer, idx) in SongPlay.singers" :key="name_singer">
                  {{ name_singer }}<span v-if="idx !== SongPlay.singers.length - 1">, </span>
                </span>
              </div>
            </div>
            <div class="sm:mx-5 mt-1 sm:mt-0">
              <button @click="actionHandleFavoriteSong(SongPlay)">
                <Lucide icon="Heart" class="w-4 h-4 z-50" :class="hasFavorite ? 'text-violet-600' : 'text-white'" />
              </button>
            </div>
          </div>
        </div>
        <div class="col-span-8 sm:col-span-4 mt-1">
          <div class="flex sm:text-center sm:justify-center">
            <button
              class="btn p-2 sm:mr-7 mr-5 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
              @click="shuffle = !shuffle">
              <Lucide
                icon="Shuffle"
                class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5"
                :style="{
                  color: shuffle ? '#7e03b2' : '#fff',
                }" />
            </button>
            <button
              class="btn p-2 sm:mr-7 mr-5 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
              @click="
                mediaStore.actionPrevSong();
                hasFavorite = false;
              ">
              <Lucide icon="SkipBack" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
            </button>
            <button
              class="btn"
              v-show="showPlay"
              @click="
                actionPlayMusic();
                showPlay = false;
              ">
              <Lucide
                icon="PlayCircle"
                class="w-9 h-9 z-50 text-white ml-0.5 mt-0.5 hover:text-violet-700 duration-500" />
            </button>
            <button
              class="btn"
              v-show="!showPlay"
              @click="
                actionStopMusic();
                showPlay = true;
              ">
              <Lucide
                icon="PauseCircle"
                class="w-9 h-9 z-50 ml-0.5 mt-0.5 text-white hover:text-violet-700 duration-500" />
            </button>
            <button
              class="btn p-2 sm:ml-7 ml-5 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
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
                class="absolute btn p-2 sm:ml-7 ml-5 hover:bg-teal-50/20 hover:rounded-full hover:duration-500"
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
          <div class="grid grid-cols-12 mt-8 sm:mt-4">
            <div class="col-span-2 sm:col-span-1 -mt-2 mr-2 text-white text-left">{{ currentTime }}</div>
            <div class="col-span-8 sm:col-span-10 -mt-2">
              <SliderPlayMusic
                :percent="percentTime"
                @dragmusic="actionDragMusic"
                @mouseupmusic="actionUpdateVolumnMusic" />
            </div>
            <div class="col-span-2 sm:col-span-1 -mt-2 ml-2 text-white text-right">{{ toHHMMSS(String(SongPlay.time)) }}</div>
          </div>
        </div>
        <div class="col-span-6 sm:text-right sm:col-span-4">
          <div class="flex justify-end text-center">
            <div class="mt-5">
              <SliderProgressbar :progress-bar-value="volumeValue" @progressbar="actionVolumeMusic" />
            </div>
            <div class="mt-3 ml-8">
              <LyricsSong :song="SongPlay" />
            </div>
            <div class="mt-3 ml-5">
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
