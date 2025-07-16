<template>
    <!-- TOP PART: FORM -->
    <v-card class="pa-4 mb-4">
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
                                :error-messages="dueDate.errorMessage.value" label="Due Date" readonly density="compact"
                                variant="outlined" />
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
                    <v-select v-model="product.value.value"  :error-messages="''"
                        :items="productOptions" label="product" density="compact" readonly variant="outlined" />
                </v-col>
                <v-col cols="3">
                    <v-row dense>
                        <!-- Specification -->
                        <v-col cols="auto">
                            <div class="d-flex flex-column">
                                <div class="text-caption text-medium-emphasis mb-1">Specification</div>
                                <div class="text-body-1">Size</div>
                            </div>
                        </v-col>

                        <!-- Required -->
                        <v-col cols="7">
                            <v-select v-if="true" :items="[]" label="Required" density="compact" variant="outlined"
                                :error-messages="''" />
                            <v-text-field v-else label="Required" type="number" density="compact" variant="outlined"
                                :error-messages="''" />
                        </v-col>

                        <!-- Unit -->
                        <v-col cols="auto">
                            <div class="d-flex flex-column">
                                <div class="text-caption text-medium-emphasis mb-1">Unit</div>
                                <div class="text-body-1">Inch</div>
                            </div>
                        </v-col>
                    </v-row>
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
                    <v-text-field v-model="diamondWeight.value.value" :error-messages="diamondWeight.errorMessage.value"
                        label="Diamond Weight in Cts" density="compact" variant="outlined" type="number" />
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="colorStoneWeight.value.value"
                        :error-messages="colorStoneWeight.errorMessage.value" label="Color Stone Weight in Cts"
                        density="compact" variant="outlined" type="number" />
                </v-col>
            </v-row>

            <!-- Fourth Row -->
            <v-row dense>
                <v-col cols="10">
                    <label class="d-flex align-center mb-4" style="cursor: pointer">
                        <v-icon class="mr-2">mdi-paperclip</v-icon>
                        <input type="file" accept="image/*" multiple hidden @change="onFileChange"
                            :disabled="imageFiles.length >= 3" />
                        <span>Attach Images (max 3)</span>
                    </label>
                    <div class="d-flex">
                        <v-responsive class="mr-3" v-for="(preview, index) in imagePreviews" :key="index"
                            max-width="300" max-height="300">
                            <v-img :src="preview" cover />
                            <v-btn icon variant="flat" class="ma-2" size="small"
                                style="position: absolute; top: 0; right: 0; z-index: 1; background-color: rgba(0,0,0,0.6)"
                                @click="removeImage(index)">
                                <v-icon color="white">mdi-close</v-icon>
                            </v-btn>
                        </v-responsive>
                    </div>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column justify-end">
                    <v-btn density="compact" variant="outlined" size="x-large" type="submit">
                        Submit
                    </v-btn>
                </v-col>
            </v-row>
        </form>
    </v-card>

    <!-- BOTTOM PART: DATATABLE -->
    <v-card>
        <v-data-table :headers="tableHeaders" :items="tableItems" :items-per-page="5"
            :items-per-page-options="[5, 10, 25, 50]" class="elevation-1" />
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { goldColors, productOptions, purityOptions } from '@/models/product'

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

const orderDateMenu = ref(false)
const dueDateMenu = ref(false)

// Product label (static)

// Images

const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([])


function onFileChange(event: Event) {
    const files = Array.from(
        (event.target as HTMLInputElement)?.files ?? []
    );

    // Combine existing files with new ones, max 3
    const combined = [...imageFiles.value, ...files].slice(0, 3);

    imageFiles.value = combined;
    imagePreviews.value = [];

    // Generate previews
    combined.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            imagePreviews.value.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    });

    // Reset input value so selecting the same file again triggers change
    (event.target as HTMLInputElement).value = "";
}
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

function removeImage(index: number) {
    imageFiles.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
}

</script>
