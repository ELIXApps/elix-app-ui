<template>
  <v-overlay :model-value="loading" class="align-center justify-center" persistent scrim>
    <v-progress-circular color="primary" size="64" indeterminate />
  </v-overlay>
</template>

<script setup lang="ts">
import { useLoader } from '@/composables/useLoader';

const { loading } = useLoader();
</script>
