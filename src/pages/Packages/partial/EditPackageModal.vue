<script setup lang="ts">
  import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import ReportLineChart from '@/components/ReportLineChart';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import { FormInline, FormLabel, FormInput, FormSelect, FormCheck } from '@/base-components/Form';
  import { computed, reactive } from 'vue';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';
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
  };
  const state = reactive({ ...initialState });
  const rules = computed(() => {
    return {
      name: {},
      diskquotamb: {},
      ftp: {},
      domain: {},
      nproc: {},
      apachenproc: {},
      nofile: {},
      bandwidthmd: {},
      mysql: '',
    };
  });

  const emit = defineEmits(['update:openClose', 'savePackages']);

  const editPackageContent = computed(() => props.content);

  const editPackageModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });

  function submitForm() {
    console.log('done!');
  }
</script>

<template>
  <HeadlessUiDialogModal
    :open-modal="editPackageModal"
    @closeModal="editPackageModal = false"
    :modal-options="{ footer: true, size: '3xl' }">
    <template #title> Edit new package </template>
    <template #modalbody>
      <form class="form-group" ref="formCreatePackage">
        <FormInline class="items-start">
          <FormLabel htmlFor="name" class="sm:w-32"> Name </FormLabel>
          <div class="w-full flex-1">
            <FormInput id="name" type="text" placeholder="Enter name" :value="state.name" />
            <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
          </div>
        </FormInline>
        <div class="grid grid-cols-12 gap-6 mt-5">
          <div class="col-span-12 md:col-span-6">
            <FormInline class="items-start">
              <FormLabel htmlFor="form1" class="sm:w-32"> Disk Quota MB </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form1" type="text" pattern="\d*" v-model="state.diskquotamb" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="form2" class="sm:w-32"> FTP </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form2" type="text" pattern="\d*" v-model="state.ftp" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="form4" class="sm:w-32"> Domain </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form4" type="text" pattern="\d*" v-model="state.domain" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="form6" class="sm:w-32"> nproc </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form6" type="text" pattern="\d*" v-model="state.nproc" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
          </div>
          <div class="col-span-12 md:col-span-6">
            <FormInline class="items-start">
              <FormLabel htmlFor="form10" class="sm:w-32"> Bandwidth MB </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form10" type="text" pattern="\d*" v-model="state.bandwidthmd" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="form12" class="sm:w-32"> Mysql </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form12" type="text" pattern="\d*" v-model="state.mysql" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="form7" class="sm:w-32"> apache_nproc </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form7" type="text" pattern="\d*" v-model="state.apachenproc" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
            <FormInline class="mt-5 items-start">
              <FormLabel htmlFor="form8" class="sm:w-32"> nofile </FormLabel>
              <div class="w-full flex-1">
                <FormInput id="form8" type="text" pattern="\d*" v-model="state.nofile" />
                <div class="mt-2 text-danger dark:text-red-300">loi ne</div>
              </div>
            </FormInline>
          </div>
        </div>
        <FormInline class="mt-5 items-start">
          <FormLabel htmlFor="form17" class="sm:w-32"> Update Quota </FormLabel>
          <FormCheck>
            <FormCheck.Input id="form17" type="checkbox" value="" />
          </FormCheck>
        </FormInline>
        <div class="mt-2 sm:ml-32 pl-5">
          <ul>
            <li>- (Update quota for all users using this package,also disables inode limits !)</li>
            <li>- Use -1 for Unlimited resources</li>
          </ul>
        </div>
      </form>
    </template>
    <template #footer>
      <div class="mt-10 text-right">
        <Button variant="secondary" class="mr-3 min-w-[7rem]" @click="editPackageModal = false">
          Close
        </Button>
        <Button type="button" variant="primary" class="min-w-[7rem]" @click="submitForm()"> Create </Button>
      </div>
    </template>
  </HeadlessUiDialogModal>
</template>
