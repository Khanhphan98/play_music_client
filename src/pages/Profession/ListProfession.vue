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


  // init value
  const professionStore = ProfessionStore();
  const userStore = UserStore();

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

  const submitForm = handleSubmit(async (values) => {
    await tryCallRequest(async () => {
      //init request
      const request = { name: values.name } as IProfession;
      // call request
      await professionStore.save(request);
      // call lai list profession
      await professionStore.list()
    });
  });

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
            <div class="text-right shrink-0 pl-5">
              <Button variant="primary" type="submit" :disabled='isSubmitting'>
                <Lucide icon="Plus" class="h-5 w-5 mr-2" />
                {{ t('button.save') }}
              </Button>
            </div>
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
                      <Button variant="soft-primary" size="sm" class="m-1.5">
                        <Lucide icon="Edit" class="h-4 w-4" />
                      </Button>
                      <Button variant="soft-danger" size="sm" class="m-1.5">
                        <Lucide icon="Trash" class="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
