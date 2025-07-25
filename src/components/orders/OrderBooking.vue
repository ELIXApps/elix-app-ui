<template>
    <!-- TOP PART: FORM -->
    <v-card flat class="mb-3">
        <v-card-item>
            <form @submit.prevent="submitForm">
                <!-- First Row -->
                <v-row dense>
                    <v-col cols="3">
                        <v-select v-model="orderType" :error-messages="errors.orderType"
                            :items="Object.values(OrderType)" label="Order Type" density="compact" variant="outlined" />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field v-model="customer" :error-messages="errors.customer" label="Customer"
                            density="compact" variant="outlined" />
                    </v-col>

                    <!-- ORDER DATE -->
                    <v-col cols="3">
                        <v-menu v-model="orderDateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y>
                            <template #activator="{ props }">
                                <v-text-field v-bind="props"
                                    :model-value="orderDate ? new Date(orderDate).toDateString() : ''"
                                    :error-messages="errors.orderDate" label="Order Date" readonly density="compact"
                                    variant="outlined" />
                            </template>
                            <v-date-picker v-model="orderDate" @update:modelValue="orderDateMenu = false" />
                        </v-menu>
                    </v-col>

                    <!-- DUE DATE -->
                    <v-col cols="3">
                        <v-menu v-model="dueDateMenu" :close-on-content-click="false" transition="scale-transition"
                            offset-y>
                            <template #activator="{ props }">
                                <v-text-field v-bind="props"
                                    :model-value="dueDate ? new Date(dueDate).toDateString() : ''"
                                    :error-messages="errors.dueDate" label="Due Date" readonly density="compact"
                                    variant="outlined" />
                            </template>
                            <v-date-picker v-model="dueDate" @update:modelValue="dueDateMenu = false" />
                        </v-menu>
                    </v-col>
                </v-row>

                <!-- Second Row -->
                <v-row dense>
                    <v-col cols="3">
                        <v-autocomplete v-model="designNo" :error-messages="errors.designNo"
                            :items="allDesigns.map(x => x.designNo)" label="Design No." density="compact"
                            variant="outlined" @update:model-value="onDesginNoSelect" />
                    </v-col>
                    <v-col cols="3">
                        <v-select v-model="product" :error-messages="''" :items="productOptions" label="product"
                            density="compact" readonly variant="outlined" />
                    </v-col>
                    <v-col cols="3" class="d-flex justify-space-between">

                        <!-- Specification Name -->
                        <div class="d-flex flex-column">
                            <div class="text-caption text-medium-emphasis">Specification</div>
                            <div class="text-body-1">{{ selectedProductOption?.specification }}</div>
                        </div>
                        <!-- Specification Value -->
                        <div style="width: 60%;">
                            <v-select v-if="selectedProductOption?.hasMultipleSpecValues" v-model="specValue"
                                :error-messages="errors.specValue" :items="selectedProductOption?.specificationOptions"
                                label="Spec Value" density="compact" variant="outlined" />
                            <v-text-field v-else v-model="specValue" :error-messages="errors.specValue"
                                label="Spec Value" type="number" density="compact" variant="outlined" />
                        </div>

                        <!-- Unit -->
                        <div class="d-flex flex-column">
                            <div class="text-caption text-medium-emphasis">Unit</div>
                            <div class="text-body-1">{{ selectedProductOption?.unit }}</div>
                        </div>

                    </v-col>
                    <v-col cols="3">
                        <v-select v-model="goldCarat" :error-messages="errors.goldCarat" :items="purityOptions"
                            label="Gold Carat" density="compact" variant="outlined" />
                    </v-col>
                </v-row>

                <!-- Third Row -->
                <v-row dense>
                    <v-col cols="3">
                        <v-select v-model="goldColor" :error-messages="errors.goldColor" :items="goldColors"
                            label="Gold Color" density="compact" variant="outlined" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="goldWeight" :error-messages="errors.goldWeight"
                            label="Gold Weight in Gms" density="compact" variant="outlined" type="number" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="diamondWeight" :error-messages="errors.diamondWeight"
                            label="Diamond Weight in Cts" density="compact" variant="outlined" type="number" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="colorStoneWeight" :error-messages="errors.colorStoneWeight"
                            label="Color Stone Weight in Cts" density="compact" variant="outlined" type="number" />
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="6">
                        <v-textarea v-model="specialRemarks" hide-details density="compact" persistent-clear rows="4"
                            clearable label="Special Remarks" variant="outlined"></v-textarea>
                    </v-col>
                    <v-col cols="4">
                        <div class="text-caption text-medium-emphasis pb-2">Design Images</div>
                        <div class="d-flex">
                            <template v-if="imagePreviews?.length">
                                <v-responsive class="mr-2" v-for="(preview, index) in imagePreviews" :key="index"
                                    max-width="100" max-height="100">
                                    <v-img :src="preview" cover />
                                </v-responsive>
                            </template>
                            <div v-else class="text-medium-emphasis mt-3">
                                {{ designNo ? 'No images uploaded' : 'Please select a Desgin' }}</div>
                        </div>
                    </v-col>
                    <v-col cols="2" class="d-flex flex-column justify-end">
                        <v-btn density="compact" variant="tonal" color="#4CAF50" size="x-large" type="submit">
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-item>
    </v-card>

    <!-- BOTTOM PART: DATATABLE -->
    <v-card flat>
        <v-card-title>
            <v-text-field hide-details density="compact" width="25%" variant="outlined" v-model="searchQuery"
                label="Search by Order ID, Design No. etc" prepend-inner-icon="mdi-magnify" clearable />
        </v-card-title>
        <v-data-table density="compact" :headers="tableHeaders" :items="filteredItems" :items-per-page="5"
            :items-per-page-options="[5, 10, 25, 50]" class="elevation-1">
            <template v-slot:item.actions="{ item }">
                <v-btn density="compact" variant="text" icon @click="edit(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </template>
            <template v-slot:item.orderDate="{ item }">
                {{ new Date(item.orderDate).toDateString() }}
            </template>
            <template v-slot:item.dueDate="{ item }">
                {{ new Date(item.dueDate).toDateString() }}
            </template>
        </v-data-table>
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { goldColors, productOptions, purityOptions } from '@/models/product'
import { IOrder, OrderType } from '@/models/order'
import { object, string, date } from 'yup'
import { IDesign } from '@/models/design'
import { apiCreate, apiGetAll, apiUpdate } from '@/services/apiService'
import { DataSourceObjects } from '@/models/api'
import { fetchApi } from '@/services/fetchHelper'
import { DesignImageUrl } from '@/services/apiUrls'
import { useSnackbar } from '@/composables/useSnackbar'
import { useLoader } from '@/composables/useLoader'
import { DefaultErrorMsg } from '@/services/constants'

const { showSnackbar } = useSnackbar();
const { showLoader, hideLoader } = useLoader()
// Search input
const searchQuery = ref('')

// Static options
const allDesigns = ref<IDesign[]>([]);
const allOrders = ref<IOrder[]>([]);

onMounted(() => {
    apiGetAll<IDesign[]>(DataSourceObjects.design)
        .then(resp => {
            allDesigns.value = resp
        })

   loadAllOrders();
});

function loadAllOrders() {
 apiGetAll<IOrder[]>(DataSourceObjects.order)
        .then(resp => {
            allOrders.value = resp;
            console.log(resp)
        })
}


// Table
const tableHeaders = [
    { title: 'Order Id', key: 'orderId', sortable: true },
    { title: 'Design No', key: 'designNo', sortable: true },
    { title: 'Order Type', key: 'orderType', sortable: true },
    { title: 'Customer', key: 'customer', sortable: true },
    { title: 'Order Date', key: 'orderDate', sortable: true },
    { title: 'Due Date', key: 'dueDate', sortable: true },
    { title: 'Actions', value: 'actions', sortable: false },
]

const filteredItems = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return allOrders.value;

    return allOrders.value.filter(
        i =>
            i.designNo.toLowerCase().includes(query) ||
            i.orderId.toLowerCase().includes(query) ||
            i.orderDate.toLowerCase().includes(query) ||
            i.dueDate.toLowerCase().includes(query) ||
            i.orderType.toLowerCase().includes(query) ||
            i.customer.toLowerCase().includes(query)
    )
});

const schema = object({
    orderType: string().required('Order Type is required'),
    customer: string().required('Customer is required'),
    orderDate: date().required('Order Date is required'),
    dueDate: date().required('Due Date is required'),
    designNo: string().required('Design No. is required'),
    goldCarat: string().required('Gold Carat is required'),
    goldColor: string().required('Gold Color is required'),
    goldWeight: string().required('Gold Weight is required'),
    diamondWeight: string().required('Diamond Weight is required'),
    colorStoneWeight: string().required('Color Stone Weight is required'),
    specialRemarks: string().nullable(),
    specValue: string().required()
})
// Form validation
const { handleSubmit, defineField, errors, setValues, values } = useForm<IOrder>({
    validationSchema: schema,
    validateOnMount: false
});

const [orderType] = defineField('orderType')
const [customer] = defineField('customer')
const [specValue] = defineField('specValue')
const [orderDate] = defineField('orderDate')
const [dueDate] = defineField('dueDate')
const [designNo] = defineField('designNo')
const [product] = defineField('productData.product')
const [goldCarat] = defineField('goldCarat')
const [goldColor] = defineField('goldColor')
const [goldWeight] = defineField('goldWeight')
const [diamondWeight] = defineField('diamondWeight')
const [colorStoneWeight] = defineField('colorStoneWeight')
const [specialRemarks] = defineField('specialRemarks')

const orderDateMenu = ref(false)
const dueDateMenu = ref(false)

const selectedDesign = computed(() => {
    return allDesigns.value.find(d => d.designNo == designNo.value);
})
const selectedProductOption = computed(() => {
    return productOptions.find(p => p.product == product.value);
})

const imagePreviews = ref<string[]>([])

function onDesginNoSelect() {
    setValues({
        ...values,
        ...selectedDesign.value
    });
    setImagePreviews();
}

function setImagePreviews() {
    getDesignImageUrl(designNo.value).then(resp => imagePreviews.value = resp);
}

async function getDesignImageUrl(designNo: string) {
    try {
        return await fetchApi<string[]>(DesignImageUrl(designNo), {
            method: 'GET'
        });
    } catch (error) {
        showSnackbar("Unexpected error while fetching design images. Please try again later", 'danger');
    }
}


const submitForm = handleSubmit(async values => {
    console.log('Form Submitted:', values)
    showLoader();
    var response = values.orderId ? await apiUpdate(DataSourceObjects.order, values) : await apiCreate(DataSourceObjects.order, values);
    if (!['created', 'updated'].includes(response.status)) {
        showSnackbar(DefaultErrorMsg, 'danger');
        hideLoader();
        return;
    }
    loadAllOrders();
    hideLoader();
    showSnackbar("Order saved successfully");
})

function edit(item: IOrder) {
    setValues(item);
    setImagePreviews();
}

</script>
