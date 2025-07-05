<template>
    <v-app>
        <v-main>
            <v-dialog v-model="showDialog" persistent max-width="500">
                <v-card>
                    <v-card-title class="text-h4">Login</v-card-title>
                    <form @submit.prevent="handleLogin">
                        <v-container>
                            <v-row>
                                <v-col class="pa-4">
                                    <label for="userName">Username</label>
                                    <input id="userName" v-model="userName" type="text" required
                                        autocomplete="username" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pa-4">
                                    <label for="password">Password</label>
                                    <input id="password" v-model="password" type="password" required
                                        autocomplete="current-password" />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pa-4">
                                    <button type="submit">Login</button>
                                </v-col>
                            </v-row>
                        </v-container>
                        <p v-if="error" class="error">{{ error }}</p>

                    </form>
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'

const showDialog = ref(true) // 👈 show by default

const handleLogin = () => {
    // Simulate a login process
    if (userName.value === 'admin' && password.value === 'password') {
        // Redirect to the main content page
        localStorage.setItem('access_token', 'valid1234');
        window.location.href = '/'
    } else {
        error.value = 'Invalid username or password'
    }
}
</script>
<style scoped>
label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 0.7rem;
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

button:hover {
    background: #1565c0;
}

.error {
    color: #d32f2f;
    margin-top: 1rem;
    text-align: center;
}
</style>