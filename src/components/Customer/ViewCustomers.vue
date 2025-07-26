<template>
  <!-- Search Box -->
  <v-row dense>
    <v-col cols="3">
      <v-text-field density="compact" variant="outlined" v-model="searchQuery"
        label="Search by name or company or mobile" prepend-inner-icon="mdi-magnify" clearable />
    </v-col>
  </v-row>
  <v-row dense>
    <!-- Data Table -->
    <v-data-table density="compact" :headers="headers" :items="filteredItems">
      <template v-slot:item.actions="{ item }">
        <v-btn density="compact" variant="text" icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog with ManageCustomer -->
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="65%" max-height="100%">
      <v-card flat prepend-icon="mdi-account" title="Customer Profile" rounded>
        <template #append>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
        </template>
        <v-card-item>
          <ManageCustomer v-if="selectedCustomer" :customer="selectedCustomer" @after-submit="onDialogClose" />
        </v-card-item>
      </v-card>
    </v-dialog>
  </v-row>


</template>

<script setup lang="ts">
import { useLoader } from '@/composables/useLoader'
import { DataSourceObjects } from '@/models/api'
import { ICustomer } from '@/models/customer'
import { apiGetAll } from '@/services/apiService'
import { onMounted, ref, computed } from 'vue'

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

const { showLoader, hideLoader } = useLoader();

// Load data on mount
onMounted(() => {
  loadAllCustomers();
})

function loadAllCustomers() {
  showLoader()
  apiGetAll<ICustomer[]>(DataSourceObjects.customer)
    .then(resp => {
      customers.value = resp
      items.value = customers.value.map(x => ({
        firstName: x.firstName,
        lastName: x.lastName,
        companyName: x.companyName,
        mobileNo: x.contactInfo?.mobileNo ?? '',
        customerId: x.customerId,
      }))
    })
    .finally(() => hideLoader())
}

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

function onDialogClose() {
  dialog.value = false;
  loadAllCustomers();
}

</script>
