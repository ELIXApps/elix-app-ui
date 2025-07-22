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
        <v-select v-model="productField.value.value" :items="productOptions" label="Product" density="compact" variant="outlined"
          item-title="product" return-object :error-messages="productField.errorMessage.value" />
      </v-col>

      <template v-if="productField.value.value">
        <!-- Specification Name -->
        <v-col cols="auto" class="d-flex flex-column">
          <div class="text-caption text-medium-emphasis">Specification</div>
          <div class="text-body-1">{{ productField.value.value.specification }}</div>
        </v-col>
        <!-- Specification Value -->
        <v-col cols="2">
          <v-select v-if="productField.value.value.hasMultipleSpecValues" v-model="specValueField.value.value"
            :items="productField.value.value.specificationOptions" label="Spec Value" density="compact" variant="outlined"
            :error-messages="specValueField.errorMessage.value" />
          <v-text-field v-else v-model="specValueField.value.value" label="Spec Value" type="number" density="compact"
            variant="outlined" :error-messages="specValueField.errorMessage.value" />
        </v-col>

        <!-- Unit -->
        <v-col cols="auto" class="d-flex flex-column">
          <div class="text-caption text-medium-emphasis">Unit</div>
          <div class="text-body-1">{{ productField.value.value.unit }}</div>
        </v-col>

      </template>
      <v-col v-else cols="auto">
        <div class="text-medium-emphasis mt-3">Select product to show specifications.</div>
      </v-col>
    </v-row>

    <!-- Other fields -->
    <v-row dense>
      <v-col cols="4">
        <v-select v-model="goldCarat.value.value" :items="purityOptions" :error-messages="goldCarat.errorMessage.value"
          label="Gold Carat" density="compact" variant="outlined" item-title="gold carat" />
      </v-col>
      <v-col cols="4">
        <v-select v-model="goldColor.value.value" :error-messages="goldColor.errorMessage.value" :items="goldColors"
          label="Gold Color" density="compact" variant="outlined" item-title="gold color" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="4">
        <v-text-field v-model="goldWeight.value.value" :error-messages="goldWeight.errorMessage.value"
          label="Gold Weight in Gms" density="compact" variant="outlined" type="text" @blur="formatDecimal(goldWeight)"
          @input="limitDecimals($event, goldWeight)" />
      </v-col>

      <v-col cols="4">
        <v-text-field v-model="diamondWeight.value.value" :error-messages="diamondWeight.errorMessage.value"
          label="Diamond Weight in Cts" density="compact" variant="outlined" type="text"
          @blur="formatDecimal(diamondWeight)" @input="limitDecimals($event, diamondWeight)" />
      </v-col>

      <v-col cols="4">
        <v-text-field v-model="colorStoneWeight.value.value" :error-messages="colorStoneWeight.errorMessage.value"
          label="Color Stone Weight in Cts" density="compact" variant="outlined" type="text"
          @blur="formatDecimal(colorStoneWeight)" @input="limitDecimals($event, colorStoneWeight)" />
      </v-col>

    </v-row>

    <!-- Image Upload -->
    <v-row dense>
      <v-col cols="12">
        <label class="d-flex align-center mb-4" style="cursor: pointer">
          <v-icon class="mr-2">mdi-paperclip</v-icon>
          <input type="file" accept="image/*" multiple hidden @change="onFileChange"
            :disabled="imageFiles.length >= 3" />
          <span>Attach Images (max 3)</span>
        </label>

      </v-col>
      <v-col v-for="(preview, index) in imagePreviews" :key="index" cols="4">
        <v-responsive max-width="300" max-height="300">
          <v-img :src="preview" cover />
          <v-btn icon variant="flat" class="ma-2" size="small"
            style="position: absolute; top: 0; right: 0; z-index: 1; background-color: rgba(0,0,0,0.6)"
            @click="removeImage(index)">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-responsive>
      </v-col>
    </v-row>

    <v-row dense justify="end" class="mt-3">
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
import { goldColors, IProductOption, productOptions, purityOptions } from '@/models/product';


const { handleSubmit } = useForm({
  validationSchema: {
    designId: v => (!!v && v.length >= 1) || 'Design Id is required',
    productField: v => (!!v) || 'Product is required',
    specValueField: v => (!!v && v.toString().trim() !== '') || 'Required',
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


const designId = useField('designId');
const goldCarat = useField<string>('goldCarat');
const goldColor = useField<string>('goldColor');
const goldWeight = useField('goldWeight');
const diamondWeight = useField('diamondWeight');
const colorStoneWeight = useField('colorStoneWeight');
const productField = useField<null | IProductOption>('productField');
const specValueField = useField<any>('specValueField');

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


const submit = handleSubmit(values => {
  console.log('Form submitted:', values, {
    selectedProduct: productField.value.value,
    specificationValue: specValueField.value.value,
  }, imageFiles.value)
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
