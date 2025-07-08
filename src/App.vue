<template>
  <v-app>
    <Loader />
    <router-view v-if="!isAuthLoading" />
  </v-app>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AccessTokenKey, authUrl } from './services/constants';
import ElixRoutes from './router/ElixRoutes';
import { fetchApi } from './services/fetchHelper';
import { useLoader } from './composables/useLoader';

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


  fetchApi<any>(
    authUrl,
    {
      method: 'POST',
      body: {
        token
      },
    }
  ).then(resp => {
    if (resp.statusCode !== 200) {
      authFailed();
      return;
    }
    isAuthLoading.value = false;
  });

}

function authFailed() {
  isAuthLoading.value = false;
  router.push(ElixRoutes.Login);
}

</script>
