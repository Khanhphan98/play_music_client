<script lang="ts">
  export default {
    inheritAttrs: false,
  };
</script>

<script setup lang="ts">
  import { computed, PropType, useAttrs } from 'vue';
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
  } from '@headlessui/vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { ModalConfig, ModalSize } from '@/model/dto/ModalConfig';
  import { t } from '@/config/i18n';
  import { twMerge } from 'tailwind-merge';

  const props = defineProps({
    openModal: {
      type: Boolean,
      default: false,
    },
    buttonSave: {
      type: Boolean,
      default: false,
    },
    modalOptions: {
      type: Object as PropType<ModalConfig>,
      default:
        ({
          title: '',
          staticModal: false,
          footer: false,
          template: '',
          size: ModalSize.MD,
          close: false,
        } as ModalConfig) || {},
    },
  });
  const emit = defineEmits(['callBackAction', 'closeModal']);
  const isOpen = computed({
    get: () => props.openModal,
    set: (_vl) => emit('closeModal', _vl),
  });
  const mdConfig = computed(() => props.modalOptions as ModalConfig);
  const attrs = useAttrs();

  const dialogClass = computed(() =>
    twMerge([
      (mdConfig.value.size === ModalSize.MD || !mdConfig.value.size) && 'max-w-md',
      mdConfig.value.size === 'xl' && 'max-w-xl',
      mdConfig.value.size === '2xl' && 'max-w-2xl',
      mdConfig.value.size === '3xl' && 'max-w-3xl',
      typeof attrs.class === 'string' && attrs.class,
    ]),
  );

  function closeModal() {
    if (mdConfig.value.staticModal) {
      isOpen.value = false;
    }
  }

  function buttonCloseModal() {
    if (!mdConfig.value.close) {
      isOpen.value = false;
    }
  }
</script>

<template>
  <TransitionRoot appear :show="isOpen ? isOpen : false" as="template">
    <Dialog static-backdrop as="div" class="relative z-[9999]" @close="isOpen = false">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-70" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full transform rounded-2xl bg-white dark:bg-darkmode-400 px-6 pt-6 text-left align-middle shadow-xl transition-all"
              :class="dialogClass">
              <DialogTitle>
                <div class="text-lg font-medium leading-6 flex items-center">
                  <h3 class="grow text-2xl text-gray-500 dark:text-gray-300/70">
                    <template v-if="mdConfig.title">
                      {{ mdConfig.title }}
                    </template>
                    <template v-else>
                      <slot name="title"></slot>
                    </template>
                  </h3>
                  <Button
                    size="sm"
                    class="border-none shadow-none -mr-[10px] text-slate-500 hover:text-slate-600 dark:text-slate-300/50 dark:hover:text-slate-300/70"
                    type="button"
                    @click="buttonCloseModal">
                    <Lucide icon="X" class="h-5 w-5" />
                  </Button>
                </div>
              </DialogTitle>

              <DialogDescription>
                <div :class="[!mdConfig.footer ? 'py-5' : 'pt-5']">
                  <template v-if="mdConfig.template === 'del'">
                    <div
                      class="flex flex-col items-center rounded-md mt-6 border border-dashed border-red-500/70 dark:border-red-500/70 px-5 pb-5">
                      <div
                        class="h-16 w-16 rounded-full text-white/70 bg-red-400 flex items-center justify-center -mt-8">
                        <Lucide icon="Trash" class="w-8 h-8" />
                      </div>
                      <div class="w-full">
                        <slot name="modalbody"></slot>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <slot name="modalbody"></slot>
                  </template>
                </div>
              </DialogDescription>

              <template v-if="!mdConfig.footer">
                <div class="grid grid-cols-2 gap-3 sticky bottom-0 bg-white dark:bg-darkmode-400 pb-6 pt-3">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    class="min-w-[7rem]"
                    @click="buttonCloseModal">
                    {{ t('button.cancel') }}
                  </Button>
                  <template v-if="mdConfig.template === 'del'">
                    <Button
                      type="button"
                      variant="danger"
                      class="min-w-[7rem]"
                      @click="emit('callBackAction')">
                      {{ t('button.delete') }}
                    </Button>
                  </template>
                  <template v-else-if="mdConfig.template === 'confirm'">
                    <Button
                      type="button"
                      variant="warning"
                      class="min-w-[7rem]"
                      @click="emit('callBackAction')">
                      {{ t('button.confirm') }}
                    </Button>
                  </template>
                  <template v-else>
                    <Button
                      type="button"
                      variant="primary"
                      class="min-w-[7rem]"
                      @click="emit('callBackAction')">
                      {{ t('button.save') }}
                    </Button>
                  </template>
                </div>
              </template>
              <template v-else-if="mdConfig.footer !== 'form'">
                <div class="sticky bottom-0 bg-white dark:bg-darkmode-400 pb-6 pt-3">
                  <slot name="footer"></slot>
                </div>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
