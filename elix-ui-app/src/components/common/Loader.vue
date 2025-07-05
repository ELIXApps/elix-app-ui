<template>
  <v-overlay
    :model-value="loading"
    class="align-center justify-center"
    persistent
    scrim
  >
    <v-progress-circular
      color="primary"
      size="64"
      indeterminate
    />
  </v-overlay>
</template>

<script setup lang="ts">
import { LoadingKey } from '@/services/constants';
import { inject, Ref } from 'vue'

// Inject the loading state
const loading = inject<Ref<boolean>>(LoadingKey)
</script>
