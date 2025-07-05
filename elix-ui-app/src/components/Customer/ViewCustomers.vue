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
import { computed, ref } from 'vue'

// v-dialog
const dialog = ref(false)

const model = ref({
  name: '',
  progress: 0,
})

const selected = ref()

const headers = [
  { title: 'Customer Name', value: 'customerName' },
  { title: 'Company Name', value: 'companyName' },
  { title: 'MobileNo', value: 'mobileNo' },
  { title: 'Actions', value: 'actions' },
]

const items = ref([
  { customerName: 'Surya', companyName: 'Elix', mobileNo: '9879387495' },
  { customerName: 'Ananya', companyName: 'BlueSky Corp', mobileNo: '9123456780' },
  { customerName: 'Rahul', companyName: 'Sunrise Ltd', mobileNo: '9876543210' },
  { customerName: 'Priya', companyName: 'Nova Systems', mobileNo: '9001122334' },
  { customerName: 'Arjun', companyName: 'TechWave', mobileNo: '9988776655' },
  { customerName: 'Meera', companyName: 'GreenField', mobileNo: '9112233445' },
  { customerName: 'Vikram', companyName: 'Zenith Solutions', mobileNo: '9870011223' },
  { customerName: 'Divya', companyName: 'ApexSoft', mobileNo: '9123456789' },
  { customerName: 'Karthik', companyName: 'Nimbus Tech', mobileNo: '9090909090' },
  { customerName: 'Neha', companyName: 'BrightSpark', mobileNo: '9876549876' },
  { customerName: 'Rohan', companyName: 'Vertex Inc', mobileNo: '9012345678' },
])


// Adjust progress bar color based on progress
const color = computed(() => progress => {
  if (progress === 100) return 'green-lighten-2'
  if (progress >= 90) return 'green-lighten-4'
  if (progress >= 70) return 'light-green-lighten-2'
  if (progress >= 50) return 'light-green-lighten-4'
  return 'blue-grey'
})


// Select & load data to be edited
function edit(item) {
  selected.value = item.id
  model.value = { name: item.name, progress: item.progress }
  dialog.value = true
}
</script>