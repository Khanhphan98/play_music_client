<template>
  <div class="flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap pagination-custom">
    <Pagination class="w-full sm:w-auto sm:mr-auto">
      <Pagination.Link @click="onClickFirstPage" as="button" :disabled="isInFirstPage">
        <Lucide icon="ChevronsLeft" class="w-4 h-4" />
      </Pagination.Link>
      <Pagination.Link @click="onClickPreviousPage" as="button" :disabled="isInFirstPage">
        <Lucide icon="ChevronLeft" class="w-4 h-4" />
      </Pagination.Link>
      <!-- Visible Buttons Start -->
      <Pagination.Link
        v-for="page in pages"
        :key="page.name"
        :class="{ '!box font-medium dark:bg-darkmode-400': isPageActive(page.name) }"
        @click="onClickPage(page.name)"
        :disabled="page.isDisabled"
        as="button">
        {{ page.name }}
      </Pagination.Link>
      <!-- Visible Buttons End -->
      <Pagination.Link @click="onClickNextPage" as="button" :disabled="isInLastPage || pages.length === 0">
        <Lucide icon="ChevronRight" class="w-4 h-4" />
      </Pagination.Link>
      <Pagination.Link @click="onClickLastPage" as="button" :disabled="isInLastPage || pages.length === 0">
        <Lucide icon="ChevronsRight" class="w-4 h-4" />
      </Pagination.Link>
    </Pagination>
    <page-size-custom
      :per-page="perPage"
      :per-page-selected="perPageSelected"
      @perpagechanged="onChangePerPage" />
  </div>
</template>

<script setup lang="ts">
  import Lucide from '@/base-components/Lucide/Lucide.vue';
  import FormSelect from '@/base-components/Form/FormSelect.vue';
  import { computed, PropType, ref } from 'vue';
  import Pagination from '@/base-components/Pagination';
  import { defaultLimitPerPage } from '@/utils/my-variables';
  import PageSizeCustom from '@/base-components/iCustom/PageSizeCustom.vue';

  const props = defineProps({
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Array as PropType<number[]>,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  });
  const emit = defineEmits(['pagechanged', 'perpagechanged']);
  const currentPage = computed(() => props.currentPage);
  const totalPages = computed(() => props.totalPages);
  const maxVisibleButtons = computed(() => props.maxVisibleButtons);
  const perPage = computed(() => props.perPage as number[]);
  const perPageSelected = ref(defaultLimitPerPage);
  const isInFirstPage = computed(() => {
    return currentPage.value === 1;
  });
  const isInLastPage = computed(() => {
    return currentPage.value === totalPages.value;
  });
  function isPageActive(page: number) {
    return currentPage.value === page;
  }

  function onClickFirstPage() {
    emit('pagechanged', 1);
  }

  function onClickPreviousPage() {
    emit('pagechanged', currentPage.value - 1);
  }

  function onClickPage(page: number) {
    emit('pagechanged', page);
  }

  function onClickNextPage() {
    emit('pagechanged', currentPage.value + 1);
  }

  function onClickLastPage() {
    emit('pagechanged', totalPages.value);
  }

  function onChangePerPage(data: number) {
    emit('perpagechanged', data);
  }

  function startPage() {
    // When on the first page
    if (currentPage.value === 1) {
      return 1;
    }

    // When on the last page
    if (currentPage.value === totalPages.value) {
      return totalPages.value;
    }

    // When inbetween
    return currentPage.value - 1;
  }

  const pages = computed(() => {
    const range = [];

    for (
      let i = startPage();
      i <= Math.min(startPage() + maxVisibleButtons.value - 1, totalPages.value);
      i++
    ) {
      range.push({
        name: i,
        isDisabled: i === currentPage.value,
      });
    }

    return range;
  });
</script>

<style lang="scss">
  .pagination-custom {
    li > button {
      @apply border border-slate-200 dark:border-darkmode-600 h-full;
      &:not([disabled]):hover {
        @apply border-primary text-primary;
      }
      &[disabled] {
        @apply text-slate-500;
        &.\!box {
          @apply bg-slate-200 dark:bg-darkmode-600 #{!important};
        }
      }
    }
  }
</style>
