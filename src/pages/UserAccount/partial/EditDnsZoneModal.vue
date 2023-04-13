<template>
  <TransitionRoot appear :show="fileEditorModal" as="template">
    <Dialog as="div" class="relative z-[1000]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-50" />
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
              class="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="div" class="flex items-center">
                <h3 class="grow text-lg font-medium leading-6 text-gray-900">Edit DNS Zone</h3>
                <Button variant="outline-secondary" @click="fileEditorModal = false">
                  <Lucide icon="X" class="h-4 w-4" />
                </Button>
              </DialogTitle>
              <div class="mt-3">
                <div>
                  File info <a href="#" class="text-blue-600 hover:underline">[stats]</a>
                  <pre class="whitespace-pre-line bg-light dark:bg-darkmode-900 px-3.5 rounded mb-5">
                      <code>
                        -rw-r--r-- 1 root root 1160 Mar  2 09:11 /var/named/hung.com.db
                      </code>
                    </pre>
                </div>
                <h3 class="text-base mb-2">Contents of File: /var/named/hung.com.db</h3>
                <div
                  ref="fileEditElemt"
                  class="whitespace-pre-line p-5 bg-light dark:bg-darkmode-900 min-h-[30vh]"
                  spellcheck="false"
                  contenteditable="true"
                  @keydown.down="getFileEditAndValidate">
                  {{ fileEditorTxtDemo }}
                </div>
              </div>
              <Alert v-if="fileBackup" variant="outline-success" class="flex items-center mb-2 mt-4">
                <Lucide icon="AlertTriangle" class="w-6 h-6 mr-2" />
                <p class="grow"><b>SUCCESS!</b> File Backup Completed !</p>
                <Button @click="fileBackup = false" size="sm">
                  <Lucide icon="X" class="w-4 h-4" />
                </Button>
              </Alert>
              <div class="mt-4 text-right">
                <Button
                  variant="primary"
                  class="mr-3"
                  @click="
                    this.$emit('saveDnsZone');
                    fileEditorModal = false;
                  ">
                  Save Changes
                </Button>
                <Button
                  :disabled="fileBackup"
                  class="border-primary/50 text-primary/70 hover:text-primary hover:border-primary mr-3"
                  @click="createFileBackup">
                  Create File Backup
                </Button>
                <Button variant="secondary" @click="fileEditorModal = false"> Close </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Alert from '@/base-components/Alert/Alert.vue';
  import { computed, ref } from 'vue';

  const props = defineProps({
    openClose: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
    },
  });
  const emit = defineEmits(['update:openClose', 'update:content', 'saveDnsZone']);

  const fileEditorModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });
  const fileEditorTxtDemo = computed({
    get: () => props.content,
    set: (_vl) => emit('update:content', _vl),
  });
  const fileBackup = ref(false);
  const fileEditElemt = ref();
  function getFileEditAndValidate($event: Event) {
    ($event.target as HTMLInputElement).blur();
    fileEditorTxtDemo.value = fileEditElemt.value.innerText.trim();
  }
  function createFileBackup() {
    fileBackup.value = true;
  }
</script>
