<template>
  <Snackbar />
  <Loader />
  <v-app-bar title="ELIX"></v-app-bar>
  <SideBar />
  <v-main>
      <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';
import { HideLoaderKey, LoadingKey, ShowLoaderKey } from '../services/constants';

const loading = ref(false);

function showLoader() {
  loading.value = true
}

function hideLoader() {
  loading.value = false
}

provide(LoadingKey, loading);
provide(ShowLoaderKey, showLoader);
provide(HideLoaderKey, hideLoader);

</script>