<template>
  <v-app>
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
  //
</script>
