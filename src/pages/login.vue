<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card flat class="pa-6" elevation="10">
          <v-card-title class="text-h5 mb-4 justify-center">Login</v-card-title>

          <v-form @submit.prevent="handleLogin" ref="formRef">
            <v-text-field v-model="userId" label="User Id" prepend-inner-icon="mdi-account"
              :error-messages="userIdError" density="comfortable" required class="pb-2" />

            <v-text-field v-model="password" label="Password" type="password" prepend-inner-icon="mdi-lock"
              :error-messages="passwordError" density="comfortable" required class="pb-2" />

            <v-alert v-if="errorMessage" type="error" class="mb-3" dense border="start">
              {{ errorMessage }}
            </v-alert>

            <v-btn :loading="loading" type="submit" variant="tonal" color="primary" block size="large">
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { AuthorizeAPIUrl } from '@/services/common/apiUrls';
import { AccessTokenKey, DefaultErrorMsg } from '@/services/common/constants'
import { fetchApi } from '@/services/common/fetchHelper';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

// State
const userId = ref('');
const password = ref('');
const errorMessage = ref('');
const userIdError = ref('');
const passwordError = ref('');
const loading = ref(false);


async function handleLogin() {
  errorMessage.value = ''
  userIdError.value = ''
  passwordError.value = ''

  if (!userId.value) {
    userIdError.value = 'UserId is required'
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
  }
  if (userIdError.value || passwordError.value) {
    return
  }

  loading.value = true
  try {
    const response = await fetchApi<any>(
      AuthorizeAPIUrl,
      {
        method: 'POST',
        body: {
          userId: userId.value,
          password: password.value
        },
      }
    );

    if (response?.status != "ok") {
      let respBody = JSON.parse(response.body);
      errorMessage.value = respBody.message || DefaultErrorMsg;
    } else {
      localStorage.setItem(AccessTokenKey, response?.token)
      localStorage.setItem('userDetails', JSON.stringify(response?.userDetails || {}));

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
