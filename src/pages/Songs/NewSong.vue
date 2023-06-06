<script setup lang="ts">
  import Button from "@/base-components/Button";
  import Lucide from "@/base-components/Lucide";
  import { FormInput, FormLabel, FormInline, InputGroup, FormTextarea } from "@/base-components/Form";
  import { computed, onMounted, reactive, ref } from "vue";
  import { useForm } from "vee-validate";
  import AlertCustom from "@/base-components/iCustom/AlertCustom.vue";
  import { toFieldValidator } from "@vee-validate/zod";
  import { z } from "zod";
  import { t } from "@/config/i18n";
  import { defaultTimeoutSubmit, env } from "@/utils/my-variables";
  import LoadingIcon from "@/base-components/LoadingIcon/LoadingIcon.vue";
  import { handleUploadFile, tryCallRequest } from "@/utils/my-function";
  import { ISinger } from "@/model/interface/ISinger";
  import { useRoute } from "vue-router";
  import { ISong } from "@/model/interface/ISong";
  import { SongStore } from "@/stores/song-store";
  import TomSelect from "@/base-components/TomSelect";
  import { SingerStore } from "@/stores/singer-store";
  import { CountryStore } from "@/stores/country-menu";
  import { CategoryStore } from "@/stores/category-menu";
  import { ICountry } from "@/model/interface/ICountry";
  import { ICategory } from "@/model/interface/ICategory";
  import Tippy from "@/base-components/Tippy/Tippy.vue";
  import { IFileUpload } from "@/model/interface/IFileUpload";
  import { MediaStore } from "@/stores/media-store";
  import FileIcon from "@/base-components/FileIcon/FileIcon.vue";
  import router from "@/router";

  // init value global
  const route = useRoute();
  const songStore = SongStore();
  const singerStore = SingerStore();
  const countryStore = CountryStore();
  const categoryStore = CategoryStore();
  const mediaStore = MediaStore();
  const singers = computed(() => singerStore.singers as ISinger[]);
  const countries = computed(() => countryStore.countries as ICountry[]);
  const categories = computed(() => categoryStore.categories as ICategory[]);

  //form data
  const formData = reactive({
    id: "",
    name: "",
    release: "",
    time: 0,
    lyric: "",
    description: "",
    file_mp3: "",
    picture: "",
    categories: [],
    countries: [],
    singers: [],
  });
  const dataConvert = ref();
  //Schema validate
  const schema = toFieldValidator(
    z.object({
      name: z.string().nonempty(t("alert.messages.required", { field: t("name") })),
      lyric: z.string(),
      description: z.string(),
      categories: z.array(z.number({ required_error: t("category"), invalid_type_error: t("category") })),
      countries: z.array(z.number({ required_error: t("countries"), invalid_type_error: t("countries") })),
      singers: z.array(z.number({ required_error: t("singer"), invalid_type_error: t("singer") })),
    }),
  );
  //Form action
  const { handleSubmit, errors, isSubmitting, handleReset } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });

  // init value scope
  const showEdit = ref(false);
  const filePicture = ref<IFileUpload>({ path: "", filename: "", duration: "", size: "", type: "" });
  const fileMp3 = ref<IFileUpload>({ path: "", filename: "", duration: "", size: "", type: "" });
  const fileMp3Deleted = ref("");
  const filePictureDeleted = ref("");
  //Action method
  const submitForm = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      // init request
      const request = {
        id: formData.id,
        name: formData.name,
        release: formData.release,
        time: parseInt(fileMp3.value.duration),
        lyric: formData.lyric,
        description: formData.description,
        file_mp3: fileMp3.value.path,
        picture: filePicture.value.path,
        categories: formData.categories.map((c) => c),
        countries: formData.countries.map((c) => c),
        singers: formData.singers.map((s) => s),
      } as ISong;
      // call request save
      if (showEdit.value) {
        await songStore.update(request);
      } else {
        await songStore.save(request);
      }
      // redirect
      await router.push("/admin/songs");
    }).then(async () => {
      // check nếu có file đang xoá tạm thì call api xoá trên server
      await handleDeletedFileTemporary();
    });
  });

  async function searchSong(id: string) {
    await tryCallRequest(async () => {
      // init request
      const request = { id: id } as ISong;
      // call request
      const response = await songStore.search(request);
      if (response) {
        const songSearch = response.data as ISong;
        formData.id = songSearch.id;
        formData.name = songSearch.name;
        formData.release = songSearch.release;
        formData.time = songSearch.time;
        formData.lyric = songSearch.lyric;
        formData.description = songSearch.description;
        formData.categories = songSearch.categories.map((p) => p.id) as [];
        formData.singers = songSearch.singers.map((p) => p.id) as [];
        formData.countries = songSearch.countries.map((p) => p.id) as [];
        formData.file_mp3 = songSearch.file_mp3;
        formData.picture = songSearch.picture;
        // init value file
        fileMp3.value.path = songSearch.file_mp3;
        fileMp3.value.duration = String(songSearch.time);
        fileMp3.value.filename = String(songSearch.file_mp3.split("/").at(-1));
        filePicture.value.path = songSearch.picture;
        filePicture.value.filename = String(songSearch.picture.split("/").at(-1));
        // show edit view
        showEdit.value = true;
      }
    });
  }

  async function uploadFileMp3(event: any) {
    await tryCallRequest(async () => {
      // Create a cancel token source
      const file = event.target as HTMLInputElement;
      if (file && file.files && file.files.length > 0) {
        const response = await handleUploadFile(file.files[0]);
        if (response.data) {
          fileMp3.value = response.data as IFileUpload;
        }
      }
    });
  }

  async function uploadFilePicture(event: any) {
    await tryCallRequest(async () => {
      // Create a cancel token source
      const file = event.target as HTMLInputElement;
      if (file && file.files && file.files.length > 0) {
        const response = await handleUploadFile(file.files[0]);
        if (response.data) {
          filePicture.value = response.data as IFileUpload;
        }
      }
    });
  }

  async function handleDeletedFileTemporary() {
    if (fileMp3Deleted.value) {
      await mediaStore.removeFileMp3(fileMp3Deleted.value);
    }
    if (filePictureDeleted.value) {
      await mediaStore.removeFileImage(filePictureDeleted.value);
    }
  }

  async function deleteFile(isMp3: boolean) {
    await tryCallRequest(async () => {
      if (isMp3) {
        // Nếu là edit thì chỉ xoá tạm file
        if (showEdit.value) {
          // clean file upload
          fileMp3Deleted.value = fileMp3.value.filename;
          fileMp3.value = {} as IFileUpload;
          return;
        }
        // init value
        const filename = fileMp3.value.filename;
        // call request
        await mediaStore.removeFileMp3(filename);
        // clean file upload
        fileMp3.value = {} as IFileUpload;
      } else {
        // Nếu là edit thì chỉ xoá tạm file
        if (showEdit.value) {
          // clean file upload
          filePictureDeleted.value = filePicture.value.filename;
          filePicture.value = {} as IFileUpload;
          return;
        }
        // init value
        const filename = filePicture.value.filename;
        // call request
        await mediaStore.removeFileImage(filename);
        // clean file upload
        filePicture.value = {} as IFileUpload;
      }
    });
  }

  function convertJSONToString() {
    const data = JSON.parse(dataConvert.value);
    let result = "";
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const startTimeMs = parseInt(item.startTimeMs);
      const minutes = String(Math.floor(startTimeMs / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((startTimeMs % 60000) / 1000)).padStart(2, "0");
      const time = `${minutes}:${seconds}.00`;
      const words = item.words;
      result += `[${time}] ${words}\n`;
    }
    formData.lyric = result.trim();
  }

  const showConvert = ref(false);

  onMounted(async () => {
    await categoryStore.list();
    await countryStore.list();
    await singerStore.list();
    if (route.params.id) {
      await searchSong(String(route.params.id));
    }
  });
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5 -intro-y">
    <div class="col-span-10 md:col-span-8 lg:col-span-9">
      <form class="p-5 bg-white dark:bg-darkmode-900 shadow-md rounded" @submit="submitForm">
        <FormInline class="items-start">
          <FormLabel htmlFor="name" class="sm:w-28"> {{ t("name") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-name">
                <Lucide icon="Music2" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput
                v-model="formData.name"
                name="name"
                id="name"
                type="text"
                :placeholder="t('enter', { name: t('name') })"
                aria-describedby="icon-name" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="release" class="sm:w-28"> {{ t("release") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-release">
                <Lucide icon="CalendarDays" class="w-4 h-4" />
              </InputGroup.Text>
              <FormInput
                v-model="formData.release"
                name="release"
                id="release"
                type="date"
                :placeholder="t('release', { name: t('release') })"
                aria-describedby="icon-release" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="lyric" class="sm:w-28"> {{ t("lyric") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-lyric">
                <Lucide icon="Music" class="w-4 h-4" />
                <Tippy :content="t('convert')">
                  <Lucide
                    icon="Rotate3d"
                    class="w-4 h-4 mt-2"
                    :class="{ 'text-violet-500': showConvert }"
                    @click="showConvert = !showConvert" />
                </Tippy>
              </InputGroup.Text>
              <FormTextarea
                v-model="formData.lyric"
                :rows="5"
                name="lyric"
                class="rounded"
                id="lyric"
                type="text"
                :placeholder="t('enter', { name: t('lyric') })"
                aria-describedby="icon-lyric" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4" v-show="showConvert">
          <FormLabel htmlFor="lyric" class="sm:w-28"> {{ t("convert") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-lyric">
                <Lucide icon="Clipboard" class="w-4 h-4" />
              </InputGroup.Text>
              <FormTextarea
                v-model="dataConvert"
                :rows="5"
                name="convert"
                class="rounded"
                id="convert"
                type="text"
                :placeholder="t('enter', { name: t('convert') })"
                aria-describedby="icon-convert" />
            </InputGroup>
            <div class="ml-10 mt-3">
              <Button variant="outline-primary" type="button" @click="convertJSONToString">{{ t("convert") }}</Button>
            </div>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="description" class="sm:w-28"> {{ t("description") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-description">
                <Lucide icon="StickyNote" class="w-4 h-4" />
              </InputGroup.Text>
              <FormTextarea
                v-model="formData.description"
                :rows="5"
                name="description"
                class="rounded"
                id="description"
                type="text"
                :placeholder="t('enter', { name: t('description') })"
                aria-describedby="icon-description" />
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="category" class="sm:w-28"> {{ t("category") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-category">
                <Lucide icon="Banknote" class="w-4 h-4" />
              </InputGroup.Text>
              <TomSelect
                id="categories"
                name="categories"
                v-model="formData.categories"
                :options="{
                  placeholder: t('select_your_job', { job: t('category').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }"
                class="w-full"
                multiple>
                <option v-for="category in categories" :value="category.id" :key="category.id">
                  {{ category.name }}
                </option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="countries" class="sm:w-28"> {{ t("countries") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-countries">
                <Lucide icon="MapPin" class="w-4 h-4" />
              </InputGroup.Text>
              <TomSelect
                id="countries"
                name="countries"
                v-model="formData.countries"
                :options="{
                  placeholder: t('select_your_job', { job: t('countries').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }"
                class="w-full"
                multiple>
                <option v-for="country in countries" :value="country.id" :key="country.id">{{ country.name }}</option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="singers" class="sm:w-28"> {{ t("singer") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-singers">
                <Lucide icon="User" class="w-4 h-4" />
              </InputGroup.Text>
              <TomSelect
                id="singers"
                name="singers"
                v-model="formData.singers"
                :options="{
                  placeholder: t('select_your_job', { job: t('singer').toLowerCase() }),
                  plugins: { dropdown_header: { title: 'Select' } },
                }"
                class="w-full"
                multiple>
                <option v-for="singer in singers" :value="singer.id" :key="singer.id">{{ singer.name }}</option>
              </TomSelect>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="file_mp3" class="sm:w-28"> {{ t("file_mp3") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup class="w-full">
                <div class="w-full flex-1">
                  <InputGroup class="w-full">
                    <InputGroup.Text id="icon-file_mp3">
                      <Lucide icon="FileAudio" class="w-4 h-4" />
                    </InputGroup.Text>
                    <div
                      class="pt-4 w-full border-2 border-dashed rounded-md dark:border-darkmode-400 grid justify-center items-center">
                      <div v-if="fileMp3.filename" class="grid grid-row-reverse px-4 justify-center mb-3">
                        <div class="relative w-24 h-24 mb-2 cursor-pointer image-fit zoom-in">
                          <FileIcon class="w-full text-xl file" variant="file" type="MP3" />
                          <Tippy
                            as="div"
                            @click="deleteFile(true)"
                            :content="t('delete_file')"
                            class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger">
                            <Lucide icon="X" class="w-4 h-4" />
                          </Tippy>
                        </div>
                      </div>
                      <div v-else class="relative flex items-center px-4 pb-4 cursor-pointer">
                        <Lucide icon="FileAudio" class="w-4 h-4 mr-2" />
                        <span class="mr-1 text-primary">{{ t("upload_a_file") }}</span> {{ t("or_drag_and_drop") }}
                        <FormInput
                          type="file"
                          @change="uploadFileMp3($event)"
                          id="file_mp3"
                          ref="fileInputMp3"
                          class="absolute top-0 left-0 w-full h-full opacity-0"
                          name="file_mp3"
                          accept="audio/*" />
                      </div>
                    </div>
                  </InputGroup>
                </div>
              </InputGroup>
            </InputGroup>
          </div>
        </FormInline>
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="picture" class="sm:w-28"> {{ t("picture") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <div class="w-full flex-1">
                <InputGroup class="w-full">
                  <InputGroup.Text id="icon-picture">
                    <Lucide icon="FileImage" class="w-4 h-4" />
                  </InputGroup.Text>
                  <div
                    class="pt-4 w-full border-2 border-dashed rounded-md dark:border-darkmode-400 grid justify-center items-center">
                    <div v-if="filePicture.path" class="grid grid-row-reverse px-4 justify-center mb-3">
                      <div class="relative w-24 h-24 mb-2 cursor-pointer image-fit zoom-in">
                        <img
                          class="rounded-md"
                          :alt="filePicture.filename"
                          :src="env.backendServer + filePicture.path" />
                        <Tippy
                          as="div"
                          @click="deleteFile(false)"
                          :content="t('delete_file')"
                          class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger">
                          <Lucide icon="X" class="w-4 h-4" />
                        </Tippy>
                      </div>
                    </div>
                    <div v-else class="relative flex items-center px-4 pb-4 cursor-pointer">
                      <Lucide icon="Image" class="w-4 h-4 mr-2" />
                      <span class="mr-1 text-primary">{{ t("upload_a_file") }}</span> {{ t("or_drag_and_drop") }}
                      <FormInput
                        type="file"
                        @change="uploadFilePicture($event)"
                        id="file-upload"
                        ref="fileInputPicture"
                        class="absolute top-0 left-0 w-full h-full opacity-0"
                        name="file_picture"
                        accept="image/png, image/jpeg, image/jpg, image/gif" />
                    </div>
                  </div>
                </InputGroup>
              </div>
            </InputGroup>
          </div>
        </FormInline>
        <AlertCustom :errors="errors"></AlertCustom>
        <div class="mt-5 sm:ml-28 sm:pl-5 text-right">
          <Button variant="primary" class="min-w-[7rem]" type="submit" :disabled="isSubmitting">
            {{ showEdit ? $t("button.save") : $t("button.create") }}
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
          </Button>
        </div>
      </form>
    </div>
    <div class="col-span-2 md:col-span-4 lg:col-span-3 relative text-right">
      <div class="p-5 rounded bg-gray-200 dark:bg-darkmode-900 dark:text-slate-400 text-left md:block">
        <img class="w-full h-full" src="@/assets/images/songs/5.jpeg" alt="banner" />
      </div>
    </div>
  </div>
</template>
