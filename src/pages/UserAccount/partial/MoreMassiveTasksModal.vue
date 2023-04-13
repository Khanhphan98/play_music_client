<script setup lang="ts">
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { computed, PropType, reactive, ref, watch } from 'vue';
  import { FormSelect, FormInline, FormLabel } from '@/base-components/Form';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  import { t } from '@/config/i18n';
  import { IAccount, IActionAccount } from '@/model/interface/IAccount';
  import { IPackage } from '@/model/interface/IPackage';
  import { toFieldValidator } from '@vee-validate/zod';
  import { z } from 'zod';
  import { useForm } from 'vee-validate';
  import { defaultTimeoutSubmit } from '@/utils/my-variables';
  import { tryCallRequest } from '@/utils/my-function';
  import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
  import { AccountStore } from '@/stores/account-store';
  import { MyStore } from '@/stores/my-store';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';

  const props = defineProps({
    openClose: {
      type: Boolean,
      default: false,
    },
    listChildUser: {
      type: Array as PropType<IAccount[]>,
      required: true,
    },
    listPackage: {
      type: Array as PropType<IPackage[]>,
      required: true,
    },
  });
  const emit = defineEmits(['openClose']);
  const openClose = computed({
    get: () => props.openClose,
    set: (_vl) => emit('openClose', _vl),
  });
  //dattqh start
  const myStore = MyStore();
  const accountStore = AccountStore();
  const massiveTasksOptions = { size: '3xl', footer: true } as ModalConfig;
  const actionList = ['change_package', 'suspend_account', 'unsuspend_account', 'delete_account'];
  const formData = reactive({
    actionSelected: '',
    packageSelected: '',
  });
  const listChildUser = computed(() => props.listChildUser as IAccount[]);
  const listPackage = computed(() => props.listPackage as IPackage[]);
  const availableUserList = ref<IAccount[]>([]);
  const enableUserList = ref<IAccount[]>([]);
  const availableUserSelected = ref<string[]>([]);
  const enableUserSelected = ref<string[]>([]);
  const schema = toFieldValidator(
    z
      .object({
        actionSelected: z.string().nonempty(t('alert.messages.required', { field: t('action') })),
        packageSelected: z.string(),
      })
      .refine(
        (data) => {
          if (data.actionSelected !== 'change_package') {
            return true;
          } else return !(data.actionSelected === 'change_package' && !data.packageSelected);
        },
        { message: t('alert.messages.required', { field: t('package') }), path: ['packageSelected'] },
      ),
  );
  //Form action
  const { handleSubmit, isSubmitting, errors, handleReset } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });
  //Action method
  const submitForm = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, defaultTimeoutSubmit));
    await tryCallRequest(async () => {
      //init value
      const userNameList = enableUserList.value.map((value) => value.username);
      //init request if change package
      if (values.actionSelected === 'change_package') {
        //init request
        const request = {
          new_package_id: Number(formData.packageSelected),
          usernames: [...userNameList],
        } as IActionAccount;
        //call request
        await accountStore.actionChangePackage(request);
      }
      //init request if suspend account
      else if (values.actionSelected === 'suspend_account') {
        //init request
        const request = { usernames: [...userNameList] } as IActionAccount;
        //call request
        await accountStore.actionSuspendUser(request);
      }
      //init request if resume account
      else if (values.actionSelected === 'unsuspend_account') {
        //init request
        const request = { usernames: [...userNameList] } as IActionAccount;
        //call request
        await accountStore.actionResumeUser(request);
      }
      //init request if resume account
      else if (values.actionSelected === 'delete_account') {
        //init request
        const request = { usernames: [...userNameList] } as IActionAccount;
        //call request
        await accountStore.actionDeleteChildUser(request);
      }
      //alert success
      myStore.showToastMessage();
      //reset selected
      resetAllValueExceptAvailableUserList();
      //reset submit
      handleReset();
      //reload data
      accountStore.actionListChildUser().then();
    });
  });

  function resetAllValueExceptAvailableUserList() {
    enableUserList.value = [];
    formData.packageSelected = '';
    resetSelected();
  }

  function resetSelected() {
    availableUserSelected.value = [];
    enableUserSelected.value = [];
  }

  function onChangeActionSelected() {
    const newAvailableUserList = [] as IAccount[];
    if (formData.actionSelected === 'change_package' || formData.actionSelected === 'delete_account') {
      newAvailableUserList.push(...listChildUser.value);
    } else if (formData.actionSelected === 'suspend_account') {
      for (const item of listChildUser.value) {
        if (!item.suspend) {
          newAvailableUserList.push(item);
        }
      }
    } else if (formData.actionSelected === 'unsuspend_account') {
      for (const item of listChildUser.value) {
        if (item.suspend) {
          newAvailableUserList.push(item);
        }
      }
    }
    //add to list
    availableUserList.value = newAvailableUserList;
    //reset value
    resetAllValueExceptAvailableUserList();
  }

  function moveAvailableSelected() {
    const activeUserSelectedSet = new Set(availableUserSelected.value);
    const newActiveUserList = availableUserList.value.filter(
      (user) => !activeUserSelectedSet.has(user.username),
    );
    const movedUsers = availableUserList.value.filter((user) => activeUserSelectedSet.has(user.username));
    enableUserList.value.push(...movedUsers);
    availableUserList.value = newActiveUserList;
    resetSelected();
  }

  function moveEnableSelected() {
    const deActiveUserSelectedSet = new Set(enableUserSelected.value);
    const newDeActiveUserList = enableUserList.value.filter(
      (user) => !deActiveUserSelectedSet.has(user.username),
    );
    const movedUsers = enableUserList.value.filter((user) => deActiveUserSelectedSet.has(user.username));
    availableUserList.value.push(...movedUsers);
    enableUserList.value = newDeActiveUserList;
    resetSelected();
  }

  function moveAllAvailableSelected() {
    enableUserList.value.push(...availableUserList.value);
    availableUserList.value = [];
    resetSelected();
  }

  function moveAllEnableSelected() {
    availableUserList.value.push(...enableUserList.value);
    enableUserList.value = [];
    resetSelected();
  }

  watch(
    () => openClose.value,
    (value, oldValue) => {
      if (oldValue && !value) {
        //reset value
        availableUserList.value = listChildUser.value;
        resetAllValueExceptAvailableUserList();
        handleReset();
      }
    },
  );

  watch(
    () => listChildUser.value,
    (value) => {
      if (value) {
        //reset value
        availableUserList.value = value;
      }
    },
  );
  //dattqh end
</script>

<template>
  <HeadlessUiDialogModal
    :open-modal="openClose"
    @closeModal="openClose = false"
    :modal-options="massiveTasksOptions">
    <template #title>
      {{ t('massive_task') }}
    </template>
    <template #modalbody>
      <form @submit="submitForm">
        <FormSelect
          v-model="formData.actionSelected"
          id="actionSelected"
          name="actionSelected"
          @change="onChangeActionSelected">
          <option disabled value="">{{ t('choose') }}</option>
          <option v-for="action in actionList" :value="action">
            {{ t(action) }}
          </option>
        </FormSelect>
        <div class="grid grid-cols-12 gap-6 mt-5" v-if="formData.actionSelected !== ''">
          <div class="col-span-5">
            <FormSelect class="h-full" v-model="availableUserSelected" multiple name="availableUserSelected">
              <option v-for="activeUser in availableUserList" :value="activeUser.username">
                {{ activeUser.username + ' --> ' + activeUser.package.name }}
              </option>
            </FormSelect>
          </div>
          <div class="col-span-2">
            <div class="flex flex-col items-center min-h-[30vh]">
              <Button variant="secondary" class="mb-5" @click="moveAvailableSelected" type="button">
                <Lucide icon="ChevronRight" class="w-5 h-5" />
              </Button>
              <Button variant="secondary" class="mb-5" @click="moveAllAvailableSelected" type="button">
                <Lucide icon="ChevronsRight" class="w-5 h-5" />
              </Button>
              <Button variant="secondary" class="mb-5" @click="moveEnableSelected" type="button">
                <Lucide icon="ChevronLeft" class="w-5 h-5" />
              </Button>
              <Button variant="secondary" @click="moveAllEnableSelected" type="button">
                <Lucide icon="ChevronsLeft" class="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div class="col-span-5">
            <FormSelect class="h-full" v-model="enableUserSelected" multiple name="enableUserSelected">
              <option v-for="deactiveUser in enableUserList" :value="deactiveUser.username">
                {{ deactiveUser.username + ' --> ' + deactiveUser.package.name }}
              </option>
            </FormSelect>
          </div>
        </div>
        <div class="mt-5" v-show="formData.actionSelected === 'change_package'">
          <FormInline>
            <FormLabel htmlFor="packageSelected" class="sm:w-44">
              {{ t('new', { name: t('package') }) }}
            </FormLabel>
            <FormSelect id="packageSelected" name="packageSelected" v-model="formData.packageSelected">
              <option disabled value="">{{ t('choose') }}</option>
              <option v-for="pkg in listPackage" :value="String(pkg.id)">{{ pkg.name }}</option>
            </FormSelect>
          </FormInline>
          <p class="mt-3 sm:ml-44 sm:pl-5">{{ t('massive_task_package_change_des') }}</p>
        </div>
        <div class="mt-5 text-center text-danger" v-show="formData.actionSelected === 'delete_account'">
          {{ t('massive_task_delete_account_des') }}
        </div>
        <AlertCustom :errors="errors"></AlertCustom>
        <div class="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline-secondary" @click="openClose = false" type="reset" class="min-w-[7rem]">
            {{ t('button.cancel') }}
          </Button>
          <Button variant="primary" class="min-w-[7rem]" type="submit" :disabled="isSubmitting">
            {{ t('button.save') }}
            <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" v-show="isSubmitting" />
          </Button>
        </div>
      </form>
    </template>
  </HeadlessUiDialogModal>
</template>
