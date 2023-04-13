<script setup lang="ts">
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import { FormInput, FormLabel, FormSelect, FormSwitch, FormCheck } from '@/base-components/Form';
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

  const changeUserPriviligiesModal = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });
  const changeUserPriviligiesContent = computed(() => props.content);

  const initData = reactive<any>({
    data: {
      title: 'Data',
      checkAll: false,
      indeterminate: false,
      role: ['select', 'insert', 'update', 'delete'],
    },
    structure: {
      title: 'Structure',
      checkAll: false,
      indeterminate: false,
      role: [
        'create',
        'alter',
        'index',
        'drop',
        'trigger',
        'show view',
        'create routine',
        'alter rountine',
        'execute',
        'create view',
        'event',
        'create temp, table',
        'reference',
        'lock tables',
      ],
    },
  });

  const userPSelect = reactive<any>({
    data: {
      role: [],
    },
    structure: {
      role: [],
    },
  });

  function checkAll(evt: any) {
    const id = evt.target.id;
    checkTF(id, evt.target.checked);
  }

  function checkTF(_id: string, _ck: boolean) {
    const initD = initData[_id].role;
    initD.forEach((_it: string) => {
      const childId = document.getElementById(_id + '_' + _it) as HTMLInputElement;
      if (_ck) {
        childId.checked = true;
      } else {
        childId.checked = false;
      }
    });
  }

  function changeInput(evt: any) {
    const ipId = evt.target.id;
    const _id = ipId.split('_').shift();
    ipChild(_id);
  }
  function ipChild(_id: string) {
    const initD = initData[_id].role;
    initD.forEach((_it: string) => {
      const childId = document.getElementById(_id + '_' + _it) as HTMLInputElement;
      if (childId.checked) {
        if (!userPSelect[_id].role.includes(childId.value)) {
          userPSelect[_id].role.push(childId.value);
        }
      } else {
        const index = userPSelect[_id].role.findIndex((_it: string) => {
          return _it == childId.value;
        });
        if (index !== -1) {
          userPSelect[_id].role.splice(index, 1);
        }
      }
    });
    if (userPSelect[_id].role.length === initD.length) {
      initData[_id].indeterminate = false;
      selectAllIp(_id, true);
    } else {
      selectAllIp(_id, false);
      if (userPSelect[_id].role.length > 0 && userPSelect[_id].role.length < initD.length) {
        initData[_id].indeterminate = true;
      } else {
        initData[_id].indeterminate = false;
      }
    }
  }
  function selectAllIp(_id: string, _ck: boolean) {
    const ipRoot = document.getElementById(_id) as HTMLInputElement;
    if (ipRoot) ipRoot.checked = _ck;
  }

  function saveChange() {}
</script>

<template>
  <TransitionRoot appear :show="changeUserPriviligiesModal" as="template">
    <Dialog as="div" @close="changeUserPriviligiesModal = false" class="relative z-[10000]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <span class="grow">Change user priviligies</span>
                <Button
                  size="sm"
                  class="border-none shadow-none"
                  type="button"
                  @click="changeUserPriviligiesModal = false">
                  <Lucide icon="X" class="h-5 w-5" />
                </Button>
              </DialogTitle>
              <div class="dialog-content mt-5">
                <h3 class="mb-3 text-base">
                  for <b>{{ changeUserPriviligiesContent.userName }}</b>
                </h3>
                <div class="mb-5" v-for="(k, id) in Object.assign(initData)" :key="id">
                  <FormCheck class="mb-2">
                    <FormCheck.Input
                      :id="id"
                      type="checkbox"
                      :indeterminate="k.indeterminate"
                      @change="checkAll" />
                    <FormCheck.Label :htmlFor="id" class="font-medium text-base">
                      {{ k.title }}
                    </FormCheck.Label>
                  </FormCheck>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6" v-for="(role, rid) in k.role" :key="rid">
                      <p class="p-3 bg-light dark:bg-darkmode-600 rounded">
                        <FormSwitch>
                          <FormSwitch.Input
                            :id="id + '_' + role"
                            type="checkbox"
                            :value="role"
                            @change="changeInput" />
                          <FormSwitch.Label :htmlFor="id + '_' + role">
                            {{ role.toUpperCase() }}
                          </FormSwitch.Label>
                        </FormSwitch>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5">
                <div class="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    @click="changeUserPriviligiesModal = false"
                    class="min-w-[7rem]">
                    Cancel
                  </Button>
                  <Button type="button" variant="primary" class="min-w-[7rem]" @click="saveChange()">
                    Save
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
