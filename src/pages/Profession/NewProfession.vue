<script setup lang="ts">
  import _ from 'lodash';
  import { ref, computed, onMounted } from 'vue';
  import fakerData from '@/utils/faker';
  import Button from '@/base-components/Button';
  import { FormSelect, FormSwitch } from '@/base-components/Form';
  import Lucide from '@/base-components/Lucide';
  import Tippy from '@/base-components/Tippy';
  import Table from '@/base-components/Table';
  import Progress from '@/base-components/Progress';
  import { Menu, MenuButton, MenuItems, MenuItem, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
  import UserAccountBandWidthModal from '@/pages/UserAccount/partial/BandWidthModal.vue';
  import UserAccountEditDnsZoneModal from '@/pages/UserAccount/partial/EditDnsZoneModal.vue';
  import UserAccountDiskUsageModal from '@/pages/UserAccount/partial/DiskUsageModal.vue';
  import UserAccountChangePasswordModal from '@/pages/UserAccount/partial/ChangePasswordModal.vue';
  import EditAccountModal from '@/pages/UserAccount/partial/EditAccountModal.vue';
  const listAcc = ref<any>({
    table: {
      thead: [
        {
          title: computed(() => t('username')),
          val: 'username',
        },
        {
          title: computed(() => t('domain')),
          val: 'domain',
        },
        {
          title: computed(() => t('ip')),
          val: 'ip',
        },
        {
          title: computed(() => t('setuptime')),
          val: 'setuptime',
        },
        {
          title: computed(() => t('package')),
          val: 'package',
        },
        {
          title: computed(() => t('owner')),
          val: 'owner',
        },
        {
          title: computed(() => t('acl')),
          val: 'acl',
        },
        {
          title: computed(() => t('bandwidth')),
          val: 'bandwidth',
        },
        {
          title: computed(() => t('diskusage')),
          val: 'diskusage',
        },
        {
          title: computed(() => t('action')),
          val: 'action',
        },
      ],
    },
    sortField: {
      selected: '',
    },
  });

</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: General Report -->
  </div>
</template>
