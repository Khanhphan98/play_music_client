<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import Button from "@/base-components/Button";
import Lucide from "@/base-components/Lucide";
import { FormInline, FormLabel, FormInput, FormSelect } from "@/base-components/Form";
import TomeSelect from "@/base-components/TomSelect";
import {computed, reactive, ref, watch} from "vue";
import {toFieldValidator} from "@vee-validate/zod";
import {z} from "zod";
import {t} from "@/config/i18n";
import {useForm} from "vee-validate";
import {defaultTimeoutSubmit} from "@/utils/my-variables";
import {tryCallRequest} from "@/utils/my-function";
import HeadlessUiDialogModal from "@/base-components/iCustom/HeadlessUiDialogModal.vue";
import {AccountStore} from "@/stores/account-store";
import {PackageStore} from "@/stores/package-store";
import {IPackage} from "@/model/interface/IPackage";
import AlertCustom from "@/base-components/iCustom/AlertCustom.vue";
import {IIpAddress} from "@/model/interface/IIpAddress";

const props = defineProps(
    {
      openClose: {
        type: Boolean,
        default: false
      },
      content: {
        type: Object,
        default: () => {}
      }
    }
);

// BEGIN: variable
const initialState = {
  name: '',
  diskquotamb: '',
  ftp: '',
  domain: '',
  nproc: 40,
  apachenproc: 40,
  nofile: 200,
  bandwidthmd: '',
  mysql: '',
  ipseclect: [],
  iptable: [] as string[]
};
const state = reactive({...initialState});


const emit = defineEmits(['update:openClose']);

const addNewPackageContent = computed(() => props.content);

const addNewPackageModal = computed({
  get: () => props.openClose,
  set: (_vl) => emit('update:openClose', _vl)
});
const formCreatePackage = ref();

for(let i=0; i < 20; i++) {
  initialState.iptable.push('122.123.124.' + i);
}

const accountStore = AccountStore();
const packageStore = PackageStore();
const myAccount = computed(() => accountStore.myAccount);

const formData = reactive({
  username: '',
  // diskQuota: 1024,
  // bandwidth: 0,
  // ftp: 0,
  // domain: 0,
  // nproc: 0,
  // speed: 0,
  // mySqlDatabase: 0,
  // pmem: 0,
  // io: 0,
  // iops: 0,
  // ep: 0,
  // inodesSoft: 0,
  // inodesHard: 0,
  // ipPool: 0,
  // ipTable: [] as string[]
});

// watch(() => formData.name, (a) => {
//   console.log('a', a)
// })
const schema = toFieldValidator(z.object({
  username: z.string()
      .nonempty(t('alert.messages.required', { field: t('ip_address') }))
  // diskQuota: z.nonempty('alo'),
  // bandwidth: z.nonempty('alo'),
  // mySqlDatabase: z.number().min(0, 'alo'),
  // ftp: z.number().min(0, 'alo'),
  // domain: z.number().min(1, 'alo'),
  // speed: z.number().min(0, 'alo'),
  // io: z.number().min(0, 'alo'),
  // pmem: z.number().min(0, 'alo'),
  // iops: z.number().min(0, 'alo'),
  // ep: z.number().min(0, 'alo'),
  // nproc: z.number().min(0, 'alo'),
  // inodesSoft: z.number().min(0, 'alo'),
  // inodesHard: z.number().min(0, 'alo'),
  // ipPool: z.number().min(0, 'alo'),
}));

//Form action
const {handleSubmit, errors, isSubmitting} = useForm({
  initialValues: formData,
  validationSchema: schema
});

const submitForm = handleSubmit(async (values) => {
  console.log('da nhan 1')
  await tryCallRequest(async () => {
    //init request
    console.log('valu', values)
    const request = {
      name: values.username,
      // disk_space: values.diskQuota,
      // bandwidth: values.bandwidth,
      // db: values.mySqlDatabase,
      // ftp: values.ftp,
      // domains: values.domain,
      // speed: values.speed,
      // pmem: values.pmem,
      // io: values.io,
      // iops: values.iops,
      // ep: values.ep,
      // nproc: values.nproc,
      // inodes_soft: values.inodesSoft,
      // inodes_hard: values.inodesHard,
      // ip_pool: values.ipPool
    } as IPackage;
    console.log('requesst', request)
  });
});

// const submitForm = handleSubmit(async (values) => {
//   console.log('da nhan 1')
//   await tryCallRequest(async () => {
//     console.log('valu', values)
//     const request = {
//       name: values.username,
//       // disk_space: values.diskQuota,
//       // bandwidth: values.bandwidth,
//       // db: values.mySqlDatabase,
//       // ftp: values.ftp,
//       // domains: values.domain,
//       // speed: values.speed,
//       // pmem: values.pmem,
//       // io: values.io,
//       // iops: values.iops,
//       // ep: values.ep,
//       // nproc: values.nproc,
//       // inodes_soft: values.inodesSoft,
//       // inodes_hard: values.inodesHard,
//       // ip_pool: values.ipPool
//     } as IPackage;
//     console.log('requesst', request)
//
//     if(myAccount.value.role_slug === "admin") {
//       await packageStore.actionCreateResellerPackage(request);
//     } else if(myAccount.value.role_slug === "reseller") {
//       await packageStore.actionCreateEndUserPackage(request);
//     }
//   })
// })

</script>

<template>
  <HeadlessUiDialogModal
    :open-modal="addNewPackageModal"
    @closeModal="addNewPackageModal = false"
    :modal-options="{ footer: true, size: '3xl' }">
    <template #title> Add new package </template>
    <template #modalbody>
      <form @submit="submitForm" class="form-group" ref="formCreatePackage">
        <FormInline class="items-start">
          <FormLabel htmlFor="package-name" class="sm:w-32">
            Name
          </FormLabel>
          <div class="w-full flex-1">
            <FormInput v-model="formData.username" id="package-name" type="text" placeholder="Enter name" name="package-name"/>
          </div>
        </FormInline>
        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="col-span-12 md:col-span-6">
            <FormInline class="items-start">
              <FormLabel htmlFor="package-disk-quota" class="sm:w-32">
                Disk Quota MB
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-disk-quota" name="package-disk-quota" type="number" v-model="formData.diskQuota"/>
              </div>
            </FormInline>

            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-ftp" class="sm:w-32">
                FTP
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-ftp" name="package-ftp" type="number" v-model="formData.ftp"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-domain" class="sm:w-32">
                Domain
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-domain" name="package-domain" type="number" v-model="formData.domain"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-nproc" class="sm:w-32">
                nproc
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-nproc" name="package-nproc" type="number" v-model="formData.nproc"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-pmem" class="sm:w-32">
                pmem
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-pmem" name="package-pmem" type="number" v-model="formData.pmem"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-ip-pool" class="sm:w-32">
                ip_pool
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-ip-pool" name="package-ip-pool" type="number" v-model="formData.ipPool"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-inodes-soft" class="sm:w-32">
                inodes_soft
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-inodes-soft" name="package-inodes-soft" type="number" v-model="formData.inodesSoft"/>
              </div>
            </FormInline>
          </div>
          <div class="col-span-12 md:col-span-6">
            <FormInline class="items-start">
              <FormLabel htmlFor="package-bandwidth" class="sm:w-32">
                Bandwidth MB
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-bandwidth" name="package-bandwidth" type="number" v-model="formData.bandwidth"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-mysql-database" class="sm:w-32">
                Mysql
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-mysql-database" name="package-mysql-database" type="number" v-model="formData.mySqlDatabase"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-io" class="sm:w-32">
                io
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-io" name="package-io" type="number" v-model="formData.io"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-iops" class="sm:w-32">
                iops
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-iops" name="package-iops" type="number" v-model="formData.iops"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-speed" class="sm:w-32">
                Speed
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-speed" name="package-speed" type="number" v-model="formData.speed"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-ep" class="sm:w-32">
                ep
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-ep" name="package-ep" type="number" v-model="formData.ep"/>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="package-inodes-hard" class="sm:w-32">
                inodes_hard
              </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="package-inodes-hard" name="package-inodes-hard" type="number" v-model="formData.inodesHard"/>
              </div>
            </FormInline>
          </div>
        </div>
        <FormInline class="mt-5 items-start">
          <FormLabel htmlFor="package-ip-table" class="sm:w-32">
            IP table
          </FormLabel>
          <div class="w-full flex-1">
            <TomeSelect v-model="state.ipseclect" id="package-ip-table" :options="{
                          placeholder: 'Select IP table'
                        }" class="w-full" multiple>
              <option v-for="ip in state.iptable" :key="ip">
                {{ip}}
              </option>
            </TomeSelect>
          </div>
        </FormInline>
      </form>
    </template>
    <template #footer>
      <div class="mt-10 text-right">
        <Button variant="secondary" class="mr-3 min-w-[7rem]" @click="addNewPackageModal = false">
          Close
        </Button>
        <Button type="submit" variant="primary" class="min-w-[7rem]">
          Create
        </Button>
      </div>
    </template>
  </HeadlessUiDialogModal>
</template>
