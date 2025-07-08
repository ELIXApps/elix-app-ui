<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6" elevation="10">
          <v-card-title class="text-h5 mb-4 justify-center">Login</v-card-title>

          <v-form @submit.prevent="handleLogin" ref="formRef">
            <v-text-field v-model="username" label="Username" prepend-inner-icon="mdi-account"
              :error-messages="usernameError" density="comfortable" required class="pb-2" />

            <v-text-field v-model="password" label="Password" type="password" prepend-inner-icon="mdi-lock"
              :error-messages="passwordError" density="comfortable" required class="pb-2" />

            <v-alert v-if="errorMessage" type="error" class="mb-3" dense border="start">
              {{ errorMessage }}
            </v-alert>

            <v-btn :loading="loading" type="submit" color="primary" block size="large">
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { AccessTokenKey, authUrl, DefaultErrorMsg } from '@/services/constants'
import { fetchApi } from '@/services/fetchHelper';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

// State
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const usernameError = ref('');
const passwordError = ref('');
const loading = ref(false);


async function handleLogin() {
  errorMessage.value = ''
  usernameError.value = ''
  passwordError.value = ''

  if (!username.value) {
    usernameError.value = 'Username is required'
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
  }
  if (usernameError.value || passwordError.value) {
    return
  }

  loading.value = true
  try {
    const response = await fetchApi<any>(
      authUrl,
      {
        method: 'POST',
        body: {
          tenant: "develop",
          username: username.value,
          password: password.value
        },
      }
    );
    
    if(response?.statusCode != 200){
      let respBody = JSON.parse(response.body);
      errorMessage.value = respBody.message || DefaultErrorMsg;
    } else {
      let respBody = JSON.parse(response.body);
      localStorage.setItem(AccessTokenKey, respBody.token)
  
      // Navigate to home
      router.push('/')
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
