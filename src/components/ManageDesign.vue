<template>
  <form @submit.prevent="submit">
    <v-row dense>
      <v-col cols="4">
        <v-text-field v-model="designId.value.value" :error-messages="designId.errorMessage.value" label="Design Id"
          density="compact" variant="outlined" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="4">
        <v-select v-model="selectedProduct" :items="productOptions" label="Product" density="compact" variant="outlined"
          item-title="product" return-object />
      </v-col>

      <template v-if="selectedProduct">
        <!-- Specification Name -->
        <v-col cols="auto" class="d-flex flex-column">
          <div class="text-caption text-medium-emphasis">Specification</div>
          <div class="text-body-1">{{ selectedProduct.specification }}</div>
        </v-col>
        <!-- Specification Value -->
        <v-col cols="2">
          <v-select v-if="selectedProduct.hasMultipleSpecValues" v-model="specificationValue"
            :items="selectedProduct.specificationOptions" label="Spec Value" density="compact"
            variant="outlined" />
          <v-text-field v-else v-model="specificationValue" label="Spec Value" type="number" density="compact"
            variant="outlined" />
        </v-col>

        <!-- Unit -->
        <v-col cols="auto" class="d-flex flex-column">
          <div class="text-caption text-medium-emphasis">Unit</div>
          <div class="text-body-1">{{ selectedProduct.unit }}</div>
        </v-col>

      </template>
      <v-col v-else cols="auto">
        <div class="text-medium-emphasis mt-3">Select product to show specifications</div>
      </v-col>
    </v-row>


    <!-- Other fields -->
    <v-row dense>
      <v-col cols="4">
        <v-select v-model="goldCarat.value.value" :items="purity" label="Gold Carat" density="compact" variant="outlined"
          item-title="gold carat" return-object />
        <!-- <v-text-field v-model="" :error-messages="goldCarat.errorMessage.value" label="Gold Carat"
          density="compact" variant="outlined" /> -->
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="goldColor.value.value" :error-messages="goldColor.errorMessage.value" label="Gold Color"
          density="compact" variant="outlined" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="4">
        <v-text-field v-model="goldWeight.value.value" :error-messages="goldWeight.errorMessage.value"
          label="Gold Weight in gms" density="compact" variant="outlined" type="number" />
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="diamondWeight.value.value" :error-messages="diamondWeight.errorMessage.value"
          label="Diamond Weight in cts" density="compact" variant="outlined" type="number" />
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="colorStoneWeight.value.value" :error-messages="colorStoneWeight.errorMessage.value"
          label="Color Stone Weight in cts" density="compact" variant="outlined" type="number" />
      </v-col>
    </v-row>

    <!-- Image Upload -->
    <v-row dense>
      <v-col cols="12">
        <label class="d-flex align-center mb-4" style="cursor: pointer">
          <v-icon class="mr-2">mdi-paperclip</v-icon>
          <input type="file" accept="image/*" hidden @change="onFileChange" />
          <span>Attach Image</span>
        </label>
        <v-responsive v-if="imagePreview" max-width="300" max-height="300">
          <v-img :src="imagePreview" cover />
          <v-btn icon variant="flat" class="ma-2" size="small"
            style="position: absolute; top: 0; right: 0; z-index: 1; background-color: rgba(0,0,0,0.6)"
            @click="removeImage">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-responsive>
      </v-col>
    </v-row>

    <v-row dense justify="end">
      <v-col cols="auto">
        <v-btn density="compact" variant="outlined" size="x-large" type="submit">
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>



<script setup lang="ts">
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'

interface IProductOption {
  product: string,
  specification: string,
  unit: string,
  hasMultipleSpecValues?: boolean,
  specificationOptions?: string[]
}

const productOptions: IProductOption[] = [
  { product: 'BANGLE', specification: 'Size', unit: 'Inch' },
  { product: 'BRACELET', specification: 'Size', unit: 'Inch' },
  { product: 'NECKLACE', specification: 'Size', unit: 'Inch' },
  { product: 'PENDANT', specification: 'Size', unit: 'Inch' },
  { product: 'LADIES RING', specification: 'Size', unit: 'No' },
  {
    product: 'STUD',
    specification: 'Screw Type',
    unit: 'Pair',
    hasMultipleSpecValues: true,
    specificationOptions: ['Bombay', 'South']
  },
  { product: 'MOGGAPU', specification: 'VALAYAM', unit: 'LOCK' },
  { product: 'GENTS RING', specification: 'Size', unit: 'No' },
  { product: 'RING', specification: 'Size', unit: 'No' },
  {
    product: 'Nose pin',
    specification: 'Screw Type',
    unit: 'Pair',
    hasMultipleSpecValues: true,
    specificationOptions: ['Bombay', 'South']
  },
  { product: 'Backchain', specification: 'Size', unit: 'Inch' },
  { product: 'KODI', specification: 'Size', unit: 'Inch' },
];

const purity = ['18K', '22K', '24K'];

const selectedProduct = ref<null | IProductOption>(null)
const specificationValue = ref('')

const { handleSubmit } = useForm({
  validationSchema: {
    designId: v => (!!v && v.length >= 1) || 'Design Id is required',
    goldCarat: v => (!!v && v.length >= 1) || 'Gold Carat is required',
    goldColor: v => (!!v && v.length >= 1) || 'Gold Color is required',
    goldWeight: v => (!!v && v.length >= 1) || 'Gold Weight is required',
    diamondWeight: v => (!!v && v.length >= 1) || 'Diamond Weight is required',
    colorStoneWeight: v => (!!v && v.length >= 1) || 'Color Stone Weight is required',
  },
})

const designId = useField('designId')
const goldCarat = useField<string>('goldCarat')
const goldColor = useField('goldColor')
const goldWeight = useField('goldWeight')
const diamondWeight = useField('diamondWeight')
const colorStoneWeight = useField('colorStoneWeight')

const imageFile = ref<File | null>(null)
const imagePreview = ref('')

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = e => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    imageFile.value = null
    imagePreview.value = ''
  }
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = ''
}

const submit = handleSubmit(values => {
  console.log('Form submitted:', values, {
    selectedProduct: selectedProduct.value,
    specificationValue: specificationValue.value,
  })
})
</script>
