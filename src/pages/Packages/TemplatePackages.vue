<script setup lang="ts">
  import Table from '@/base-components/Table';
  import { onBeforeMount, onMounted, reactive, ref } from 'vue';
  import AdminTemplate from '@/layouts/Admin/template';
  import Button from '@/base-components/Button';
  import Lucide from '@/base-components/Lucide';
  import Tippy from '@/base-components/Tippy';
  import { useRoute } from 'vue-router';
  import Alert from '@/base-components/Alert';
  import EditPackageModal from '@/pages/Packages/partial/EditPackageModal.vue';
  import PackagesAddNewModal from '@/pages/Packages/partial/AddNewPackageModal.vue';
  import { FormSwitch } from '@/base-components/Form';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';

  const route = useRoute();

  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoicm9vdCJ9LCJpc3MiOiJzaW1wbGUtcGFuZWwiLCJzdWIiOiJhY2Nlc3MtdG9rZW4iLCJleHAiOjE2ODA1ODM2NTQsIm5iZiI6MTY4MDU4MDA1NCwiaWF0IjoxNjgwNTgwMDU0fQ.8CYTOesUep4bXedFW7MEKSQcahY_-TJ_cbA6EdHah3o',
  );

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  const msgError = ref();
  const tplData = ref<any>([]);

  onMounted(() => {
    const tplId = route.params.tplId;
    if (tplId) {
      fetch('http://dnses.xyz:8080/api/private/package/template/' + tplId, requestOptions)
        .then((response) => {
          return response.text();
        })
        .then((result) => {
          tplData.value.push(JSON.parse(result));
        })
        .catch((error) => (msgError.value = error));
    }
  });

  const colData = reactive([
    {
      mId: 'id',
      show: false,
    },
    {
      mId: 'name',
      show: true,
    },
    {
      mId: 'disk_space',
      show: true,
    },
    {
      mId: 'bandwidth',
      show: true,
    },
    {
      mId: 'db',
      show: false,
    },
    {
      mId: 'ftp',
      show: true,
    },
    {
      mId: 'domains',
      show: true,
    },
    {
      mId: 'speed',
      show: false,
    },
    {
      mId: 'p_mem',
      show: false,
    },
    {
      mId: 'io',
      show: false,
    },
    {
      mId: 'iops',
      show: false,
    },
    {
      mId: 'ep',
      show: false,
    },
    {
      mId: 'n_proc',
      show: false,
    },
    {
      mId: 'inodes_soft',
      show: false,
    },
    {
      mId: 'inodes_hard',
      show: false,
    },
    {
      mId: 'ips',
      show: false,
    },
    {
      mId: 'is_override',
      show: false,
    },
    {
      mId: 'type',
      show: false,
    },
  ]);

  colData.forEach((_it) => (_it.showdf = _it.show));

  const addActionMd = ref(false);
  const readActionMd = ref(false);
  const editActionMd = ref(false);
  const delteActionMd = ref(false);
  const selectItem = ref<any>({});
  const viewmorecolumns = ref(false);

  function viewMoreColumns(evt: Event) {
    const checkViewMoreCol = viewmorecolumns.value;
    colData.forEach((_it: any) => {
      if (checkViewMoreCol) {
        _it.show = true;
      } else {
        _it.show = _it.showdf;
      }
    });
  }
</script>

<template>
  <div class="packages-template pt-1">
    <AdminTemplate.tablebase>
      <template #tablehead>
        <div class="flex flex-col md:flex-row items-center mb-3">
          <div class="grow pr-5">
            Total number of packages: <b>{{ tplData[0] && tplData[0].data ? tplData[0].data.length : 0 }}</b>
          </div>
          <FormSwitch class="mr-5">
            <FormSwitch.Input
              id="view-more-columns"
              type="checkbox"
              v-model="viewmorecolumns"
              @change="viewMoreColumns" />
            <FormSwitch.Label htmlFor="view-more-columns"> View more columns</FormSwitch.Label>
          </FormSwitch>
          <Button as="a" variant="primary" @click="addActionMd = true">
            <Lucide icon="PackagePlus" class="h-5 w-5 mr-2" />
            Add New Package
          </Button>
        </div>
      </template>
      <template #tablebody>
        <Table sm bordered hover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th v-for="th in colData" v-show="th.show">
                {{ th.mId }}
              </Table.Th>
              <Table.Th class="text-right"> Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="tplData[0] && tplData[0].errors">
              <Table.Td :colspan="colData.filter((_it) => _it.show).length + 1">
                <Alert variant="soft-danger" class="text-center text-base">
                  {{ $t(tplData[0].errors[0].detail.toLowerCase()) }}
                </Alert>
              </Table.Td>
            </Table.Tr>
            <Table.Tr
              v-else-if="tplData[0] && tplData[0].data"
              v-for="list in tplData[0].data"
              :key="list.id">
              <Table.Td v-for="th in colData" v-show="th.show">
                {{ list[th.mId] }}
              </Table.Td>
              <Table.Td class="whitespace-nowrap text-right">
                <Tippy
                  :as="Button"
                  content="Update"
                  class="ml-3"
                  variant="soft-secondary"
                  size="sm"
                  @click="
                    editActionMd = true;
                    selectItem.name = list.name;
                  ">
                  <Lucide icon="FileSignature" class="h-5 w-5" />
                </Tippy>
                <Tippy
                  :as="Button"
                  content="Delete"
                  class="ml-3"
                  variant="soft-danger"
                  size="sm"
                  @click="
                    delteActionMd = true;
                    selectItem.name = list.name;
                  ">
                  <Lucide icon="Trash" class="h-5 w-5" />
                </Tippy>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </template>
    </AdminTemplate.tablebase>
    <PackagesAddNewModal
      :open-close="addActionMd"
      @update:openClose="addActionMd = false"
      :content="{ data: [], account: selectItem }" />
    <EditPackageModal
      :content="selectItem"
      :open-close="editActionMd"
      @update:openClose="editActionMd = false"></EditPackageModal>
    <headless-ui-dialog-modal
      :open-modal="delteActionMd"
      @closeModal="delteActionMd = false"
      :modal-options="{ template: 'del' }">
      <template #modalbody>
        <p class="text-base mt-3 text-center">
          Bạn có muốn xoá <b class="text-danger">{{ selectItem.name }}</b> không?
        </p>
      </template>
    </headless-ui-dialog-modal>
  </div>
</template>
