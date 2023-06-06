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

  //form data
  const dataConvert = ref();
  //Schema validate

  // init value scope

  function convertJson() {}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5 -intro-y">
    <div class="col-span-10 md:col-span-8 lg:col-span-9">
      <form class="p-5 bg-white dark:bg-darkmode-900 shadow-md rounded">
        <FormInline class="items-start mt-4">
          <FormLabel htmlFor="lyric" class="sm:w-28"> {{ t("convert") }}:</FormLabel>
          <div class="w-full flex-1">
            <InputGroup class="w-full">
              <InputGroup.Text id="icon-lyric">
                <Lucide icon="Music" class="w-4 h-4" />
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
          </div>
        </FormInline>
        <div class="mt-5 sm:ml-28 sm:pl-5 text-right">
          <Button variant="primary" class="min-w-[7rem]" type="button" @click="convertJson">
            {{ t("convert") }}
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
