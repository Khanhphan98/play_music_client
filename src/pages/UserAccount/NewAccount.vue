<script setup lang="ts">
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { FormSelect, FormInput, FormLabel, FormInline, InputGroup } from '@/base-components/Form';
  import { computed, reactive, ref } from 'vue';
  import { PackageStore } from '@/stores/package-store';
  import { AccountStore } from '@/stores/account-store';
  import { IAccount, RoleUser } from '@/model/interface/IAccount';
  import { useForm } from 'vee-validate';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { toFieldValidator } from '@vee-validate/zod';
  import { z } from 'zod';
  import { t } from '@/config/i18n';
  import {
    defaultTimeoutSubmit,
    validateHostname,
    validatePassword,
    validateUsername,
  } from '@/utils/my-variables';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import { tryCallRequest } from '@/utils/my-function';
  import { IDataResponse } from '@/model/interface/IDataResponse';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  // BEGIN: variable
  const accountStore = AccountStore();
  const packageStore = PackageStore();
  const myAccount = computed(() => accountStore.myAccount as IAccount);
  const listPackage = computed(() => packageStore.listPackage as IDataResponse);
  const accInfo = ref(false);
  const createAccDialog = ref(false);
  // END: variable
  //form data
  const formData = reactive({
    hostname: '',
    username: '',
    password: '',
    email: '',
    package_id: '',
  });
  //Schema validate
  const regexHostname = new RegExp(validateHostname);
  const schema = toFieldValidator(
    z
      .object({
        hostname: z.string().optional(),
        username: z
          .string()
          .nonempty(t('alert.messages.required', { field: t('username') }))
          .regex(validateUsername, t('alert.messages.regex', { field: t('username') })),
        password: z
          .string()
          .nonempty(t('alert.messages.required', { field: t('password') }))
          .regex(validatePassword, t('alert.messages.regex_password')),
        email: z
          .string()
          .nonempty(t('alert.messages.required', { field: t('email') }))
          .email(t('alert.messages.email', { field: t('email') })),
        package_id: z.string().min(1, t('alert.messages.required', { field: t('package') })),
      })
      .refine(
        (data) => {
          if (myAccount.value.role_slug !== RoleUser.RESELLER) {
            return true;
          } else return !(myAccount.value.role_slug === RoleUser.RESELLER && !data.hostname);
        },
        {
          message: t('alert.messages.required', { field: t('hostname') }),
        },
      )
      .refine(
        (data) => {
          if (myAccount.value.role_slug !== RoleUser.RESELLER) {
            return true;
          } else return !!(data.hostname && regexHostname.test(data.hostname));
        },
        {
          message: t('alert.messages.regex', { field: t('hostname') }),
        },
      ),
  );
  //Form action
  const { handleSubmit, errors, isSubmitting, handleReset } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });
  //Action method
  const submitForm = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      //init request
      const request = {
        hostname: values.hostname,
        username: values.username,
        password: values.password,
        email: values.email,
        package_id: Number(values.package_id),
        child_role_slug: myAccount.value.child_role_slug,
      } as IAccount;
      //call request
      await accountStore.actionCreateUser(request);
      //alert
      createAccDialog.value = true;
    });
  });

  function actionResetForm() {
    handleReset();
    createAccDialog.value = false;
  }
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5 -intro-y">
    <div class="col-span-10 md:col-span-8 lg:col-span-9">
      <form class="p-5 bg-white dark:bg-darkmode-900 shadow-md rounded" @submit="submitForm">
        <!-- RESELLER MOI CO QUYEN THEM HOST NAME CHO ACCOUNT END USER -->
        <FormInline class="items-start" v-if="myAccount.role_slug === RoleUser.RESELLER">
          <FormLabel htmlFor="hostname" class="sm:w-28"> {{ $t('hostname') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-host-name">
                <Lucide icon="Globe" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput
                v-model="formData.hostname"
                name="hostname"
                id="hostname"
                type="text"
                :placeholder="`${$t('example')}: iNET.vn`"
                aria-describedby="icon-host-name" />
            </InputGroup>
            <div class="mt-2 text-slate-400">
              {{ $t('page_account_hostname') }}
            </div>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5">
          <FormLabel htmlFor="user-name" class="sm:w-28"> {{ $t('username') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-user-name">
                <Lucide icon="User" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput
                v-model="formData.username"
                name="username"
                id="username"
                type="text"
                placeholder="Enter username"
                aria-describedby="icon-user-name" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5">
          <FormLabel htmlFor="acc-password" class="sm:w-28"> {{ $t('password') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-acc-pass">
                <Lucide icon="Lock" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput
                autocomplete="off"
                v-model="formData.password"
                name="password"
                id="acc-password"
                type="password"
                placeholder="Enter password"
                aria-describedby="icon-acc-pass" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5">
          <FormLabel htmlFor="admin-email" class="sm:w-28"> {{ $t('email') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-admin-email">
                <Lucide icon="Mail" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput
                v-model="formData.email"
                name="email"
                id="email"
                type="text"
                placeholder="Enter admin email"
                aria-describedby="icon-admin-email" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5">
          <FormLabel htmlFor="package" class="sm:w-28"> {{ $t('package') }}:</FormLabel>
          <FormSelect id="package_id" v-model="formData.package_id" name="package_id">
            <option disabled value="">{{ $t('choose') }}</option>
            <option :value="String(item.id)" v-for="item in listPackage.data" :key="item.id">
              {{ item.name }}
            </option>
          </FormSelect>
        </FormInline>
        <!--        <FormInline class="items-start mt-5" v-if="myAccount.role_slug === RoleUser.RESELLER">-->
        <!--          <FormLabel htmlFor="server_ip" class="sm:w-28">-->
        <!--            {{ $t('server_ip') }}:-->
        <!--          </FormLabel>-->
        <!--          <FormSelect id="server_ip" v-model="formData.server_ip" name="server_ip">-->
        <!--            <option disabled value="">{{ $t('choose') }}</option>-->
        <!--            <option v-for="ip in listIps" :value="ip">{{ ip }}</option>-->
        <!--          </FormSelect>-->
        <!--        </FormInline>-->
        <AlertCustom :errors="errors"></AlertCustom>
        <div class="mt-5 sm:ml-28 sm:pl-5 text-right">
          <Button variant="primary" class="min-w-[7rem]" type="submit" :disabled="isSubmitting">
            {{ $t('button.create') }}
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
          </Button>
        </div>
      </form>
    </div>
    <div class="col-span-2 md:col-span-4 lg:col-span-3 relative text-right">
      <Button variant="secondary" class="w-full md:hidden" @click="accInfo = !accInfo">
        <Lucide v-if="!accInfo" icon="Info" class="w-5 h-5" />
        <Lucide v-else icon="X" class="w-5 h-5" />
      </Button>
      <div
        class="p-5 rounded bg-gray-200 dark:bg-darkmode-900 dark:text-slate-400 text-left md:block"
        :class="{ 'shadow-xl absolute right-0 min-w-[20rem] z-10 mt-2': accInfo, hidden: !accInfo }">
        <h3 class="font-medium text-xl mb-3">{{ $t('page_account_create_info') }}</h3>
        <ul>
          <li class="mb-3">
            {{ $t('page_account_create_info_des_1') }}
          </li>
          <li class="mb-3">
            <p>{{ $t('page_account_create_info_des_2') }}</p>
          </li>
          <li class="mb-3">
            <p>{{ $t('page_account_create_info_des_3') }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <headless-ui-dialog-modal
    :open-modal="createAccDialog"
    @closeModal="createAccDialog = false"
    @saveChange="actionResetForm">
    <template #modalbody>
      <div class="mt-3">
        <pre class="whitespace-pre-line bg-light dark:bg-darkmode-900 px-3.5 rounded mb-5">
          <code>
            {{ t('page_account_create_info') }}
            ========================================
            {{ t('page_login_header') }}:
            {{ t('hostname') }}: {{ formData.hostname }}
            {{ t('username') }}: {{ formData.username }}
            {{ t('password') }}: {{ formData.password }}
            {{ t('email') }}: {{ formData.email }}
          </code>
        </pre>
      </div>
    </template>
  </headless-ui-dialog-modal>
  <!-- END: Modal Content -->
</template>
