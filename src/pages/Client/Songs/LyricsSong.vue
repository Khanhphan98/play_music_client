<script setup lang="ts">
  import { computed, PropType, ref } from "vue";
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
  import { XMarkIcon } from "@heroicons/vue/24/outline";
  import { ISong } from "@/model/interface/ISong";
  import { env } from "@/utils/my-variables";
  import Lucide from "@/base-components/Lucide/Lucide.vue";
  import FileIcon from "@/base-components/FileIcon/FileIcon.vue";
  import SongLyric from "@/pages/Client/Lyrics/SongLyric.vue";

  const open = ref(false);
  const preview = (show: boolean) => {
    open.value = show;
  };

  const props = defineProps({
    song: {
      type: Object as PropType<ISong>,
      default: {} as ISong,
    },
  });

  const song = computed(() => props.song as ISong);
</script>

<template>
  <div class="col-span-12 intro-x lg:col-span-6">
    <!-- BEGIN: Overlapping Slide Over -->
    <button class="border-none mt-2" @click="(event: MouseEvent) => { event.preventDefault(); preview(true) }">
      <Lucide icon="Mic2" class="w-5 h-5 z-50 text-white ml-0.5 mt-0.5" />
    </button>
    <TransitionRoot as="template" :show="open" class="h-screen w-screen fixed top-0 left-0" style="z-index: 999">
      <Dialog as="div" class="relative z-50" @close="open = false">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 bottom-0 flex max-w-full">
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-y-full"
                enter-to="translate-y-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-y-0"
                leave-to="translate-y-full">
                <DialogPanel class="pointer-events-auto relative w-screen max-w">
                  <div
                    class="flex h-full w-full flex-col overflow-y-scroll bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90">
                    <TransitionChild
                      as="template"
                      enter="ease-in-out duration-500"
                      enter-from="opacity-0"
                      enter-to="opacity-100"
                      leave="ease-in-out duration-500"
                      leave-from="opacity-100"
                      leave-to="opacity-0">
                      <div class="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          class="rounded-md text-gray-300 mt-1.5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white z-50"
                          @click="open = false">
                          <span class="sr-only">Close</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </TransitionChild>
                    <div class="relative flex-1 px-4 sm:px-6">
                      <!-- Your content -->
                      <section class="relative isolate overflow-hidden sm:py-12 lg:px-8">
                        <div class="mx-auto w-4/6">
                          <figure class="mt-10 grid grid-cols-2 h-screen">
                            <figcaption class="col-span-1 h-full flex mt-20">
                              <div class='fixed'>
                                <FileIcon
                                    class="w-96 h-96 rounded-full mx-auto"
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
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <!-- END: Overlapping Slide Over -->
  </div>
</template>

<style lang='scss'>
.keep-scrolling {
  width: 100%;
  height: 80%;
  border: 1px dotted black;
  overflow-y: scroll; /* Add the ability to scroll the y axis */

  /* Hide the scrollbar for Internet Explorer, Edge and Firefox */
  -ms-overflow-style: none;  /* Internet Explorer and Edge */
  scrollbar-width: none;  /* Firefox */

  /* Hide the scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
