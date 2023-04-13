<template>
  <RouterView />
</template>

<script setup lang="ts">
  const ldpSid = document.getElementById('ldp-screen');
  if (ldpSid) {
    ldpSid.remove();
  }
</script>

<style lang="scss">
  @import './assets/scss/app-custom';
</style>
