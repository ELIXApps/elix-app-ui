<template>
    <!-- TOP PART: FORM -->
    <v-card class="mb-3">
        <v-card-item>
            <form @submit.prevent="submitForm">
                <!-- First Row -->
                <v-row dense>
                    <v-col cols="3">
                        <v-select v-model="orderType.value.value" :error-messages="orderType.errorMessage.value"
                            :items="orderTypes" label="Order Type" density="compact" variant="outlined" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field v-model="customer.value.value" :error-messages="customer.errorMessage.value"
                            label="Customer" density="compact" variant="outlined" />
                    </v-col>

                    <!-- ORDER DATE -->
                    <v-col cols="3">
                        <v-menu v-model="orderDateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y>
                            <template #activator="{ props }">
                                <v-text-field v-bind="props"
                                    :model-value="orderDate.value.value ? orderDate.value.value.toDateString() : ''"
                                    :error-messages="orderDate.errorMessage.value" label="Order Date" readonly
                                    density="compact" variant="outlined" />
                            </template>
                            <v-date-picker v-model="orderDate.value.value" @update:modelValue="orderDateMenu = false" />
                        </v-menu>
                    </v-col>

                    <!-- DUE DATE -->
                    <v-col cols="3">
                        <v-menu v-model="dueDateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y>
                            <template #activator="{ props }">
                                <v-text-field v-bind="props"
                                    :model-value="dueDate.value.value ? dueDate.value.value.toDateString() : ''"
                                    :error-messages="dueDate.errorMessage.value" label="Due Date" readonly
                                    density="compact" variant="outlined" />
                            </template>
                            <v-date-picker v-model="dueDate.value.value" @update:modelValue="dueDateMenu = false" />
                        </v-menu>
                    </v-col>
                </v-row>

                <!-- Second Row -->
                <v-row dense>
                    <v-col cols="3">
                        <v-autocomplete v-model="designId.value.value" :error-messages="designId.errorMessage.value"
                            :items="designOptions" label="Design ID" density="compact" variant="outlined" />
                    </v-col>
                    <v-col cols="3">
                        <v-select v-model="product.value.value" :error-messages="''" :items="productOptions"
                            label="product" density="compact" readonly variant="outlined" />
                    </v-col>
                    <v-col cols="3" class="d-flex justify-space-between">
                        <template v-if="true">
                            <!-- Specification Name -->
                            <div class="d-flex flex-column">
                                <div class="text-caption text-medium-emphasis">Specification</div>
                                <div class="text-body-1">Size</div>
                            </div>
                            <!-- Specification Value -->
                            <div style="width: 60%;">
                                <v-select v-if="true" :items="[]" label="Spec Value" density="compact"
                                    variant="outlined" />
                                <v-text-field v-else label="Spec Value" type="number" density="compact"
                                    variant="outlined" />
                            </div>

                            <!-- Unit -->
                            <div class="d-flex flex-column">
                                <div class="text-caption text-medium-emphasis">Unit</div>
                                <div class="text-body-1">No</div>
                            </div>

                        </template>
                        <div v-else class="text-medium-emphasis mt-3">Select product to show specifications</div>
                    </v-col>
                    <v-col cols="3">
                        <v-select v-model="goldCarat.value.value" :error-messages="goldCarat.errorMessage.value"
                            :items="purityOptions" label="Gold Carat" density="compact" variant="outlined" />
                    </v-col>
                </v-row>

                <!-- Third Row -->
                <v-row dense>
                    <v-col cols="3">
                        <v-select v-model="goldColor.value.value" :error-messages="goldColor.errorMessage.value"
                            :items="goldColors" label="Gold Color" density="compact" variant="outlined" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="goldWeight.value.value" :error-messages="goldWeight.errorMessage.value"
                            label="Gold Weight in Gms" density="compact" variant="outlined" type="number" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="diamondWeight.value.value"
                            :error-messages="diamondWeight.errorMessage.value" label="Diamond Weight in Cts"
                            density="compact" variant="outlined" type="number" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="colorStoneWeight.value.value"
                            :error-messages="colorStoneWeight.errorMessage.value" label="Color Stone Weight in Cts"
                            density="compact" variant="outlined" type="number" />
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="6">
                        <v-textarea v-model="specialRemarks.value.value" hide-details density="compact" persistent-clear
                            rows="3" clearable label="Special Remarks" variant="outlined"></v-textarea>
                    </v-col>
                </v-row>

                <!-- Fourth Row -->
                <v-row dense class="d-flex justify-space-between">
                    <v-col cols="8" class="d-flex">
                        <v-responsive class="mr-2" v-for="(preview, index) in imagePreviews" :key="index"
                            max-width="170" max-height="170">
                            <v-img :src="preview" cover />
                        </v-responsive>
                    </v-col>
                    <v-col cols="auto" class="d-flex flex-column justify-end">
                        <v-btn density="compact" variant="outlined" size="x-large" type="submit">
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-item>

    </v-card>

    <!-- BOTTOM PART: DATATABLE -->
    <v-card>
        <v-card-title>
            <v-text-field hide-details density="compact" width="25%" variant="outlined" v-model="searchQuery"
                label="Search by Booking ID, Design ID etc" prepend-inner-icon="mdi-magnify" clearable />
        </v-card-title>
        <v-data-table density="compact" :headers="tableHeaders" :items="tableItems" :items-per-page="5"
            :items-per-page-options="[5, 10, 25, 50]" class="elevation-1" />
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { goldColors, productOptions, purityOptions } from '@/models/product'


// Search input
const searchQuery = ref('')

// Static options
const orderTypes = ['Customer', 'Stock', 'Rework']
const designOptions = ['D1001', 'D1002', 'D1003'] //TODO fetch from DB

// Form validation
const { handleSubmit, setFieldValue } = useForm({
    validationSchema: {
        orderType: v => !!v || 'Order Type is required',
        customer: v => !!v || 'Customer is required',
        orderDate: v => !!v || 'Order Date is required',
        dueDate: v => !!v || 'Due Date is required',
        designId: v => !!v || 'Design ID is required',
        goldCarat: v => !!v || 'Gold Carat is required',
        goldColor: v => !!v || 'Gold Color is required',
        goldWeight: v => !!v || 'Gold Weight is required',
        diamondWeight: v => !!v || 'Diamond Weight is required',
        colorStoneWeight: v => !!v || 'Color Stone Weight is required',
    }
})

setFieldValue('product', productOptions[0].product)
const orderType = useField<string>('orderType')
const product = useField<string>('product')
const customer = useField('customer')
const orderDate = useField<Date>('orderDate')
const dueDate = useField<Date>('dueDate')
const designId = useField<string>('designId')
const goldCarat = useField<string>('goldCarat')
const goldColor = useField<string>('goldColor')
const goldWeight = useField('goldWeight')
const diamondWeight = useField('diamondWeight')
const colorStoneWeight = useField('colorStoneWeight')
const specialRemarks = useField('specialRemarks')

const orderDateMenu = ref(false)
const dueDateMenu = ref(false)

// Product label (static)

// Images

const imagePreviews = ref<string[]>([])

// Table
const tableHeaders = [
    { title: 'Order Booking ID', key: 'id' },
    { title: 'Order Date', key: 'orderDate' },
    { title: 'Due Date', key: 'dueDate' },
    { title: 'Design ID', key: 'designId' },
]
const tableItems = [
    { id: 'OB001', orderDate: '2024-01-01', dueDate: '2024-01-15', designId: 'D1001' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
    { id: 'OB002', orderDate: '2024-01-02', dueDate: '2024-01-16', designId: 'D1002' },
]

const submitForm = handleSubmit(values => {
    console.log('Form Submitted:', values)
})

</script>
