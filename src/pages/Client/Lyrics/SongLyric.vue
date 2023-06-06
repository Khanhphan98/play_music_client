<script setup lang="ts">
  import { SongStore } from "@/stores/song-store";
  import LyricsRow from "@/pages/Client/Lyrics/LyricsRow.vue";
  import { storeToRefs } from "pinia";
  import { computed, onMounted, watch } from "vue";
  import { ILyric } from "@/model/interface/ILyric";

  const props = defineProps({
    lyricsSong: {
      type: String,
      default: "",
    },
  });

  const songStore = SongStore();
  const { trackTime } = storeToRefs(songStore);
  const lyricsSong = computed(() => {
    return convertStringToJson(props.lyricsSong);
  });

  function convertStringToJson(lyrics: String): ILyric[] {
    const lines = lyrics.split("\n"); // Tách chuỗi thành từng dòng

    return lines.reduce((lyricsShow: ILyric[], line) => {
      const timeMatch = line.match(/^\[(\d{2}:\d{2}(?:\.\d{2})?)\]/); // Lấy thời gian trong dấu ngoặc vuông
      const wordsMatch = line.match(/^\[\d{2}:\d{2}(?:\.\d{2})?\](.*)/); // Lấy phần từ sau thời gian

      if (timeMatch && wordsMatch) {
        lyricsShow.push({ time: timeMatch[1], word: wordsMatch[1].trim() } as ILyric);
      }

      return lyricsShow.length > 0 ? lyricsShow : [];
    }, []);
  }

  onMounted(() => {
    if (lyricsSong.value.length > 0 && trackTime.value < lyricsSong.value[0].time) {
      const lyric_div = document.getElementById("lyric-div") as HTMLDivElement;
      lyric_div.scrollTop = 0;
    }
  });

  const snapToPosition = (res: any) => {
    if (res && res.time < trackTime.value) {
      let position = document.getElementById(res.time);
      if (position) {
        position.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  };

  watch(
    () => trackTime.value,
    () => {
      setTimeout(() => {
        if (lyricsSong.value.length > 0 && trackTime.value < lyricsSong.value[0].time) {
          const lyric_div = document.getElementById("lyric-div") as HTMLDivElement;
          lyric_div.scrollTop = 0;
        }
      }, 500);
    },
  );
</script>

<template>
  <div id="lyric-div" class="w-1/2 max-w-[600px] mx-auto relative h-[calc(100%-1px)] overflow-auto scrollbar-hide" />
  <div
    v-if="lyricsSong && lyricsSong.length > 0"
    class="text-center opacity-100"
    :class="snapToPosition(lyric)"
    v-for="lyric in lyricsSong"
    :key="lyric">
    <LyricsRow :time="lyric.time" :words="lyric.word" :lyrics="lyricsSong" />
  </div>
  <div v-else>
    {{ props.lyricsSong }}
  </div>
</template>
