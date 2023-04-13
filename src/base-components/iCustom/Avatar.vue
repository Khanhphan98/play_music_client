<script setup lang="ts">
  import { computed, defineComponent, onUpdated, ref } from 'vue';
  import { randomRgbColor } from '@/utils/colors';

  const props = defineProps({
    avtJson: {
      type: Object,
      default: () => {},
    },
    keyImage: {
      type: String,
      default: 'image',
    },
    keyStr: {
      type: String,
    },
    avtClass: {
      type: String,
      default: 'w-9 h-9 text-sm',
    },
  });

  const data = computed(() => props.avtJson);
  // const kImg = computed(() => props.keyImage); TODO: Khi nào báo có Hệ thống chứa Avatar thì làm tiếp :D
  const kStr = computed(() => props.keyStr);
  const AvImg = ref('');
  const AvAlt = ref('');
  const AvStr = ref('');

  class Avatar {
    dataObj: object = {};
    keyStr: string;
    constructor(data: object, avtKeyStr?: string) {
      this.dataObj = data;
      this.keyStr = avtKeyStr || '';
      if (this.keyStr) {
        const kVl = this.findKeyVlInData(this.keyStrToArr());
        const kVlE = this.keyVlEmail(kVl);
        if (kVlE) {
          AvStr.value = kVlE.charAt(0).toUpperCase() + kVlE.substr(kVlE.length - 1).toUpperCase();
        } else {
          AvStr.value = kVl.charAt(0).toUpperCase();
        }
      } else {
        AvStr.value = 'i';
      }
    }

    keyStrToArr() {
      if (this.keyStr == '') return '';
      return this.keyStr.split(',');
    }

    findKeyVlInData(arr) {
      let i = 0;
      if (this.dataObj[arr[i]]) {
        return this.dataObj[arr[i]];
      }
      i++;
      if (i < arr.length) {
        this.findKeyVlInData(arr);
      }
      return 'i';
    }

    keyVlEmail(str) {
      return str.split('@')[0];
    }
  }

  const AvBg = randomRgbColor().join(',');

  new Avatar(data.value, kStr.value);

  onUpdated(() => {
    new Avatar(data.value, kStr.value);
  });
</script>
<template>
  <template v-if="AvImg">
    <img :src="AvImg" :alt="AvAlt" />
  </template>
  <template v-else>
    <div class="rounded-full" :class="avtClass" :style="{ backgroundColor: 'rgba(' + AvBg + ', 1)' }">
      <strong class="flex items-center justify-center h-full w-full text-white">
        {{ AvStr }}
      </strong>
    </div>
  </template>
</template>
