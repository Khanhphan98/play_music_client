<script setup lang="ts">
  import DarkModeSwitcher from '@/components/DarkModeSwitcher';
  import { FormInput } from '@/base-components/Form';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { reactive, ref } from 'vue';
  import { Form, useForm } from 'vee-validate';
  import NotificationToastify from '@/base-components/iCustom/NotificationCustom/Main.vue';
  import { toFieldValidator } from '@vee-validate/zod';
  import * as zod from 'zod';
  import { t } from '@/config/i18n';
  import { defaultTimeoutSubmit } from '@/utils/my-variables';
  import { tryCallRequest } from '@/utils/my-function';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import { UserStore } from '@/stores/user-store';
  import { IUser } from '@/model/interface/IUser';
  //Store
  const userStore = UserStore();
  //Variables
  const passView = ref(false);
  //form data
  const formData = reactive({
    username: '',
    password: '',
  });
  //schema
  const schema = toFieldValidator(
    zod.object({
      username: zod.string().nonempty(t('alert.messages.required', { field: t('username') })),
      password: zod.string().nonempty(t('alert.messages.required', { field: t('password') })),
    }),
  );
  //Form action
  const { handleSubmit, errors, isSubmitting, handleReset } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });
  //Action method
  const submitLogin = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      // init vlue
      const request = { username: values.username, password: values.password } as IUser;
      // call api
      await userStore.login(request);
      // reset form
      handleReset();
    });
  });
</script>

<template>
  <div class="flex items-center justify-center min-h-screen max-h-screen py-14">
    <div class="max-w-screen-md mx-auto">
      <div class="rounded bg-white/30 dark:bg-primary shadow-xl overflow-hidden">
        <div class="grid grid-cols-12 min-h-[50vh]">
          <div class="col-span-12 md:col-span-6">
            <div class="relative h-full">
              <img class="w-full h-full" src="@/assets/images/banners/banner.jpeg" />
            </div>
          </div>
          <div class="col-span-12 md:col-span-6 bg-white dark:bg-darkmode-400">
            <div class="py-10 px-6">
              <h1 class="text-2xl text-gray-500 dark:text-gray-400">Listen to all songs in one</h1>
              <form class="mt-5" @submit="submitLogin">
                <div>
                  <label class="text-slate-500 dark:text-slate-400" for="username">{{ $t('username') }} *</label>
                  <FormInput
                    name="username"
                    id="username"
                    type="text"
                    placeholder="ex: admin"
                    v-model="formData.username" />
                </div>
                <div class="mt-3 relative">
                  <label class="text-slate-500 dark:text-slate-400" for="password">{{ $t('password') }} *</label>
                  <FormInput
                    name="password"
                    id="password"
                    :type="!passView ? 'password' : 'text'"
                    v-model="formData.password" />
                  <Button
                    type="button"
                    class="absolute right-0 top-5 border-none shadow-none text-slate-500"
                    @click="passView = !passView">
                    <Lucide icon="Eye" class="w-5 h-5" v-if="!passView" />
                    <Lucide icon="EyeOff" class="w-5 h-5" v-else />
                  </Button>
                </div>
                <AlertCustom :errors="errors"></AlertCustom>
                <div class="mt-5">
                  <Button class="w-full" rounded variant="primary" type="submit" :disabled="isSubmitting">
                    {{ $t('button.login') }}
                    <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-10 max-w-xs mx-auto">
        <p class="mt-5 text-white/60">
          <small>{{ $t('page_login_footer') }}</small>
        </p>
      </div>
    </div>
  </div>
  <Button type="button" variant="secondary" rounded class="fixed top-5 right-5 p-0 h-12 w-12">
    <DarkModeSwitcher class="h-full w-full" />
  </Button>
  <NotificationToastify />
</template>

<style lang="scss" scoped>
  .i-panel {
    &.dark {
      input {
        border-color: rgba(white, 0.2);
      }
    }
  }
</style>
