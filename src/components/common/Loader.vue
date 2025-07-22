<template>
  <v-progress-linear
    v-if="loading"
    indeterminate
    color="primary"
    height="2"
    position="fixed"
    top
    style="z-index: 9999"
  />
</template>

<script setup lang="ts">
import { useLoader } from '@/composables/useLoader';

const { loading } = useLoader();
</script>
