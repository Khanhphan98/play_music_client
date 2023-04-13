<script setup lang="ts">
  import Table from '@/base-components/Table';
  import { FormCheck } from '@/base-components/Form';
  import { aclDataMock } from '@/pages/UserAccount/partial/acl-data-mock';
</script>

<template>
  <Table sm bordered hover>
    <Table.Thead>
      <Table.Tr>
        <Table.Th class="whitespace-nowrap" v-for="th in aclDataMock.tableTh" :key="th.tdId">
          {{ th.title }}
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      <Table.Tr>
        <Table.Td v-for="th in aclDataMock.tableTh" :key="th.tdId">
          <div class="-mx-1">
            <div
              class="flex p-1 rounded-md border border-slate-200 bg-white dark:bg-darkmode-500 m-1"
              v-for="(list, index) in aclDataMock.tableTd[th.tdId]">
              <!--                  <Lucide :icon="list.active ? 'CheckCircle' : 'XCircle'" class="w-5 h-5 shrink-0 mr-2" :class="list.active ? 'text-success' : 'text-danger'"/>
                                <span class="text-slate-500 dark:text-slate-300 whitespace-nowrap">{{list.title}}</span>-->
              <FormCheck class="mr-2">
                <FormCheck.Input
                  :id="'checkbox-' + th.tdId + '-' + index"
                  type="checkbox"
                  v-model="list.active" />
                <FormCheck.Label :htmlFor="'checkbox-' + th.tdId + '-' + index" class="whitespace-nowrap">
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
