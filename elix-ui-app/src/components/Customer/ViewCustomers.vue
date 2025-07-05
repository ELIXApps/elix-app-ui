<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:item.actions="{ item }">
      <v-btn variant="text" icon @click="edit(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </v-data-table>

  <v-dialog v-model="dialog" max-width="1000">
    <v-card>
      <v-card-item>
        <ManageCustomer v-if="selectedCustomer" :customer="selectedCustomer" />
      </v-card-item>
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

const headers = [
  { title: 'First Name', value: 'firstName' },
  { title: 'Last Name', value: 'lastName' },
  { title: 'Company Name', value: 'companyName' },
  { title: 'Mobile Number', value: 'mobileNo' },
  { title: 'Actions', value: 'actions' },
]

// Table items
const items = ref<
  { firstName: string; lastName: string; companyName: string; mobileNo: string; customerId: string }[]
>([])

const customers = ref<ICustomer[]>([])
const selectedCustomer = ref<ICustomer | null>(null)

const showLoader = inject<() => void>(ShowLoaderKey)
const hideLoader = inject<() => void>(HideLoaderKey)

// Load customers on mount
onMounted(() => {
  showLoader?.()
  apiGetAll(DataSourceObjects.customer)
    .then(resp => {
      customers.value = resp.value
      items.value = customers.value.map(x => ({
        firstName: x.firstName,
        lastName: x.lastName,
        companyName: x.companyName,
        mobileNo: x.contactInfo?.mobileNo ?? '',
        customerId: x.customerId,
      }))
    })
    .finally(() => hideLoader?.())
})

// Select & load data to be edited
function edit(item: { customerId: string }) {
  const customer = customers.value.find(c => c.customerId === item.customerId)
  if (customer) {
    selectedCustomer.value = customer
    dialog.value = true
  } else {
    console.warn('Customer not found for ID:', item.customerId)
  }
}
</script>
