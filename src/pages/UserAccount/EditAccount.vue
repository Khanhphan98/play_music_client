<script setup lang="ts">
  import Button from '@/base-components/Button';
  import { FormSelect, FormLabel, FormInline } from '@/base-components/Form';
  import { computed, onMounted, PropType, reactive } from 'vue';
  import { IAccount, IActionAccount } from '@/model/interface/IAccount';
  import { useForm } from 'vee-validate';
  import { toFieldValidator } from '@vee-validate/zod';
  import { z } from 'zod';
  import { t } from '@/config/i18n';
  import { PackageStore } from '@/stores/package-store';
  import { IPackage } from '@/model/interface/IPackage';
  import { tryCallRequest } from '@/utils/my-function';
  import { defaultTimeoutSubmit } from '@/utils/my-variables';
  import { AccountStore } from '@/stores/account-store';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { MyStore } from '@/stores/my-store';
  import { IDataResponse } from '@/model/interface/IDataResponse';

  const props = defineProps({
    accountSelected: {
      type: Object as PropType<IAccount>,
      default: true,
    },
  });
  const accountStore = AccountStore();
  const packageStore = PackageStore();
  const myStore = MyStore();
  const accountSelected = computed(() => props.accountSelected as IAccount);
  const listPackage = computed(() => packageStore.listPackage as IDataResponse);
  //form data
  const formData = reactive({
    hostname: accountSelected.value.hostname,
    username: accountSelected.value.username,
    email: accountSelected.value.email,
    package_id: String(accountSelected.value.package.id),
  });
  //Schema validate
  const schema = toFieldValidator(
    z.object({
      package_id: z.string().min(1, t('alert.messages.required', { field: t('package') })),
    }),
  );
  //Form action
  const { handleSubmit, errors, isSubmitting } = useForm({
    initialValues: { package_id: formData.package_id },
    validationSchema: schema,
  });
  //Action method
  const submitForm = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      //init value
      const request = {
        new_package_id: Number(values.package_id),
        usernames: [accountSelected.value.username],
      } as IActionAccount;
      await accountStore.actionChangePackage(request);
      //change value package of user changed
      const newPackage = listPackage.value.data.find(
        (value: IPackage) => value.id === Number(values.package_id),
      );
      if (newPackage) {
        accountSelected.value.package = newPackage;
      }
      //alert success
      myStore.showToastMessage();
    });
  });
  onMounted(() => {
    tryCallRequest(async () => {
      //call request
      await packageStore.actionGetListPackage();
    });
  });
</script>

<template>
  <form class="bg-white dark:bg-darkmode-400" @submit="submitForm">
    <FormInline class="items-start" v-show="formData.hostname">
      <FormLabel htmlFor="hostname" class="sm:w-28"> {{ t('hostname') }}: </FormLabel>
      <div class="w-full flex-1">
        <p class="font-medium">{{ formData.hostname }}</p>
      </div>
    </FormInline>
    <FormInline class="items-start" :class="{ 'mt-5': formData.hostname }">
      <FormLabel htmlFor="username" class="sm:w-28"> {{ t('username') }}: </FormLabel>
      <div class="w-full flex-1">
        <p class="font-medium">{{ formData.username }}</p>
      </div>
    </FormInline>
    <FormInline class="items-start mt-5">
      <FormLabel htmlFor="email" class="sm:w-28"> {{ t('email') }}: </FormLabel>
      <div class="w-full flex-1">
        <p class="font-medium">{{ formData.email }}</p>
      </div>
    </FormInline>
    <FormInline class="items-start mt-5">
      <FormLabel htmlFor="package_id" class="sm:w-28"> {{ t('package') }}: </FormLabel>
      <FormSelect id="package_id" v-model="formData.package_id" name="package_id">
        <option disabled value="">{{ t('choose') }}</option>
        <option v-for="pkg in listPackage.data" :value="String(pkg.id)">{{ pkg.name }}</option>
      </FormSelect>
    </FormInline>
    <AlertCustom :errors="errors"></AlertCustom>
    <div class="mt-5 sm:ml-28 sm:pl-5 text-right">
      <Button type="submit" variant="primary" class="min-w-[7rem]" :disabled="isSubmitting">
        {{ t('button.save') }}
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
      </Button>
    </div>
  </form>
</template>
