<script setup lang="ts">
  import { FormInline, FormInput } from '@/base-components/Form';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Tippy from '@/base-components/Tippy';
  import { computed, reactive, ref } from 'vue';
  import { t } from '@/config/i18n';
  import FormLabel from '@/base-components/Form/FormLabel.vue';
  import { genPassword, tryCallRequest } from '@/utils/my-function';
  import { Form, useForm } from 'vee-validate';
  import { defaultTimeoutSubmit, validatePassword } from '@/utils/my-variables';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { toFieldValidator } from '@vee-validate/zod';
  import * as zod from 'zod';
  import { IAccount } from '@/model/interface/IAccount';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import { AccountStore } from '@/stores/account-store';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  //init props
  const props = defineProps({
    openModal: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
    },
  });
  //init value
  const emit = defineEmits(['closeModal']);
  const accountStore = AccountStore();
  const openModal = computed(() => props.openModal);
  const username = computed(() => props.username);
  const changePassSuccess = ref(false);
  const modalOptions = { footer: true } as ModalConfig;
  //Form data
  const formData = reactive({
    password: '',
    confirm: '',
  });
  //Schema validate
  const schema = toFieldValidator(
    zod
      .object({
        password: zod
          .string()
          .nonempty(t('alert.messages.required', { field: t('password') }))
          .regex(validatePassword, t('alert.messages.regex_password')),
        confirm: zod
          .string()
          .nonempty(t('alert.messages.required', { field: t('confirm', { name: t('password') }) })),
      })
      .refine((data) => data.password === data.confirm, {
        message: t('alert.messages.confirmed', {
          field: t('confirm', { name: t('password') }),
          target: t('password'),
        }),
        path: ['confirm'], // path of error
      }),
  );
  //Form action
  const { handleSubmit, errors, isSubmitting, handleReset } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });
  //Action method
  const actionChangePassword = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      //init request
      const request = { username: username.value, password: values.password } as IAccount;
      //call request
      await accountStore.actionResetChildPassword(request);
      changePassSuccess.value = true;
      handleReset();
    });
  });

  function closeModal() {
    emit('closeModal', false);
    changePassSuccess.value = false;
  }

  function actionGenPassword() {
    formData.password = genPassword();
  }
</script>

<template>
  <HeadlessUiDialogModal :open-modal="openModal" @closeModal="closeModal" :modal-options="modalOptions">
    <template #title>
      <span class="text-lg font-medium leading-6">{{ t('change', { name: t('password') }) }}</span>
      <span class="text-base text-primary ml-2">({{ username }})</span>
    </template>
    <template #modalbody>
      <form @submit="actionChangePassword">
        <div v-if="!changePassSuccess">
          <FormInline class="relative">
            <FormLabel htmlFor="new-password" class="sm:w-32">
              {{ t('new', { name: t('password') }) }}:
            </FormLabel>
            <FormInput
              id="new-password"
              name="password"
              type="text"
              :placeholder="t('enter', { name: t('new', { name: t('password') }) })"
              class="pr-10"
              v-model="formData.password" />
            <Tippy
              type="button"
              :as="Button"
              class="shadow-none border-none absolute right-0 inset-y-0"
              :content="t('generate', { name: t('password') })"
              @click="actionGenPassword">
              <Lucide icon="Key" class="w-4 h-4" />
            </Tippy>
          </FormInline>
          <FormInline class="mt-5">
            <FormLabel htmlFor="confirm-password" class="sm:w-32">
              {{ t('confirm', { name: t('new', { name: t('password') }) }) }}:
            </FormLabel>
            <FormInput
              id="confirm-password"
              type="text"
              name="confirm"
              :placeholder="t('enter', { name: t('confirm', { name: t('new', { name: t('password') }) }) })"
              v-model="formData.confirm" />
          </FormInline>
          <AlertCustom :errors="errors"></AlertCustom>
          <div class="text-right mt-8">
            <Button variant="secondary" class="min-w-[7rem] mr-3" @click="closeModal" type="reset">
              {{ t('button.cancel') }}
            </Button>
            <Button variant="primary" class="min-w-[7rem]" type="submit" :disabled="isSubmitting">
              {{ t('change', { name: t('password') }) }}
              <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
            </Button>
          </div>
        </div>
        <div v-else class="mt-4">
          <AlertCustom :message="t('change', t('password')) + ' ' + t('success')" />
          <div class="text-center mt-5">
            <Button variant="secondary" class="min-w-[7rem] mr-3" @click="closeModal" type="reset">
              {{ t('button.close') }}
            </Button>
          </div>
        </div>
      </form>
    </template>
  </HeadlessUiDialogModal>
</template>
