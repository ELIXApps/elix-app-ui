<template>
  <v-app>
    <Loader />
    <router-view v-if="!isAuthLoading" />
  </v-app>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AccessTokenKey } from './services/constants';
import ElixRoutes from './router/ElixRoutes';
import { fetchApi } from './services/fetchHelper';
import { useLoader } from './composables/useLoader';
import { ValidateTokenAPIUrl } from './services/apiUrls';
import "./styles/app.scss";
import { IApiResponse } from './models/api';

const router = useRouter();
const isAuthLoading = ref(true);

const { showLoader, hideLoader } = useLoader();

watch(isAuthLoading, () => {
  isAuthLoading.value ? showLoader() : hideLoader();
})

onMounted(() => {
  initializeAuth();
});

function initializeAuth() {
  const currentPath = router.currentRoute.value.path;
  if (currentPath === ElixRoutes.Login) {
    isAuthLoading.value = false;
    return;
  }

  var token = localStorage.getItem(AccessTokenKey);
  if (!token) {
    authFailed();
    return;
  }

  fetchApi<IApiResponse<any>>(
    ValidateTokenAPIUrl,
    {
      method: 'POST'
    }
  ).then(resp => {
    if (resp.status !== 'ok') {
      authFailed();
      return;
    }
    isAuthLoading.value = false;
    
  }).catch(e => {
    console.error(e);
    authFailed();
  });

}

function authFailed() {
  isAuthLoading.value = false;
  router.push(ElixRoutes.Login);
}

</script>

<style lang="css">
body {
  zoom: 86%
}
</style>
