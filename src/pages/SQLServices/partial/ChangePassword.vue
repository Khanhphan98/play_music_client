<script setup lang="ts">
  import Tippy from '@/base-components/Tippy';
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import { Dialog, Popover } from '@/base-components/Headless';
  import Progress from '@/base-components/Progress';
  import { FormInput, FormLabel, FormSelect } from '@/base-components/Form';
  import TippyContent from '@/base-components/TippyContent';
  import { computed, reactive, ref } from 'vue';

  const props = defineProps({
    openClose: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {},
    },
  });
  const emit = defineEmits(['update:openClose']);
  const inputPassRef = ref({
    clsname: '',
    txt: '',
  });

  const changePasswordModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });
  const changePasswordContent = computed(() => props.content);

  const state = reactive({
    password: '',
  });
  const rules = computed(() => {
    return {
      password: {},
    };
  });

  function savePassword() {
    changePasswordModal.value = false;
  }

  function genPassword() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    state.password = password;
    StrengthChecker(password);
  }

  const copyPass = ref('');
  function copyPassword() {
    const copyText = state.password;
    navigator.clipboard.writeText(copyText);
    copyPass.value = copyText;
    setTimeout(() => {
      copyPass.value = '';
    }, 1200);
  }

  const strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
  const mediumPassword = new RegExp(
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))',
  );

  function StrengthChecker(PasswordParameter) {
    inputPassRef.value.clsname = '';
    // We then change the badge's color and text based on the password strength
    if (strongPassword.test(PasswordParameter)) {
      inputPassRef.value.clsname = 'bg-success w-full';
      inputPassRef.value.txt = 'Strong';
    } else if (mediumPassword.test(PasswordParameter)) {
      inputPassRef.value.clsname = 'bg-warning w-1/2';
      inputPassRef.value.txt = 'Medium';
    } else {
      inputPassRef.value.clsname = 'bg-danger w-1/5';
      inputPassRef.value.txt = 'Weak';
    }
  }
</script>

<template>
  <div class="change-password">
    <div class="flex items-start">
      <div class="min-w-[220px] grow">
        <FormInput
          type="text"
          placeholder="Enter password..."
          v-model="state.password"
          :value="state.password"
          @input="StrengthChecker(state.password)" />
        <Progress class="h-3 mt-1" v-if="state.password">
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
          Đã copy password <b>{{ copyPass }}</b>
        </div>
      </div>
      <div class="group-action flex items-center pl-2">
        <Tippy
          v-show="state.password"
          :as="Button"
          type="button"
          variant="secondary"
          content="Copy password"
          class="mr-2"
          @click="copyPassword()">
          <Lucide icon="Copy" class="h-5 w-5" />
        </Tippy>
        <Tippy
          :as="Button"
          type="button"
          variant="secondary"
          content="Generate random secure password"
          class="mr-2"
          @click="genPassword()">
          <Lucide icon="Key" class="h-5 w-5" />
        </Tippy>
        <TippyContent
          to="changeOptionsGeneratePassword"
          :options="{ trigger: 'mouseenter focus', theme: 'dark' }">
          Options
        </TippyContent>
        <Popover class="inline-block" v-slot="{ close }">
          <Popover.Button :as="Button" variant="secondary" data-tooltip="changeOptionsGeneratePassword">
            <Lucide icon="Cog" class="w-5 h-5" />
          </Popover.Button>
          <Popover.Panel>
            <div class="p-2 w-40">
              <div>
                <FormSelect>
                  <option v-for="op in 15">Length {{ op }}</option>
                </FormSelect>
              </div>
              <div class="mt-3">
                <FormSelect>
                  <option value="alphabe">Type Alphabetical</option>
                  <option value="alphanumer">Type Alphanumeric</option>
                  <option value="alphanumersymbol">Type Alphanumerics + Symbol</option>
                </FormSelect>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  </div>
</template>
