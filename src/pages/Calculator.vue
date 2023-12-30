<script setup lang="ts">

import {ref} from 'vue';
import {t} from '@/config/i18n';
import {FormInline, FormLabel, FormTextarea, InputGroup} from '@/base-components/Form';
import Lucide from '@/base-components/Lucide';

const name = ref<{ [key: string]: string }>({} as { [key: string]: string });
const calculators = ref([{ name: '', gianhap: 0, lai: 0, giabanle: 0, lairong: 0 }]);

function actionCalculatorPercent(gianhap: number, giabanle: number) {
  return ((giabanle - gianhap) / gianhap) * 100;
}
function actionCalculatorGiabanle(gianhap: number, lai: number) {
  const giabanle = ((gianhap / (100 - lai)) * 100)
}
function actionCalculatorLairong(gianhap: number, lai: number) {
  return (((gianhap / (100 - lai)) * 100) - gianhap).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="container max-w-screen-xl mx-auto">
      <div>
        <h2 class="font-semibold text-xl text-gray-600">Công thức tính giá bản lẻ</h2>
        <p>Giá bán lẻ = [(Giá vốn) / (100 - % lợi nhuận)] x 100</p>

        <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div class="grid grid-cols-5 gap-4 gap-y-2 text-sm mt-2" v-for='(cal, idx) in calculators' :key='cal.name'>
            <div class="col-span-1">
              <label for="name">Tên sản phẩm</label>
              <input type="text" v-model='name[idx]' id="name" class="h-10 border mt-1 rounded px-4 w-full" />
            </div>
            <div class="col-span-1">
              <label for="gianhap">Giá nhập</label>
              <input type="text" v-model='cal.gianhap' id="gianhap" class="h-10 border mt-1 rounded px-4 w-full" />
            </div>
            <div class="col-span-1">
              <label for="lai">Lãi (%)</label>
              <input type="text" :value='actionCalculatorPercent(cal.gianhap, cal.giabanle)'  id="lai" class="h-10 border mt-1 rounded px-4 w-full" />
            </div>
            <div class="col-span-1">
              <label for="giabanle">Giá bán lẻ</label>
              <input type="text" v-model='cal.giabanle' id="giabanle" class="h-10 border mt-1 rounded px-4 w-full" />
            </div>
            <div class="col-span-1">
              <label for="lairong">Lãi ròng</label>
              <input type="text" :value='cal.giabanle - cal.gianhap'  id="lairong" class="h-10 border mt-1 rounded px-4 w-full" />
            </div>
          </div>
          <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="calculators.push({ name: '', gianhap: 0, lai: 0, giabanle: 0, lairong: 0 })">
            Thêm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
