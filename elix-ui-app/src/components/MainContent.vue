<script setup lang="ts">
import { useRouter } from "vue-router";

var router = useRouter();

const navigateTo = (route: string) => {
  router.push(route);
};
</script>

<template>
  <v-responsive>
    <v-app full-height>
      <v-app-bar title="ELIX"></v-app-bar>

      <v-navigation-drawer>
        <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-title>Manage Orders</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item title="Order Booking" />
                  <v-list-item title="Manage Order" />
                  <v-list-item title="Job Card Creation" />
                  <v-list-item title="Order Summary" />
                  <v-list-item title="Order Status" />
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Manage Customers</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item title="Register Customer" @click="navigateTo('/MainContent/RegisterCustomer')"></v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
