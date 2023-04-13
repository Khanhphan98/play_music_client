<script setup lang="ts">
  import _ from 'lodash';
  import { onMounted, withDefaults, ref, provide } from 'vue';
  import Tippy, { ProvideTippy } from '@/base-components/Tippy';
  import { PopperElement } from 'tippy.js';

  interface SideMenuTooltipProps {
    refKey?: string;
    as?: string | object;
    content: string;
  }

  const toggleTooltip = (el: PopperElement) => {
    if (window.innerWidth <= 1260) {
      el._tippy?.enable();
    } else {
      el._tippy?.disable();
    }
  };

  const initTooltipEvent = (tippyRef: PopperElement) => {
    window.addEventListener('resize', () => {
      toggleTooltip(tippyRef);
    });
  };

  const props = withDefaults(defineProps<SideMenuTooltipProps>(), {
    as: 'a',
  });

  const tippyRef = ref<PopperElement>();

  provide<ProvideTippy>('bind[sideMenuTooltipRef]', (el) => {
    tippyRef.value = el;
  });

  onMounted(() => {
    if (tippyRef.value) {
      toggleTooltip(tippyRef.value);
      initTooltipEvent(tippyRef.value);
    }
  });
  const aside = document.querySelector('aside');
  // TODO: hobv@inet.vn - vô hiệu hoá tippy khi menu sidebar = 250px
  new ResizeObserver((elm) => {
    const asElm = elm[0];
    const asW = asElm.target.clientWidth;
    if (asW === 250) {
      tippyRef.value?._tippy?.disable();
    } else if (asW < 250) {
      tippyRef.value?._tippy?.enable();
    }
  }).observe(aside);
</script>

<template>
  <Tippy
    :as="props.as"
    :content="props.content"
    :options="{
      placement: 'left',
    }"
    refKey="sideMenuTooltipRef">
    <slot></slot>
  </Tippy>
</template>
