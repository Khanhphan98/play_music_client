<script setup lang="ts">
  import TomSelect from "tom-select";
  import {computed, onMounted, ref} from "vue";

  const inputTags = ref();
  const props = defineProps({
    value: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['update:value']);

  const valueTomselect = computed({
    get: () => props.value,
    set: (v => emit('update:value', v))
  })

  onMounted(() => {
    new TomSelect(inputTags.value, {
      plugins: ['remove_button'],
      presist: false,
      createOnBlur: true,
      create: true,
      onDelete: function(values) {
        return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
      }
    })
  })
</script>

<template>
  <input ref="inputTags" :value="valueTomselect" autocomplete="off" placeholder="Ex: 100">
</template>