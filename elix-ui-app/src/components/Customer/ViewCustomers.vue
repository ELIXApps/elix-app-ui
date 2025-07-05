<template>
  <!-- Search Box -->
  <v-row>
    <v-col cols="4">
      <v-text-field v-model="searchQuery" label="Search by name or company or mobile" prepend-inner-icon="mdi-magnify" clearable
        class="mb-4" />
    </v-col>
  </v-row>

  <!-- Data Table -->
  <v-data-table :headers="headers" :items="filteredItems" class="elevation-1">
    <template v-slot:item.actions="{ item }">
      <v-btn variant="text" icon @click="edit(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </v-data-table>

  <!-- Dialog with ManageCustomer -->
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="60%">
    <v-card prepend-icon="mdi-account" title="Customer Profile" rounded>
      <v-card-item>
        <ManageCustomer v-if="selectedCustomer" :customer="selectedCustomer" @after-submit="dialog = false" />
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { DataSourceObjects } from '@/models/api'
import { ICustomer } from '@/models/customer'
import { apiGetAll } from '@/services/apiService'
import { HideLoaderKey, ShowLoaderKey } from '@/services/constants'
import { inject, onMounted, ref, computed } from 'vue'

// v-dialog
const dialog = ref(false)

// Search input
const searchQuery = ref('')

// Table headers
const headers = [
  { title: 'First Name', value: 'firstName', sortable: true },
  { title: 'Last Name', value: 'lastName', sortable: true },
  { title: 'Company Name', value: 'companyName', sortable: true },
  { title: 'Mobile Number', value: 'mobileNo', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
]

// All customers from API
const customers = ref<ICustomer[]>([])

// Table items for display
const items = ref<
  { firstName: string; lastName: string; companyName: string; mobileNo: string; customerId: string }[]
>([])

const selectedCustomer = ref<ICustomer | null>(null)

const showLoader = inject<() => void>(ShowLoaderKey)
const hideLoader = inject<() => void>(HideLoaderKey)

// Load data on mount
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

// Computed: filtered items by search query
const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return items.value

  return items.value.filter(
    i =>
      i.firstName.toLowerCase().includes(query) ||
      i.lastName.toLowerCase().includes(query) ||
      i.companyName.toLowerCase().includes(query) ||
      i.mobileNo.toLowerCase().includes(query)
  )
})

// Edit handler
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
