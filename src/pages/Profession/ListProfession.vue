<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { ProfessionStore } from '@/stores/profession-store';
  import { UserStore } from '@/stores/user-store';
  import { IProfession } from '@/model/interface/IProfession';

  const professionStore = ProfessionStore();
  const userStore = UserStore();

  const professions = computed(() => professionStore.professions as IProfession[]);

  onMounted(() => {
    professionStore.list(userStore.myUser.access_token)
  })

</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: General Report -->
    <div class='block'>
      <div v-for='(profession, idx) in professions' class='mt-1' :key='profession.id'>{{ idx }} --- {{ profession.name }}</div>
    </div>
  </div>
</template>
