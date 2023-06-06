<script setup lang="ts">
  import { computed, PropType, toRefs, watch } from "vue";
  import { SongStore } from "@/stores/song-store";
  import { storeToRefs } from "pinia";
  import { ILyric } from "@/model/interface/ILyric";

  const props = defineProps({
    time: String,
    words: String,
    lyrics: {
      type: Array as PropType<ILyric[]>,
      default: [],
    },
  });

  const songStore = SongStore();
  const { trackTime, lyricsPosition } = storeToRefs(songStore);
  const { time, words } = toRefs(props);
  const lyrics = computed(() => props.lyrics as ILyric[]);

  watch(
    () => trackTime.value,
    (time) => {
      for (let i = 0; i < lyrics.value.length; i++) {
        if (time === lyrics.value[i].time) {
          lyricsPosition.value = lyrics.value[i].time;
        }
      }
    },
  );
</script>

<template>
  <div
    :id="time"
    :class="[
      'opacity-100',
      {
        'opacity-40': lyricsPosition !== time,
        'text-white': lyricsPosition !== time,
        'text-yellow-400 font-bold': lyricsPosition === time,
      },
    ]">
    <div class="text-xl font-serif mb-1">{{ words }}</div>
  </div>
</template>
