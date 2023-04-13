<script setup lang="ts">
  import Tippy from '@/base-components/Tippy';
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import { Popover } from '@/base-components/Headless';
  import Progress from '@/base-components/Progress';
  import { FormInput, FormSelect } from '@/base-components/Form';
  import TippyContent from '@/base-components/TippyContent';
  import { computed, onMounted, PropType, ref } from 'vue';
  import { IUserDatabase } from '@/model/interface/IDatabase';
  import { mediumStrengthPassword, validatePassword } from '@/utils/my-variables';
  import { t } from '@/config/i18n';

  const props = defineProps({
    userDatabaseSelected: {
      type: Object,
      required: true,
    },
  });
  const inputPassRef = ref({
    clsname: '',
    txt: '',
  });
  const userDatabaseSelected = computed(() => props.userDatabaseSelected as IUserDatabase);
  const lengthPassword = 32;
  const typePassword = ['alphabetical', 'alphanumeric', 'alphanumericssymbol'];
  const lengthSelected = ref(10);
  const typeSelected = ref(typePassword[2]);

  function genPassword() {
    let charset = '';
    let password = '';
    if (typeSelected.value === typePassword[0]) {
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (typeSelected.value === typePassword[1]) {
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    } else if (typeSelected.value === typePassword[2]) {
      charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    }
    for (let i = 1; i <= lengthSelected.value; i++) {
      const randomNumber = Math.floor(Math.random() * charset.length);
      password += charset[randomNumber];
    }
    userDatabaseSelected.value.password = password;
    StrengthChecker(password);
  }

  const copyPass = ref('');

  function copyPassword() {
    const copyText = userDatabaseSelected.value.password;
    navigator.clipboard.writeText(copyText);
    copyPass.value = copyText;
    setTimeout(() => {
      copyPass.value = '';
    }, 1200);
  }

  function StrengthChecker(PasswordParameter: string) {
    inputPassRef.value.clsname = '';
    // We then change the badge's color and text based on the password strength
    if (validatePassword.test(PasswordParameter)) {
      inputPassRef.value.clsname = 'bg-success w-full';
      inputPassRef.value.txt = t('strong');
    } else if (mediumStrengthPassword.test(PasswordParameter)) {
      inputPassRef.value.clsname = 'bg-warning w-1/2';
      inputPassRef.value.txt = t('medium');
    } else {
      inputPassRef.value.clsname = 'bg-danger w-1/5';
      inputPassRef.value.txt = t('weak');
    }
  }

  onMounted(() => {
    //reset password
    userDatabaseSelected.value.password = '';
  });
</script>

<template>
  <div class="change-password">
    <div class="flex items-start">
      <div class="min-w-[220px] grow">
        <FormInput
          type="text"
          :placeholder="t('enter', { name: t('password') }) + '...'"
          v-model="userDatabaseSelected.password"
          @change="StrengthChecker(userDatabaseSelected.password)"
          name="users.password" />
        <Progress class="h-3 mt-1" v-if="userDatabaseSelected.password">
          <Progress.Bar
            class="transition-all"
            role="progressbar"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
            :class="inputPassRef.clsname">
            {{ inputPassRef.txt }}
          </Progress.Bar>
        </Progress>
        <div class="py-3 px-5 mt-5 border border-success/50 rounded bg-success/10" v-if="copyPass">
          {{ t('copied', { name: t('password') }) }} <b>{{ copyPass }}</b>
        </div>
      </div>
      <div class="group-action flex items-center pl-2">
        <Tippy
          v-show="userDatabaseSelected.password"
          :as="Button"
          type="button"
          variant="secondary"
          :content="t('copy')"
          class="mr-2"
          @click="copyPassword()">
          <Lucide icon="Copy" class="h-5 w-5" />
        </Tippy>
        <Tippy
          :as="Button"
          type="button"
          variant="secondary"
          :content="t('generate_random_secure_password')"
          class="mr-2"
          @click="genPassword()">
          <Lucide icon="Key" class="h-5 w-5" />
        </Tippy>
        <TippyContent
          to="changeOptionsGeneratePassword"
          :options="{ trigger: 'mouseenter focus', theme: 'dark' }">
          {{ t('choose') }}
        </TippyContent>
        <Popover class="inline-block" v-slot="{ close }">
          <Popover.Button :as="Button" variant="secondary" data-tooltip="changeOptionsGeneratePassword">
            <Lucide icon="Cog" class="w-5 h-5" />
          </Popover.Button>
          <Popover.Panel>
            <div class="p-2 w-40">
              <div>
                <FormSelect name="length_password_select" v-model="lengthSelected">
                  <option v-for="length in lengthPassword" :value="length">
                    {{ t('length') }} {{ length }}
                  </option>
                </FormSelect>
              </div>
              <div class="mt-3">
                <FormSelect name="type_password_select" v-model="typeSelected">
                  <option v-for="item in typePassword" :value="item">
                    {{ t('type', { name: t(item) }) }}
                  </option>
                </FormSelect>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  </div>
</template>
