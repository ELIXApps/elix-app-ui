<template>
  <form @submit.prevent="submit">
    <v-row dense>
      <v-col cols="3">
        <v-text-field v-model="designId.value.value" :error-messages="designId.errorMessage.value" label="Design Id"
          density="compact" variant="outlined" />
      </v-col>
      <v-col cols="3">
        <v-select v-model="productData.value.value" :items="productOptions" label="Product" density="compact"
          variant="outlined" item-title="product" return-object :error-messages="productData.errorMessage.value" />
      </v-col>
      <v-col cols="3" class="d-flex justify-space-between">
        <template v-if="productData.value.value">
          <!-- Specification Name -->
          <div class="d-flex flex-column">
            <div class="text-caption text-medium-emphasis">Specification</div>
            <div class="text-body-1">{{ productData.value.value.specification }}</div>
          </div>
          <!-- Specification Value -->
          <div style="width: 60%;">
            <v-select v-if="productData.value.value.hasMultipleSpecValues" v-model="specValue.value.value"
              :items="productData.value.value.specificationOptions" label="Spec Value" density="compact"
              variant="outlined" :error-messages="specValue.errorMessage.value" />
            <v-text-field v-else v-model="specValue.value.value" label="Spec Value" type="number" density="compact"
              variant="outlined" :error-messages="specValue.errorMessage.value" />
          </div>

          <!-- Unit -->
          <div class="d-flex flex-column">
            <div class="text-caption text-medium-emphasis">Unit</div>
            <div class="text-body-1">{{ productData.value.value.unit }}</div>
          </div>

        </template>
        <div v-else class="text-medium-emphasis mt-3">Select product to show specifications</div>
      </v-col>

      <v-col cols="3">
        <v-select v-model="goldCarat.value.value" :items="purityOptions" :error-messages="goldCarat.errorMessage.value"
          label="Gold Carat" density="compact" variant="outlined" item-title="gold carat" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="3">
        <v-select v-model="goldColor.value.value" :error-messages="goldColor.errorMessage.value" :items="goldColors"
          label="Gold Color" density="compact" variant="outlined" item-title="gold color" />
      </v-col>

      <v-col cols="3">
        <v-text-field v-model="goldWeight.value.value" :error-messages="goldWeight.errorMessage.value"
          label="Gold Weight in Gms" density="compact" variant="outlined" type="text" @blur="formatDecimal(goldWeight)"
          @input="limitDecimals($event, goldWeight)" />
      </v-col>

      <v-col cols="3">
        <v-text-field v-model="diamondWeight.value.value" :error-messages="diamondWeight.errorMessage.value"
          label="Diamond Weight in Cts" density="compact" variant="outlined" type="text"
          @blur="formatDecimal(diamondWeight)" @input="limitDecimals($event, diamondWeight)" />
      </v-col>

      <v-col cols="3">
        <v-text-field v-model="colorStoneWeight.value.value" :error-messages="colorStoneWeight.errorMessage.value"
          label="Color Stone Weight in Cts" density="compact" variant="outlined" type="text"
          @blur="formatDecimal(colorStoneWeight)" @input="limitDecimals($event, colorStoneWeight)" />
      </v-col>
    </v-row>

    <!-- Image Upload -->
    <v-row dense>
      <label class="d-flex align-center mb-4" style="cursor: pointer">
        <v-icon class="mr-2">mdi-paperclip</v-icon>
        <input type="file" accept="image/*" multiple hidden @change="onFileChange" :disabled="imageFiles.length >= 3" />
        <span>Attach Images (max 3)</span>
      </label>
    </v-row>

    <v-row dense class="d-flex justify-space-between">
      <v-col cols="8" class="d-flex">
        <v-responsive max-width="170" max-height="170" class="mr-2" v-for="(preview, index) in imagePreviews"
          :key="index">
          <v-img :src="preview" cover />
          <v-btn icon variant="flat" class="ma-2" size="x-small"
            style="position: absolute; top: 0; right: 0; z-index: 1; background-color: rgba(0,0,0,0.6)"
            @click="removeImage(index)">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-responsive>
      </v-col>
      <v-col cols="auto" class="d-flex flex-column justify-end">
        <v-btn density="compact" variant="outlined" size="x-large" type="submit">
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { goldColors, IProductOption, productOptions, purityOptions } from '@/models/product';
import { useLoader } from '@/composables/useLoader';
import { apiCreate, apiGet, apiGetAll } from '@/services/apiService';
import { DataSourceObjects } from '@/models/api';
import { fetchApi } from '@/services/fetchHelper';
import { DesignImageUploadUrl } from '@/services/apiUrls';

const { showLoader, hideLoader } = useLoader();


const { handleSubmit } = useForm({
  validationSchema: {
    designId: v => (!!v && v.length >= 1) || 'Design Id is required',
    productData: v => (!!v) || 'Product is required',
    specValue: v => (!!v && v.toString().trim() !== '') || 'Required',
    goldCarat: v => (!!v && v.length >= 1) || 'Gold Carat is required',
    goldColor: v => (!!v && v.length >= 1) || 'Gold Color is required',
    goldWeight: v =>
      (v !== null && v !== undefined && v.toString().trim() !== '' && !isNaN(parseFloat(v))) || 'Gold Weight is required',
    diamondWeight: v =>
      (v !== null && v !== undefined && v.toString().trim() !== '' && !isNaN(parseFloat(v))) || 'Diamond Weight is required',
    colorStoneWeight: v =>
      (v !== null && v !== undefined && v.toString().trim() !== '' && !isNaN(parseFloat(v))) || 'Color Stone Weight is required',
  },
});

onMounted(()=> {
  apiGetAll(DataSourceObjects.design).then(resp => console.log(resp))
})


const designId = useField('designId');
const goldCarat = useField<string>('goldCarat');
const goldColor = useField<string>('goldColor');
const goldWeight = useField('goldWeight');
const diamondWeight = useField('diamondWeight');
const colorStoneWeight = useField('colorStoneWeight');
const productData = useField<null | IProductOption>('productData');
const specValue = useField<any>('specValue');

// Multiple image handling
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

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

function removeImage(index: number) {
  imageFiles.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
}


const submit = handleSubmit(async values => {
  showLoader();
  var response = await apiCreate(DataSourceObjects.design, values)
  console.log('Form submitted:', response, imageFiles.value)

  var formData = new FormData();
  imageFiles.value.forEach(file => {
    formData.append(file.name, file);
  });
  fetchApi(DesignImageUploadUrl(values.designId), {
    method: 'POST',
    body: formData
  })
  hideLoader();
});


function formatDecimal(field) {
  const raw = field.value.value?.toString().trim();
  if (!raw) {
    field.value.value = '';
    return;
  }

  const val = parseFloat(raw);
  if (isNaN(val)) {
    field.value.value = '';
  } else {
    field.value.value = val.toFixed(3);
  }
}

function limitDecimals(event: Event, field) {
  let value = (event.target as HTMLInputElement).value;

  // Allow only one dot
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit decimal digits to 3
  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 3);
    value = parts[0] + "." + parts[1];
  }

  // Update field value without triggering formatting
  field.value.value = value;
}

</script>
