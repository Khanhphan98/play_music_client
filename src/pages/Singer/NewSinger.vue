<script setup lang="ts">
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { FormInput, FormLabel, FormInline, InputGroup, FormTextarea } from '@/base-components/Form';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useForm } from 'vee-validate';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { toFieldValidator } from '@vee-validate/zod';
  import { z } from 'zod';
  import { t } from '@/config/i18n';
  import { defaultTimeoutSubmit, env } from '@/utils/my-variables';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import { handleUploadFile, tryCallRequest } from '@/utils/my-function';
  import { SingerStore } from '@/stores/singer-store';
  import { ProfessionStore } from '@/stores/profession-store';
  import { ISinger } from '@/model/interface/ISinger';
  import { IProfession } from '@/model/interface/IProfession';
  import { useRoute } from 'vue-router';
  import TomSelect from '@/base-components/TomSelect';
  import Tippy from '@/base-components/Tippy/Tippy.vue';
  import { IFileUpload } from '@/model/interface/IFileUpload';
  import { MediaStore } from '@/stores/media-store';
  import router from '@/router';

  // init value global
  const route = useRoute();
  const singerStore = SingerStore();
  const professionStore = ProfessionStore();
  const mediaStore = MediaStore();
  const professions = computed(() => professionStore.professions as IProfession[]);
  //form data
  const formData = reactive({
    id: '',
    name: '',
    birthday: '',
    address: '',
    professions: [],
    description: '',
    avatar: ''
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

  // init value scope
  const showEdit = ref(false);
  const fileUpload = ref<IFileUpload>({ path: '', filename: '', duration: '', size: '', type: '' });

  //Action method
  const submitForm = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      // init request
      const request = {
        id: formData.id,
        name: values.name,
        birthday: values.birthday,
        address: values.address,
        professions: formData.professions.map(p => p),
        description: formData.description,
        avatar: fileUpload.value.path
      } as ISinger;
      // call request save
      if (showEdit.value) {
        await singerStore.update(request)
      } else {
        await singerStore.save(request);
      }
      await router.push('/admin/singer')
    });
  });


  async function searchSinger (id: string) {
    await tryCallRequest(async () => {
      // init request
      const request = { id: id } as ISinger;
      // call request
      const response = await singerStore.search(request);
      if (response) {
        const singerSearch = response.data as ISinger;
        formData.id = singerSearch.id;
        formData.name = singerSearch.name;
        formData.birthday = singerSearch.birthday;
        formData.address = singerSearch.address;
        formData.description = singerSearch.description;
        formData.professions = singerSearch.professions.map(p => p.id) as [];
        formData.avatar = singerSearch.avatar;
        fileUpload.value.path = singerSearch.avatar;
        fileUpload.value.filename = String(singerSearch.avatar.split('/').at(-1));
        showEdit.value = true;
      }
    })
  }

  async function chooseFiles(event: any) {
    await tryCallRequest(async () => {
      // Create a cancel token source
      const file = event.target as HTMLInputElement;
      if (file && file.files && file.files.length > 0) {
        const response = await handleUploadFile(file.files[0])
        if (response.data) {
          fileUpload.value = response.data as IFileUpload;
        }
      }
    })
  }

  async function deleteFile() {
    await tryCallRequest(async () => {
      if (fileUpload.value.filename) {
        // init value
        const filename = fileUpload.value.filename;
        // call request
        await mediaStore.removeFileImage(filename);
        // clean file upload
        fileUpload.value = {} as IFileUpload;
      }
    })
  }

  onMounted(async () => {
    await professionStore.list();
    if (route.params.id) {
      await searchSinger(String(route.params.id));
    }
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
              <FormTextarea v-model="formData.description" :rows="5" name="description" class='rounded' id="description" type="text" :placeholder="t('enter', { name: t('description') })" aria-describedby="icon-description" />
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
              <TomSelect id="professions" name="professions" v-model="formData.professions" :options="{
                  placeholder: t('select_your_job', { job: t('profession').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }" class="w-full" multiple>
                <option v-for='profession in professions' :value="profession.id" :key='profession.id'>{{ profession.name }}</option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-5">
          <FormLabel htmlFor="avatar" class="sm:w-28"> {{ t('avatar') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-avatar">
                <Lucide icon="FileImage" class="w-4 h-4" />
              </InputGroup.Text>
              <div class="pt-4 w-full border-2 border-dashed rounded-md dark:border-darkmode-400 grid justify-center items-center">
                <div v-if='fileUpload.path' class="grid grid-row-reverse px-4 justify-center mb-3">
                  <div class="relative w-24 h-24 mb-2 cursor-pointer image-fit zoom-in">
                    <img class="rounded-md" :alt="fileUpload.filename" :src="env.backendServer + fileUpload.path" />
                    <Tippy as="div" @click='deleteFile' :content="t('delete_file')" class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger">
                      <Lucide icon="X" class="w-4 h-4" />
                    </Tippy>
                  </div>
                </div>
                <div v-else class="relative flex items-center px-4 pb-4 cursor-pointer">
                  <Lucide icon="Image" class="w-4 h-4 mr-2" />
                  <span class="mr-1 text-primary">{{ t('upload_a_file') }}</span> {{ t('or_drag_and_drop') }}
                  <FormInput type="file" @change="chooseFiles($event)" id="file-upload" ref="fileInput" class="absolute top-0 left-0 w-full h-full opacity-0" name=''/>
                </div>
              </div>
            </InputGroup>
          </div>
        </FormInline>
        <AlertCustom :errors="errors"></AlertCustom>
        <div class="mt-5 sm:ml-28 sm:pl-5 text-right">
          <Button variant="primary" class="min-w-[7rem]" type="submit" :disabled="isSubmitting">
            {{ showEdit ? $t('button.save') : $t('button.create') }}
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
          </Button>
        </div>
      </form>
    </div>
    <div class="col-span-2 md:col-span-4 lg:col-span-3 relative text-right">
      <div class="p-5 rounded bg-gray-200 dark:bg-darkmode-900 dark:text-slate-400 text-left md:block">
        <img class="w-full h-full" src="@/assets/images/banners/1.png"  alt='banner'/>
      </div>
    </div>
  </div>
</template>
