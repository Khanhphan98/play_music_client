<script setup lang="ts">
  import Lucide from '@/base-components/Lucide';
  import Button from '@/base-components/Button';
  import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
  import { FormInput, FormLabel, FormSelect, FormSwitch, FormCheck } from '@/base-components/Form';
  import DatabaseListChangeHostModal from '@/pages/SQLServices/partial/ChangeHost.vue';
  import DatabaseListChangePasswordModal from '@/pages/SQLServices/partial/ChangePassword.vue';
  import DatabaseUserPriviligiesModal from '@/pages/SQLServices/partial/ChangeUserPriviligies.vue';
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
  const toogleUserPrivili = ref();
  const ckOpenClose = computed({
    get: () => props.openClose,
    set: (_vl) => emit('update:openClose', _vl),
  });
  toogleUserPrivili.value = ckOpenClose.value;
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
      checkSelected(childId);
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
      checkSelected(childId);
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

  const totalIpElm = ref<number>();
  const slIpElm = ref<any[]>([]);
  for (const k in initData) {
    totalIpElm.value = Object.values(initData[k]).flat().length;
    for (let i = 0; i < initData[k].role.length; i++) {
      const ipElm = document.getElementById(k + '_' + initData[k].role[i]) as HTMLInputElement;
      checkSelected(ipElm);
    }
  }

  function checkSelected(ipelm: HTMLInputElement) {
    if (ipelm) {
      if (ipelm.checked) {
        if (!slIpElm.value.includes(ipelm.value)) {
          slIpElm.value.push(ipelm.value);
        }
      } else {
        const fid = slIpElm.value.findIndex((_it: string) => {
          return _it == ipelm.value;
        });
        if (fid !== -1) {
          slIpElm.value.splice(fid, 1);
        }
      }
    }
  }

  function saveChange() {}
</script>

<template>
  <div class="change-user-priviligies">
    <div class="flex items-center mb-2 bg-light dark:bg-darkmode-600 rounded py-1.5">
      <p class="text-base font-medium grow pl-2">
        User priviligies <span class="text-primary">{{ slIpElm.length + '/' + totalIpElm }}</span>
      </p>
      <Button
        size="sm"
        class="border-none shadow-none bg-transparent mr-1"
        @click="toogleUserPrivili = !toogleUserPrivili">
        <Lucide icon="Plus" class="h-5 w-5" v-if="!toogleUserPrivili" />
        <Lucide icon="Minus" class="h-5 w-5" v-else />
      </Button>
    </div>
    <div v-if="toogleUserPrivili">
      <div class="mb-5" v-for="(k, id) in Object.assign(initData)" :key="id">
        <FormCheck class="mb-2">
          <FormCheck.Input :id="id" type="checkbox" :indeterminate="k.indeterminate" @change="checkAll" />
          <FormCheck.Label :htmlFor="id" class="font-medium text-base">
            {{ k.title }}
          </FormCheck.Label>
        </FormCheck>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6" v-for="(role, rid) in k.role" :key="rid">
            <p class="p-3 bg-light dark:bg-darkmode-600 rounded">
              <FormSwitch>
                <FormSwitch.Input :id="id + '_' + role" type="checkbox" :value="role" @change="changeInput" />
                <FormSwitch.Label :htmlFor="id + '_' + role">
                  {{ role.toUpperCase() }}
                </FormSwitch.Label>
              </FormSwitch>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
