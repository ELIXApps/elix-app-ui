<template>
  <v-app>
    <Loader />
    <v-app-bar title="ELIX"></v-app-bar>
    <SideBar />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';
import { HideLoaderKey, LoadingKey, ShowLoaderKey } from './services/constants';

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
