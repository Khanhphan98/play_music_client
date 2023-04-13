<script setup lang="ts">
  import Table from '@/base-components/Table';
  import { FormCheck } from '@/base-components/Form';
  import { aclDataMock } from '@/pages/UserAccount/partial/acl-data-mock';
  import { ref } from 'vue';

  const selectedAll = ref(false);
  const checkIndeterminate = ref(false);

  function checkAll(_all: boolean) {
    checkIndeterminate.value = false;
    const dtMock = aclDataMock.tableTd;
    for (const k in dtMock) {
      for (let i = 0; i < dtMock[k].length; i++) {
        dtMock[k][i].active = _all;
      }
    }
  }
  function checkItem() {
    checkIndeterminate.value = true;
    // Làm sau
  }
</script>

<template>
  <FormCheck class="mb-3">
    <FormCheck.Input
      id="check-all"
      type="checkbox"
      v-model="selectedAll"
      @change="checkAll(selectedAll)"
      :indeterminate="checkIndeterminate" />
    <FormCheck.Label htmlFor="check-all">
      {{ $t('checkall') }}
    </FormCheck.Label>
  </FormCheck>
  <Table sm striped bordered hover>
    <Table.Tbody>
      <Table.Tr v-for="th in aclDataMock.tableTh" :key="th.tdId">
        <Table.Td class="font-medium">
          {{ th.title }}
        </Table.Td>
        <Table.Td>
          <div class="-mx-1">
            <div
              class="rounded-md border border-slate-200 bg-white dark:bg-darkmode-500 m-1"
              v-for="(list, index) in aclDataMock.tableTd[th.tdId]">
              <FormCheck class="p-2">
                <FormCheck.Input
                  :id="'checkbox-' + th.tdId + '-' + index"
                  type="checkbox"
                  v-model="list.active"
                  @change="checkItem()" />
                <FormCheck.Label
                  :htmlFor="'checkbox-' + th.tdId + '-' + index"
                  class="whitespace-nowrap grow">
                  {{ list.title }}
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
</template>
