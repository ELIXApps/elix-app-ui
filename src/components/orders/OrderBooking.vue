<template>
    <!-- TOP PART: FORM -->
    <v-card flat class="mb-3 order-booking-form">
        <v-card-item class="pa-0">
            <form @submit.prevent="submitForm">
                <v-row class="mb-2">
                    <v-col cols="9">
                        <!-- First Row -->
                        <v-row dense>
                            <v-col cols="3">
                                <v-select v-model="orderType" :error-messages="errors.orderType"
                                    :items="Object.values(OrderType)" label="Order Type" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="3">
                                <v-text-field v-model="customer" :error-messages="errors.customer" label="Customer"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <!-- ORDER DATE -->
                            <v-col cols="3">
                                <v-menu v-model="orderDateMenu" :close-on-content-click="false"
                                    transition="scale-transition" offset-y>
                                    <template #activator="{ props }">
                                        <v-text-field v-bind="props"
                                            :model-value="orderDate ? new Date(orderDate).toDateString() : ''"
                                            :error-messages="errors.orderDate" label="Order Date" readonly
                                            density="compact" variant="outlined" />
                                    </template>
                                    <v-date-picker v-model="orderDate" @update:modelValue="orderDateMenu = false" />
                                </v-menu>
                            </v-col>

                            <!-- DUE DATE -->
                            <v-col cols="3">
                                <v-menu v-model="dueDateMenu" :close-on-content-click="false"
                                    transition="scale-transition" offset-y>
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
                                <v-select v-model="productData.product" :items="productOptions" label="product"
                                    density="compact" readonly variant="outlined" />
                            </v-col>
                            <v-col cols="3">
                                <v-select v-if="productData?.hasMultipleSpecValues" v-model="specValue"
                                    :error-messages="errors.specValue" :items="productData?.specificationOptions"
                                    :label="productData?.specification || 'Specification'" density="compact"
                                    variant="outlined" :suffix="productData?.unit" />
                                <v-text-field v-else v-model="specValue" :error-messages="errors.specValue"
                                    :label="productData?.specification || 'Specification'" type="number"
                                    density="compact" variant="outlined" :suffix="productData?.unit" />
                            </v-col>

                            <v-col cols="3">
                                <v-select v-model="goldCarat" :error-messages="errors.goldCarat" :items="purityOptions"
                                    label="Gold K" density="compact" variant="outlined" />
                            </v-col>
                        </v-row>

                        <!-- Third Row -->
                        <v-row dense>
                            <v-col cols="3">
                                <v-select v-model="goldColor" :error-messages="errors.goldColor" :items="goldColors"
                                    label="Gold Color" density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-max-decimals="3" v-model="goldWeight"
                                    :error-messages="errors.goldWeight" label="Gold Wt gms" density="compact"
                                    variant="outlined" type="number" />
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-max-decimals="3" v-model="diamondWeight"
                                    :error-messages="errors.diamondWeight" label="Dia Wt Cts" density="compact"
                                    variant="outlined" type="number" />
                            </v-col>
                            <v-col cols="3">
                                <v-text-field v-max-decimals="3" v-model="colorStoneWeight"
                                    :error-messages="errors.colorStoneWeight" label="CS Wt Cts" density="compact"
                                    variant="outlined" type="number" />
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="6">
                                <v-textarea v-model="specialRemarks" hide-details density="compact" persistent-clear
                                    rows="3" clearable label="Special Remarks" variant="outlined"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="3">
                        <div class="text-caption text-medium-emphasis pb-2">Design Images</div>
                        <div class="d-flex">
                            <template v-if="designImagesLoading">
                                <v-responsive v-for="n in 3" :key="n" class="mr-2">
                                    <v-skeleton-loader max-height="100" type="image" />
                                </v-responsive>
                            </template>
                            <template v-else-if="imagePreviews?.length">
                                <v-responsive class="mr-2" v-for="(preview, index) in imagePreviews" :key="index"
                                    max-width="100" max-height="100">
                                    <v-img v-image-viewer="preview" :src="preview" cover />
                                </v-responsive>
                            </template>
                            <div v-else class="text-medium-emphasis mt-3">
                                {{ designNo ? 'No images uploaded' : 'Please select a Desgin' }}</div>
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" class="d-flex justify-end align-end">
                        <v-btn class="me-2" density="compact" variant="tonal" color="danger" :onclick="resetOrderForm"
                            size="x-large">
                            {{ values.orderId ? 'Cancel' : 'Clear' }}
                        </v-btn>
                        <v-btn :loading="isSubmitting" density="compact" variant="tonal" color="success" size="x-large"
                            type="submit">
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
            </form>
        </v-card-item>
    </v-card>

    <!-- BOTTOM PART: DATATABLE -->
    <v-card flat>
        <v-card-title class="pa-0 pb-3">
            <v-text-field hide-details density="compact" width="25%" variant="outlined" v-model="searchQuery"
                label="Search by Order ID, Design No. etc" prepend-inner-icon="mdi-magnify" clearable />
        </v-card-title>
        <v-data-table v-model="selected" density="compact" :headers="tableHeaders" :items="filteredItems"
            item-value="orderId" :items-per-page="5" show-select :items-per-page-options="[5, 10, 25, 50]"
            class="elevation-1">
            <template v-slot:header.actions>
                <template v-if="selected.length > 1">
                    <v-menu>
                        <template #activator="{ props }">
                            <span>Actions</span>
                            <v-btn v-bind="props" color="primary" variant="text" icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="bulkDelete" append-icon="mdi-trash-can" title="Delete Selected">
                            </v-list-item>
                            <!-- You can add more bulk options here -->
                        </v-list>
                    </v-menu>
                </template>
                <template v-else>
                    Actions
                </template>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn class="me-1" density="compact" variant="text" icon @click="edit(item)">
                    <v-icon color="primary">mdi-pencil</v-icon>
                </v-btn>
                <v-btn density="compact" variant="text" icon @click="deleteItem(item)">
                    <v-icon color="danger">mdi-trash-can</v-icon>
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
import { apiCreate, apiGetAll, apiUpdate } from '@/services/common/api'
import { DataSourceObjects } from '@/models/api'
import { useSnackbar } from '@/composables/useSnackbar'
import { useLoader } from '@/composables/useLoader'
import { DefaultErrorMsg } from '@/services/common/constants'
import { getImages } from '@/services/design'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { showSnackbar } = useSnackbar();
const { showLoader, hideLoader } = useLoader();
const { showConfirm } = useConfirmDialog();
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
    showLoader();
    apiGetAll<IOrder[]>(DataSourceObjects.order)
        .then(resp => {
            allOrders.value = resp;
        }).finally(hideLoader);
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
    goldCarat: string().required('Gold K is required'),
    goldColor: string().required('Gold Color is required'),
    goldWeight: string().required('Gold Wt is required'),
    diamondWeight: string().required('Dia Wt is required'),
    colorStoneWeight: string().required('CS Wt is required'),
    specialRemarks: string().nullable(),
    specValue: string().required()
})

const initialValues: IOrder = {
    orderType: null,
    customer: '',
    orderDate: null,
    dueDate: null,
    designNo: null,
    productData: {
        product: null,
        specification: '',
        unit: ''
    },
    goldCarat: null,
    goldColor: null,
    goldWeight: '',
    diamondWeight: '',
    colorStoneWeight: '',
    specialRemarks: '',
    specValue: '',
    designId: '',
    orderId: '',
};

// Form validation
const { handleSubmit, isSubmitting, defineField, errors, setValues, values, resetForm } = useForm<IOrder>({
    validationSchema: schema,
    validateOnMount: false,
    initialValues: { ...initialValues }
});

const [orderType] = defineField('orderType')
const [customer] = defineField('customer')
const [specValue] = defineField('specValue')
const [orderDate] = defineField('orderDate')
const [dueDate] = defineField('dueDate')
const [designNo] = defineField('designNo')
const [productData] = defineField('productData')
const [goldCarat] = defineField('goldCarat')
const [goldColor] = defineField('goldColor')
const [goldWeight] = defineField('goldWeight')
const [diamondWeight] = defineField('diamondWeight')
const [colorStoneWeight] = defineField('colorStoneWeight')
const [specialRemarks] = defineField('specialRemarks')
const [designId] = defineField('designId')

const orderDateMenu = ref(false);
const dueDateMenu = ref(false);
const imagePreviews = ref<string[]>([]);
const designImagesLoading = ref(false);
const selected = ref<IOrder[]>([]);
const designImageMap = new Map<string, string[]>();

function onDesginNoSelect() {
    const selectedDesign = allDesigns.value.find(d => d.designNo == values.designNo);
    resetForm({
        values: {
            ...values,
            ...selectedDesign,
        }
    }, {
        force: true
    });
    setImagePreviews();
}

async function setImagePreviews() {
    designImagesLoading.value = true;
    let imageUrls = designImageMap.get(designId.value);

    if (!imageUrls?.length) {
        const resp = await getImages(designId.value);
        imageUrls = resp ? Object.entries(resp).map(([_, preview]) => preview) : [];
        designImageMap.set(designId.value, [...imageUrls]);
    }

    imagePreviews.value = imageUrls;
    designImagesLoading.value = false;
}

const submitForm = handleSubmit(values =>
    showConfirm({
        onPrimaryAction: async () => {
            showLoader();
            var response = values.orderId ? await apiUpdate(DataSourceObjects.order, values) : await apiCreate(DataSourceObjects.order, values);
            if (!['created', 'updated'].includes(response.status)) {
                showSnackbar(DefaultErrorMsg, 'danger');
                hideLoader();
                return;
            }
            resetOrderForm();
            loadAllOrders();
            hideLoader();
            showSnackbar("Order saved successfully");
        },
    })
)

function resetOrderForm() {
    resetForm({ values: { ...initialValues } });
    imagePreviews.value = [];
}

function edit(item: IOrder) {
    setValues(item);
    setImagePreviews();
}


function deleteItem(item: IOrder) {
    showConfirm({
        type: 'delete',
        title: `Delete ${item.orderId}`,
        message: 'Are you sure you want to delete this order?',
        onPrimaryAction: async () => {
            showSnackbar('Delete functionality yet to be implemented. Please contact Vishnu Vardhan (vishnu@elixapp.in)', 'danger');
        }
    })
}


function bulkDelete() {
  showConfirm({
    type: 'delete',
    title: `Delete ${selected.value.length} orders`,
    message: `Are you sure you want to delete these ${selected.value.length} orders ? This action cannot be reversed`,
    onPrimaryAction: async () => {
      showSnackbar('Delete functionality yet to be implemented. Please contact Vishnu Vardhan (vishnu@elixapp.in)', 'danger');
    }
  })
}


</script>
