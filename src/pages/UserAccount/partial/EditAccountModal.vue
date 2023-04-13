<script setup lang="ts">
  import EditAccount from '@/pages/UserAccount/EditAccount.vue';
  import { computed, PropType } from 'vue';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { t } from '@/config/i18n';
  import { IAccount } from '@/model/interface/IAccount';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  const props = defineProps({
    openModal: {
      type: Boolean,
      default: true,
    },
    accountSelected: {
      type: Object as PropType<IAccount>,
      default: true,
    },
  });
  const emit = defineEmits(['openModal']);
  const openModal = computed({
    get: () => props.openModal,
    set: (_vl) => emit('openModal'),
  });
  const accountSelected = computed(() => props.accountSelected as IAccount);
  const modalEditAccountOptions = { footer: true } as ModalConfig;
</script>

<template>
  <HeadlessUiDialogModal
    :open-modal="openModal"
    @closeModal="openModal = false"
    :modal-options="modalEditAccountOptions">
    <template #title>
      {{ t('edit_account') }}
    </template>
    <template #modalbody>
      <EditAccount :account-selected="accountSelected" />
    </template>
  </HeadlessUiDialogModal>
</template>
