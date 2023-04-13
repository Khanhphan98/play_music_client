<template>
  <HeadlessUiDialogModal
    :open-modal="diskUsageModal"
    @closeModal="diskUsageModal = false"
    :modal-options="{ footer: true }">
    <template #title>
      <span class="text-lg font-medium leading-6">Disk Space Consumption</span>
      <span class="text-base text-primary ml-2">({{ fakerDataDemo.account.userName }})</span>
    </template>
    <template #modalbody>
      <div class="overflow-x-auto">
        <Table bordered>
          <Table.Tbody>
            <Table.Tr v-for="(fk, fid) in fakerDataDemo.data" :key="fid">
              <Table.Td>
                {{ fid == 0 ? 'Mysql' : fid == 1 ? 'Quota' : '' }}
              </Table.Td>
              <Table.Td>
                {{ fk.files[0].size }}
              </Table.Td>
              <Table.Td>
                <Progress class="h-4">
                  <Progress.Bar
                    :style="{ width: Math.round(50 / (fid + 2)) + '%' }"
                    role="progressbar"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100">
                    {{ Math.round(50 / (fid + 2)) }}%
                  </Progress.Bar>
                </Progress>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </template>
  </HeadlessUiDialogModal>
</template>

<script setup lang="ts">
  import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Table from '@/base-components/Table';
  import Progress from '@/base-components/Progress';
  import { computed, ref } from 'vue';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';

  const props = defineProps({
    openClose: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {},
    },
  });
  const emit = defineEmits(['closeModal']);

  const diskUsageModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('closeModal', _vl),
  });
  const fakerDataDemo = computed(() => props.content as any[]);
</script>
