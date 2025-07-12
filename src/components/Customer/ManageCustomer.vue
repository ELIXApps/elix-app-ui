<template>
    <form @submit.prevent="submit">

        <!-- Name section -->
        <v-row dense>
            <v-col cols="4" class="pb-0">
                <v-text-field variant="outlined" density="compact" v-model="firstName.value.value" label="First Name"
                    :error-messages="firstName.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="4" class="pb-0">
                <v-text-field variant="outlined" density="compact" v-model="lastName.value.value" label="Last Name"
                    :error-messages="lastName.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="4" class="pb-0">
                <v-text-field variant="outlined" density="compact" v-model="companyName.value.value"
                    label="Company Name" :error-messages="companyName.errorMessage.value"></v-text-field>
            </v-col>
        </v-row>

        <!-- phone & email -->
        <v-row dense>
            <v-col cols="4" class="pb-0">
                <v-text-field type="number" variant="outlined" density="compact" v-model="workPhone.value.value"
                    label="Work Phone" :error-messages="workPhone.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="4" class="pb-0">
                <v-text-field type="number" variant="outlined" density="compact" v-model="mobileNo.value.value"
                    label="Mobile" :error-messages="mobileNo.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="4" class="pb-0">
                <v-text-field variant="outlined" density="compact" v-model="email.value.value" label="Email Address"
                    prepend-inner-icon="mdi-email" :error-messages="email.errorMessage.value"></v-text-field>
            </v-col>
        </v-row>

        <!-- PAN, GSTIN, Customer Type -->
        <v-row dense>
            <v-col cols="4" class="pb-0">
                <v-text-field variant="outlined" density="compact" v-model="pan.value.value" label="PAN"
                    :error-messages="pan.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="4" class="pb-0">
                <v-text-field variant="outlined" density="compact" v-model="gstin.value.value" label="GSTIN"
                    :error-messages="gstin.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="4" class="pb-0">
                <v-select outlined variant="outlined" density="compact" v-model="customerType.value.value"
                    :items="customerTypes" label="Country/Region"
                    :error-messages="customerType.errorMessage.value"></v-select>
            </v-col>
        </v-row>

        <!-- Address Section-->
        <v-row dense>
            <v-col cols="6">
                <h4 class="pb-5">Billing Address</h4>
                <v-select variant="outlined" density="compact" v-model="billingCountry.value.value" :items="countries"
                    label="Country/Region" :error-messages="billingCountry.errorMessage.value"></v-select>
                <v-text-field variant="outlined" density="compact" v-model="billingStreet1.value.value"
                    label="Street 1"></v-text-field>
                <v-text-field variant="outlined" density="compact" v-model="billingStreet2.value.value"
                    label="Street 2"></v-text-field>
                <v-text-field variant="outlined" density="compact" v-model="billingCity.value.value"
                    label="City"></v-text-field>
                <v-select variant="outlined" density="compact" v-model="billingState.value.value" :items="states"
                    label="State" :error-messages="billingState.errorMessage.value"></v-select>
                <v-text-field variant="outlined" density="compact" v-model="billingPin.value.value" label="Pin Code"
                    :error-messages="billingPin.errorMessage.value"></v-text-field>
            </v-col>

            <!-- Shipping Address -->
            <v-col cols="6">
                <h4 class="pb-4">
                    Shipping Address
                    <v-btn size="small" variant="text" @click="copyBilling">
                        Copy billing address
                    </v-btn>
                </h4>
                <v-select variant="outlined" density="compact" v-model="shippingCountry.value.value" :items="countries"
                    label="Country/Region"></v-select>
                <v-text-field variant="outlined" density="compact" v-model="shippingStreet1.value.value"
                    label="Street 1"></v-text-field>
                <v-text-field variant="outlined" density="compact" v-model="shippingStreet2.value.value"
                    label="Street 2"></v-text-field>
                <v-text-field variant="outlined" density="compact" v-model="shippingCity.value.value"
                    label="City"></v-text-field>
                <v-select variant="outlined" density="compact" v-model="shippingState.value.value" :items="states"
                    label="State"></v-select>
                <v-text-field variant="outlined" density="compact" v-model="shippingPin.value.value"
                    label="Pin Code"></v-text-field>
            </v-col>
        </v-row>

        <v-row dense class="mt-0" justify="end">
            <v-col cols="auto">
                <v-btn density="compact" variant="outlined" size="x-large" type="submit">
                    Submit
                </v-btn>
            </v-col>
        </v-row>

    </form>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { DefaultErrorMsg } from '@/services/constants';
import { apiCreate, apiUpdate } from '@/services/apiService';
import { DataSourceObjects } from '@/models/api';
import { useSnackbar } from '@/composables/useSnackbar';
import { useLoader } from '@/composables/useLoader';
import { watch } from 'vue';
import { CustomerType, ICustomer } from '@/models/customer';

const { showSnackbar } = useSnackbar();
const { showLoader, hideLoader } = useLoader();

const customerTypes = Object.keys(CustomerType);
const countries = ['India', 'United States', 'United Kingdom'];
const states = ['Karnataka', 'Maharashtra', 'Tamil Nadu'];

const emit = defineEmits(['afterSubmit']);
const { customer } = defineProps<{ customer?: ICustomer }>();

const { handleSubmit, resetForm, errors } = useForm({
    validationSchema: {
        customerType: v => !!v || 'Select a customer type',
        companyName: v => (v && v.length >= 2) || 'Company name at least 2 characters',
        firstName: v => (v && v.length >= 2) || 'First name at least 2 characters',
        lastName: v => (v && v.length >= 2) || 'Last name at least 2 characters',
        'contactInfo.email': v =>
            (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)) ||
            'Valid email required',
        'contactInfo.workPhone': v => (!!v && /^[0-9]{7,}$/.test(v)) || 'Enter at least 7 digits',
        'contactInfo.mobileNo': v => (!!v && /^[0-9]{7,}$/.test(v)) || 'Enter at least 7 digits',
        pan: v => (!!v && /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v)) || 'Enter a valid PAN',
        gstin: v => (v && v.length >= 5) || 'GSTIN required',
        'billingAddress.country': v => !!v || 'Billing country required',
        'billingAddress.street1': v => !!v || 'Billing address stree1 required',
        'billingAddress.state': v => !!v || 'Billing state required',
        'billingAddress.pinCode': v => (!!v && /^[0-9]{6}$/.test(v)) || '6-digit pin',
    },
});

watch(errors, () =>
    console.log(errors.value))

// Basic fields
const customerType = useField('customerType', undefined, { initialValue: customer?.customerType ?? CustomerType.Business });
const companyName = useField('companyName', undefined, { initialValue: customer?.companyName ?? '' });
const firstName = useField('firstName', undefined, { initialValue: customer?.firstName ?? '' });
const lastName = useField('lastName', undefined, { initialValue: customer?.lastName ?? '' });
const pan = useField('pan', undefined, { initialValue: customer?.pan ?? '' });
const gstin = useField('gstin', undefined, { initialValue: customer?.gstin ?? '' });

// Contact Info
const email = useField('contactInfo.email', undefined, { initialValue: customer?.contactInfo?.email ?? '' });
const workPhone = useField('contactInfo.workPhone', undefined, { initialValue: customer?.contactInfo?.workPhone ?? '' });
const mobileNo = useField('contactInfo.mobileNo', undefined, { initialValue: customer?.contactInfo?.mobileNo ?? '' });

// Billing Address
const billingCountry = useField('billingAddress.country', undefined, { initialValue: customer?.billingAddress?.country ?? undefined });
const billingState = useField('billingAddress.state', undefined, { initialValue: customer?.billingAddress?.state ?? undefined });
const billingPin = useField('billingAddress.pinCode', undefined, { initialValue: customer?.billingAddress?.pinCode ?? '' });
const billingStreet1 = useField('billingAddress.street1', undefined, { initialValue: customer?.billingAddress?.street1 ?? '' });
const billingStreet2 = useField('billingAddress.street2', undefined, { initialValue: customer?.billingAddress?.street2 ?? '' });
const billingCity = useField('billingAddress.city', undefined, { initialValue: customer?.billingAddress?.city ?? '' });

// Shipping Address
const shippingCountry = useField('shippingAddress.country', undefined, { initialValue: customer?.shippingAddress?.country ?? undefined });
const shippingState = useField('shippingAddress.state', undefined, { initialValue: customer?.shippingAddress?.state ?? undefined });
const shippingPin = useField('shippingAddress.pinCode', undefined, { initialValue: customer?.shippingAddress?.pinCode ?? '' });
const shippingStreet1 = useField('shippingAddress.street1', undefined, { initialValue: customer?.shippingAddress?.street1 ?? '' });
const shippingStreet2 = useField('shippingAddress.street2', undefined, { initialValue: customer?.shippingAddress?.street2 ?? '' });
const shippingCity = useField('shippingAddress.city', undefined, { initialValue: customer?.shippingAddress?.city ?? '' });

function copyBilling() {
    shippingCountry.value.value = billingCountry.value.value;
    shippingState.value.value = billingState.value.value;
    shippingPin.value.value = billingPin.value.value;
    shippingStreet1.value.value = billingStreet1.value.value;
    shippingStreet2.value.value = billingStreet2.value.value;
    shippingCity.value.value = billingCity.value.value;
}

const submit = handleSubmit(async (values) => {
    try {
        showLoader();
        const response = customer.customerId
            ? await apiUpdate(DataSourceObjects.customer, { customerId: customer.customerId, ...values })
            : await apiCreate(DataSourceObjects.customer, values);
        if (response.message)
            showSnackbar("Unexpected error occurred while saving customer", 'danger');
        else {
            showSnackbar("Customer saved successfully", 'success');
            resetForm();
        }
    } catch (e) {
        showSnackbar(DefaultErrorMsg, 'danger');
    } finally {
        hideLoader();
        emit('afterSubmit');
    }
});
</script>
