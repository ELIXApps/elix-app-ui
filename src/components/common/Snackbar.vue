<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color" class="elevation-24" width="40%" location="top">
    {{ message }}
    <template v-slot:actions>
      <v-btn icon @click="visible = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar'

const { visible, message, color, timeout } = useSnackbar()
</script>
