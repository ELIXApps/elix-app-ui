<template>
    <!-- Customer Type -->
    <v-row>
        <v-col cols="12">
            <v-radio-group v-model="form.customerType" inline>
                <template v-slot:label><strong>Customer Type</strong>
                </template>
                <v-radio label="Business" value="Business"></v-radio>
                <v-radio label="Individual" value="Individual"></v-radio>
            </v-radio-group>
        </v-col>
    </v-row>

    <v-divider />

    <!-- Primary Contact -->
    <v-row class="mt-3">
        <div class="text-subtitle-1 mb-2 ps-7">Primary Contact</div>
    </v-row>
    <v-row class="mt-3">
        <v-col cols="2">
            <v-select v-model="form.salutation" :items="salutations" label="Salutation"></v-select>
        </v-col>
        <v-col cols="5">
            <v-text-field v-model="form.firstName" label="First Name"></v-text-field>
        </v-col>
        <v-col cols="5">
            <v-text-field v-model="form.lastName" label="Last Name"></v-text-field>
        </v-col>
    </v-row>

    <!-- Company Name -->
    <v-row>
        <v-col cols="12">
            <v-text-field v-model="form.companyName" label="Company Name"></v-text-field>
        </v-col>
    </v-row>

    <!-- Display Name -->
    <!-- <v-row>
            <v-col cols="12">
                <v-combobox v-model="form.displayName" label="Display Name *"></v-combobox>
            </v-col>
        </v-row> -->

    <!-- Currency -->
    <!-- <v-row>
            <v-col cols="12">
                <v-select v-model="form.currency" :items="currencies" label="Currency"></v-select>
            </v-col>
        </v-row> -->

    <!-- Email -->
    <v-row>
        <v-col cols="12">
            <v-text-field v-model="form.contactInfo.email" label="Email Address"
                prepend-inner-icon="mdi-email"></v-text-field>
        </v-col>
    </v-row>

    <!-- Phone -->
    <v-row>
        <v-col cols="6">
            <v-text-field v-model="form.contactInfo.workPhone" label="Work Phone"></v-text-field>
        </v-col>
        <v-col cols="6">
            <v-text-field v-model="form.contactInfo.mobileNo" label="Mobile"></v-text-field>
        </v-col>
    </v-row>

    <!-- PAN and GSTIN/UIN -->
    <v-row>
        <v-col cols="6">
            <v-text-field v-model="form.pan" label="PAN"></v-text-field>
        </v-col>
        <v-col cols="6">
            <v-text-field v-model="form.gstin" label="GSTIN/UIN *"></v-text-field>
        </v-col>
    </v-row>

    <!-- Payment Terms -->
    <!-- <v-row>
            <v-col cols="12">
                <v-select v-model="form.paymentTerms" :items="paymentTerms" label="Payment Terms"></v-select>
            </v-col>
        </v-row> -->

    <v-divider />

    <!-- Billing Address -->
    <v-row class="mt-3">
        <v-col cols="12" md="6">
            <h4 class="pb-5">Billing Address</h4>
            <v-select v-model="form.billingAddress.country" :items="countries" label="Country/Region"></v-select>
            <v-text-field v-model="form.billingAddress.street1" label="Street 1"></v-text-field>
            <v-text-field v-model="form.billingAddress.street2" label="Street 2"></v-text-field>
            <v-text-field v-model="form.billingAddress.city" label="City"></v-text-field>
            <v-select v-model="form.billingAddress.state" :items="states" label="State"></v-select>
            <v-text-field v-model="form.billingAddress.pinCode" label="Pin Code"></v-text-field>
        </v-col>

        <!-- Shipping Address -->
        <v-col cols="12" md="6">
            <h4 class="pb-4">
                Shipping Address
                <v-btn size="small" variant="text" @click="copyBilling">
                    Copy billing address
                </v-btn>
            </h4>
            <v-select v-model="form.shippingAddress.country" :items="countries" label="Country/Region"></v-select>
            <v-text-field v-model="form.shippingAddress.street1" label="Street 1"></v-text-field>
            <v-text-field v-model="form.shippingAddress.street2" label="Street 2"></v-text-field>
            <v-text-field v-model="form.shippingAddress.city" label="City"></v-text-field>
            <v-select v-model="form.shippingAddress.state" :items="states" label="State"></v-select>
            <v-text-field v-model="form.shippingAddress.pinCode" label="Pin Code"></v-text-field>
        </v-col>
    </v-row>

    <v-row class="mt-3 pr-3 pb-3" justify-lg="end">
        <v-btn size="large" @click="handleSubmit()">Submit</v-btn>
    </v-row>
</template>

<script setup lang="ts">
import { inject, reactive } from 'vue';
import { CustomerType, type ICustomer } from '@/models/customer';
import { DefaultErrorMsg, HideLoaderKey, ShowLoaderKey } from '@/services/constants';
import { apiCreate, apiUpdate } from '@/services/apiService';
import { DataSourceObjects } from '@/models/api';
import { useSnackbar } from '@/composables/useSnackbar';
const { showSnackbar } = useSnackbar();

var emit = defineEmits(['afterSubmit'])

var { customer } = defineProps<{
    customer?: ICustomer
}>();

const form = reactive<ICustomer>({
    customerType: CustomerType.Business,
    salutation: '',
    firstName: '',
    lastName: '',
    companyName: '',
    contactInfo: {
        email: '',
        workPhone: '',
        mobileNo: '',
    },
    pan: '',
    gstin: '',
    billingAddress: {
        country: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        pinCode: ''
    },
    shippingAddress: {
        country: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        pinCode: ''
    }
});

if (customer)
    Object.assign(form, customer);


const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.']
const countries = ['India', 'United States', 'United Kingdom']
const states = ['Karnataka', 'Maharashtra', 'Tamil Nadu']

function copyBilling() {
    form.shippingAddress = { ...form.billingAddress }
}
const showLoader = inject<() => void>(ShowLoaderKey);
const hideLoader = inject<() => void>(HideLoaderKey);


async function handleSubmit() {
    try {
        showLoader();
        var response = form.customerId ? await apiUpdate(DataSourceObjects.customer, form) : await apiCreate(DataSourceObjects.customer, form);
        console.log(response);
        if (response.message)
            showSnackbar("Unexpected error occured while saving customer", 'danger');
        else
            showSnackbar("Customer saved successfully", 'success');
    } catch (e) {
        showSnackbar(DefaultErrorMsg, 'danger');
    } finally {
        hideLoader();
        emit('afterSubmit')
    }
}


</script>
