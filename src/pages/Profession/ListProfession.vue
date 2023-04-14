<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue';
  import { ProfessionStore } from '@/stores/profession-store';
  import { UserStore } from '@/stores/user-store';
  import { IProfession } from '@/model/interface/IProfession';
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import Table from '@/base-components/Table';
  import Button from '@/base-components/Button';
  import { FormInput, FormLabel } from '@/base-components/Form';
  import { t } from '@/config/i18n';
  import { z } from 'zod';
  import { toFieldValidator } from '@vee-validate/zod';
  import { useForm } from 'vee-validate';
  import { tryCallRequest } from '@/utils/my-function';
  import AlertCustom from '@/base-components/iCustom/AlertCustom.vue';
  import { ModalConfig } from '@/model/dto/ModalConfig';
  import HeadlessUiDialogModal from '@/base-components/iCustom/HeadlessUiDialogModal.vue';


  // init value
  const professionStore = ProfessionStore();
  const professions = computed(() => professionStore.professions as IProfession[]);

  const formData = reactive({
    id: "",
    name: ""
  })

  //Schema validate
  const schema = toFieldValidator(
    z.object({
      name: z
        .string()
        .nonempty(t('alert.messages.required', { field: t('profession') }))
    }),
  );

  //Form action
  const { handleSubmit, errors, isSubmitting, resetForm } = useForm({
    initialValues: formData,
    validationSchema: schema,
  });

  // init value component
  const showModalUpdate = ref(false);
  const showModalDelete = ref(false);
  const professionDelete = ref<IProfession>({ name: '' } as IProfession);
  const modalOptionDelete = { template: 'del' } as ModalConfig;

  const submitForm = handleSubmit(async (values) => {
    await tryCallRequest(async () => {
      //init request
      const request = { id: formData.id, name: values.name } as IProfession;
      if (showModalUpdate.value) {
        // call request save
        await professionStore.update(request);
      } else {
        // call request save
        await professionStore.save(request);
      }
      // reset form
      await reset ()
    });
  });


  async function actionDeleteProfession () {
    await tryCallRequest(async () => {
      //init request
      const request = { id: professionDelete.value.id } as IProfession;
      // call request
      await professionStore.remove(request);
      // call lai list profession
      await professionStore.list()
      // hide modal
      showModalDelete.value = false;
    });
  }

  async function reset () {
    // reset form
    resetForm();
    showModalUpdate.value = false;
    // call lai list profession
    await professionStore.list()
  }

  onMounted(() => {
    professionStore.list()
  })

</script>

<template>
  <div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 md:col-span-6">
        <form class="bg-white dark:bg-darkmode-600 rounded p-3 shadow-sm h-full" @submit='submitForm'>
          <FormLabel htmlFor="ip_address">
            <span class="font-medium text-base">{{ t('profession') }}</span>
          </FormLabel>
          <div class="flex mt-3">
            <FormInput class="dark:border-slate-600" v-model='formData.name' name="name" id="name" type="text" :placeholder="t('enter', { name: t('profession').toLowerCase() })" />
          </div>
          <div class="text-right shrink-0 mt-4">
            <Button v-if='showModalUpdate' type="button" variant="soft-warning" class='mr-2' @click='reset'>
              <Lucide icon="RefreshCw" class="h-5 w-5 mr-2" />
              Reset
            </Button>
            <Button variant="primary" type="submit" :disabled='isSubmitting'>
              <Lucide :icon="showModalUpdate ? 'Save' : 'Plus'" class="h-5 w-5 mr-2" />
              {{ showModalUpdate ? t('button.save') : t('button.create') }}
            </Button>
          </div>
          <AlertCustom :errors="errors"></AlertCustom>
        </form>
      </div>
      <div class="col-span-12 md:col-span-6">
        <div class="bg-white dark:bg-darkmode-600 rounded p-3 shadow-sm">
          <div class="max-h-[55vh] overflow-y-auto border border-slate-200">
            <Table sm hover>
              <Table.Thead class="sticky top-0 bg-white dark:bg-darkmode-400 shadow-sm">
                <Table.Tr>
                  <Table.Th>
                    {{ t('profession') }}
                    <span class="text-xs text-slate-400">({{ professions.length || 0 }})</span>
                  </Table.Th>
                  <Table.Th class="w-32 text-center">
                    {{ t('action') }}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-for="profession in professions" :key="profession.name">
                  <Table.Td>
                    <div class="flex items-center">
                      <Lucide icon="Box" class="w-4 h-4 text-slate-400 mr-2" />
                      {{ profession.name }}
                    </div>
                  </Table.Td>
                  <Table.Td class="text-right">
                    <div class="-mx-1.5">
                      <Button variant="soft-primary" size="sm" class="m-1.5" @click='formData.id = profession.id; formData.name = profession.name; showModalUpdate = true'>
                        <Lucide icon="Edit" class="h-4 w-4" />
                      </Button>
                      <Button variant="soft-danger" size="sm" class="m-1.5" @click='professionDelete = profession; showModalDelete = true'>
                        <Lucide icon="Trash" class="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <!-- BEGIN: Modal Delete IP Manager -->
          <HeadlessUiDialogModal :open-modal="showModalDelete" @closeModal="showModalDelete = false" :modal-options="modalOptionDelete" @call-back-action="actionDeleteProfession">
            <template #title>
              {{ t('are_you_sure', { action: t('delete').toLowerCase() }) }}
            </template>
            <template #modalbody>
              <p class="text-base text-danger py-2 px-3 rounded bg-light mt-1">{{ professionDelete.name }}</p>
              <div class="mt-2 text-slate-500">
                <p>{{ t('are_you_sure_1', { action: t('delete', { name: professionDelete.name }) }) }}</p>
                <p>{{ t('are_you_sure_2') }}</p>
              </div>
            </template>
          </HeadlessUiDialogModal>
          <!-- END: Modal Delete IP Manager -->
        </div>
      </div>
    </div>
  </div>
</template>
