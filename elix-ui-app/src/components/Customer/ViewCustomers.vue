<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:item.actions="{ item }">
      <v-btn variant="text" icon @click="edit(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </v-data-table>

  <v-dialog v-model="dialog" max-width="1000">
    <!-- <ManageCustomer /> -->
    <v-card>
      <v-card-item>
        <ManageCustomer />
      </v-card-item>
      <!-- <v-card-title>Edit Customer</v-card-title>
      <v-card-text>
        <v-text-field label="Name" />
        <v-slider label="Progress" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="save">Save</v-btn>
        <v-btn>Cancel</v-btn>
      </v-card-actions> -->
    </v-card>

  </v-dialog>
</template>
<script setup lang="ts">
import { DataSourceObjects } from '@/models/api'
import { ICustomer } from '@/models/customer'
import { apiGetAll } from '@/services/apiService'
import { HideLoaderKey, ShowLoaderKey } from '@/services/constants'
import { inject, onMounted, ref } from 'vue'

// v-dialog
const dialog = ref(false)

const model = ref({
  name: '',
  progress: 0,
})

const headers = [
  { title: 'First Name', value: 'firstName' },
  { title: 'Last Name', value: 'lastName' },
  { title: 'Company Name', value: 'companyName' },
  { title: 'MobileNo', value: 'mobileNo' },
  { title: 'Actions', value: 'actions' },
]

const items = ref<{ firstName: string, lastName: string, companyName: string, mobileNo: string }[]>([]);
const showLoader = inject<() => void>(ShowLoaderKey);
const hideLoader = inject<() => void>(HideLoaderKey);
onMounted(() => {
  showLoader();
  apiGetAll(DataSourceObjects.customer)
    .then(resp => {
      var customers: ICustomer[] = resp.value;
      items.value = customers.map(x => ({
        firstName: x.firstName,
        lastName: x.lastName,
        companyName: x.companyName,
        mobileNo: x.contactInfo?.mobileNo
      }))
    })
    .finally(() => hideLoader());
})

// Select & load data to be edited
function edit(item) {
  model.value = { name: item.name, progress: item.progress }
  dialog.value = true
}
</script>;