<template>
  <v-app>
    <v-progress-circular v-if="globalStore.isAuthLoading" indeterminate color="primary" />
    <router-view v-else />
    <!-- <router-view /> -->
  </v-app>
</template>
<script setup lang="ts">

import { useGlobalStore } from '@/stores/global';
import { onMounted } from 'vue';
import { initializeAuth } from '@/utils/authUtils';
import { useRouter } from 'vue-router';
const globalStore = useGlobalStore();
const router = useRouter();


onMounted(() => {
  initializeAuth(globalStore, router);
});

</script>
