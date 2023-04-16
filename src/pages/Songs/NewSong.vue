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
  import { tryCallRequest } from '@/utils/my-function';
  import { ISinger } from '@/model/interface/ISinger';
  import { useRoute } from 'vue-router';
  import { ISong } from '@/model/interface/ISong';
  import { SongStore } from '@/stores/song-store';
  import TomSelect from '@/base-components/TomSelect';
  import { SingerStore } from '@/stores/singer-store';
  import { CountryStore } from '@/stores/country-menu';
  import { CategoryStore } from '@/stores/category-menu';
  import { ICountry } from '@/model/interface/ICountry';
  import { ICategory } from '@/model/interface/ICategory';

  // init value global
  const route = useRoute();
  const songStore = SongStore();
  const singerStore = SingerStore();
  const countryStore = CountryStore();
  const categoryStore = CategoryStore();
  const singers = computed(() => singerStore.singers as ISinger[]);
  const countries = computed(() => countryStore.countries as ICountry[]);
  const categories = computed(() => categoryStore.categories as ICategory[]);

  //form data
  const formData = reactive({
    id: '',
    name: '',
    release: '',
    time: 0,
    lyric: '',
    description: '',
    file_mp3: '',
    picture: '',
    categories: [],
    countries: [],
    singers: [],
  });
  //Schema validate
  const schema = toFieldValidator(
    z
      .object({
        name: z.string().nonempty(t('alert.messages.required', { field: t('name') })),
        release: z.string().datetime(),
        time: z.number({ required_error: t('time'), invalid_type_error: t('time')}),
        lyric: z.string().nonempty(t('alert.messages.required', { field: t('lyric') })),
        description: z.string().nonempty(t('alert.messages.required', { field: t('description') })),
        file_mp3: z.string().nonempty(t('alert.messages.required', { field: t('file_mp3') })),
        categories: z.array(z.number({ required_error: t('category'), invalid_type_error: t('category')})),
        countries: z.array(z.number({ required_error: t('countries'), invalid_type_error: t('countries')})),
        singers: z.array(z.number({ required_error: t('singer'), invalid_type_error: t('singer')})),
        picture: z.string(),
      })
  );
  //Form action
  const { handleSubmit, errors, isSubmitting, handleReset } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });

  // init value scope
  const showEdit = ref(false);

  //Action method
  const submitForm = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      // init request
      const request = {  } as ISong;
      // call request save
      if (showEdit.value) {
        await songStore.update(request)
      } else {
        await songStore.save(request);
        handleReset();
      }
    });
  });


  async function searchSinger (id: string) {
    await tryCallRequest(async () => {
      // init request
      // const request = { id: id } as ISinger;
      // // call request
      // const response = await songStore.search(request);
      // if (response) {
      //   // const singerSearch = response.data as ISinger;
      //   // formData.id = singerSearch.id;
      //   // formData.name = singerSearch.name;
      //   // formData.birthday = singerSearch.birthday;
      //   // formData.address = singerSearch.address;
      //   // formData.description = singerSearch.description;
      //   // formData.professions = singerSearch.professions.map(p => p.id) as [];
      //   // formData.avatar = singerSearch.avatar;
      //   // showEdit.value = true;
      // }
    })
  }


  onMounted(async () => {
    await categoryStore.list();
    await countryStore.list();
    await singerStore.list();
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
                <Lucide icon="Music2" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.name" name="name" id="name" type="text" :placeholder="t('enter', { name: t('name') })" aria-describedby="icon-name" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="release" class="sm:w-28"> {{ t('release') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-release">
                <Lucide icon="CalendarDays" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.release" name="release" id="release" type="date" :placeholder="t('release', { name: t('release') })" aria-describedby="icon-release" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="time" class="sm:w-28"> {{ t('time') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-time">
                <Lucide icon="Timer" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.time" name="time" id="time" type="text" :placeholder="t('enter', { name: t('time') })" aria-describedby="icon-time" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="lyric" class="sm:w-28"> {{ t('lyric') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-lyric">
                <Lucide icon="Music" class="w-4 h-4" />
              </InputGroup.Text>
              <FormTextarea v-model="formData.lyric" :rows="5" name="lyric" class='rounded' id="lyric" type="text" :placeholder="t('enter', { name: t('lyric') })" aria-describedby="icon-lyric" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
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
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="picture" class="sm:w-28"> {{ t('picture') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-picture">
                <Lucide icon="FileImage" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.picture" name="picture" id="picture" type="text" :placeholder="t('enter', { name: t('picture') })" aria-describedby="icon-picture" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="category" class="sm:w-28"> {{ t('category') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-category">
                <Lucide icon="Banknote" class="w-4 h-4" />
              </InputGroup.Text>
              <TomSelect id="categories" name="categories" v-model="formData.categories" :options="{
                  placeholder: t('select_your_job', { job: t('category').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }" class="w-full" multiple>
                <option v-for='category in categories' :value="category.id" :key='category.id'>{{ category.name }}</option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="countries" class="sm:w-28"> {{ t('countries') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-countries">
                <Lucide icon="MapPin" class="w-4 h-4" />
              </InputGroup.Text>
              <TomSelect id="countries" name="countries" v-model="formData.countries" :options="{
                  placeholder: t('select_your_job', { job: t('countries').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }" class="w-full" multiple>
                <option v-for='country in countries' :value="country.id" :key='country.id'>{{ country.name }}</option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="singers" class="sm:w-28"> {{ t('singer') }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-singers">
                <Lucide icon="User" class="w-4 h-4" />
              </InputGroup.Text>
              <TomSelect id="singers" name="singers" v-model="formData.singers" :options="{
                  placeholder: t('select_your_job', { job: t('singer').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }" class="w-full" multiple>
                <option v-for='singer in singers' :value="singer.id" :key='singer.id'>{{ singer.name }}</option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" >
          <FormLabel htmlFor="file_mp3" class="sm:w-28"> {{ t('file_mp3') }}:</FormLabel>
<!--          <input id="file-upload" type="file" ref="fileInput" />-->
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-file_mp3">
                <Lucide icon="FileAudio" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput v-model="formData.file_mp3" name="file_mp3" id="file_mp3" type="text" :placeholder="t('enter', { name: t('file_mp3') })" aria-describedby="icon-file_mp3" />
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
        <img class="w-full h-full" src="@/assets/images/banners/_%20(1).png"  alt='banner'/>
      </div>
    </div>
  </div>
</template>
