<script setup lang="ts">
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { FormSelect, FormInput, FormLabel, FormInline, InputGroup, FormTextarea } from '@/base-components/Form';
  import { computed, onMounted, reactive } from 'vue';
  import { useForm } from 'vee-validate';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { toFieldValidator } from '@vee-validate/zod';
  import { z } from 'zod';
  import { t } from '@/config/i18n';
  import { defaultTimeoutSubmit } from '@/utils/my-variables';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import { tryCallRequest } from '@/utils/my-function';
  import { SingerStore } from '@/stores/singer-store';
  import { ProfessionStore } from '@/stores/profession-store';
  import { ISinger } from '@/model/interface/ISinger';
  import { IProfession } from '@/model/interface/IProfession';

  // init value global
  const singerStore = SingerStore();
  const professionStore = ProfessionStore();
  const professions = computed(() => professionStore.professions as IProfession[]);

  //form data
  const formData = reactive({
    id: '',
    name: '',
    birthday: '',
    address: '',
    professions: [0],
    description: '',
  });
  //Schema validate
  const schema = toFieldValidator(
    z
      .object({
        name: z.string().nonempty(t('alert.messages.required', { field: t('name') })),
        birthday: z.string().nonempty(t('alert.messages.required', { field: t('birthday') })),
        address: z.string().nonempty(t('alert.messages.required', { field: t('address') })),
        professions: z.array(z.number({ required_error: t('profession'), invalid_type_error: t('profession')})),
        description: z.string(),
      })
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
      // init request
      const request = { name: values.name, birthday: values.birthday, address: values.address, professions: values.professions, description: formData.description } as ISinger;
      // call request save
      await singerStore.save(request);
      // reset
      reset();
    });
  });

  function reset() {
    handleReset();
  }

  onMounted(() => {
    professionStore.list();
  })

</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5 -intro-y">
    <div class="col-span-10 md:col-span-8 lg:col-span-9">
      <form class="p-5 bg-white dark:bg-darkmode-900 shadow-md rounded" @submit="submitForm">
        <FormInline class="items-start" >
          <FormLabel htmlFor="name" class="sm:w-28"> {{ t('name') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-name">
                <Lucide icon="User" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.name" name="name" id="name" type="text" :placeholder="t('enter', { name: t('name') })" aria-describedby="icon-name" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5" >
          <FormLabel htmlFor="birthday" class="sm:w-28"> {{ t('birthday') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-birthday">
                <Lucide icon="CalendarDays" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.birthday" name="birthday" id="birthday" type="date" :placeholder="t('enter', { name: t('birthday') })" aria-describedby="icon-birthday" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5" >
          <FormLabel htmlFor="address" class="sm:w-28"> {{ t('address') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-address">
                <Lucide icon="MapPin" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.address" name="address" id="address" type="text" :placeholder="t('enter', { name: t('address') })" aria-describedby="icon-address" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5" >
          <FormLabel htmlFor="description" class="sm:w-28"> {{ t('description') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-description">
                <Lucide icon="StickyNote" class="w-4 h-4" />
              </InputGroup.Text>
              <FormTextarea v-model="formData.description" name="description" class='rounded' id="description" type="text" :placeholder="t('enter', { name: t('description') })" aria-describedby="icon-description" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5">
          <FormLabel htmlFor="professions" class="sm:w-28"> {{ t('profession') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-professions">
                <Lucide icon="Box" class="w-4 h-4" />
              </InputGroup.Text>
              <FormSelect id="professions" v-model="formData.professions" name="professions">
                <option disabled value="0">{{ $t('choose') }}</option>
                <option v-for='profession in professions' :value="[profession.id]" :key='profession.name'>{{ profession.name }}</option>
              </FormSelect>
            </InputGroup>
          </div>
        </FormInline>
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
      <div class="p-5 rounded bg-gray-200 dark:bg-darkmode-900 dark:text-slate-400 text-left md:block">
        <img class="w-full h-full" src="@/assets/images/banners/_%20(1).png"  alt='banner'/>
      </div>
    </div>
  </div>
</template>
