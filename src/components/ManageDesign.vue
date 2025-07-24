<template>
  <v-card flat class="mb-3">
    <v-card-item>
      <form @submit.prevent="submit">
        <v-row dense class="pt-2">
          <v-col cols="3">
            <v-text-field v-model="designNo.value.value" :error-messages="designNo.errorMessage.value"
              label="Design No." density="compact" variant="outlined" />
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
            <v-select v-model="goldCarat.value.value" :items="purityOptions"
              :error-messages="goldCarat.errorMessage.value" label="Gold Carat" density="compact" variant="outlined"
              item-title="gold carat" />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="3">
            <v-select v-model="goldColor.value.value" :error-messages="goldColor.errorMessage.value" :items="goldColors"
              label="Gold Color" density="compact" variant="outlined" item-title="gold color" />
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="goldWeight.value.value" :error-messages="goldWeight.errorMessage.value"
              label="Gold Weight in Gms" density="compact" variant="outlined" type="text"
              @blur="formatDecimal(goldWeight)" @input="limitDecimals($event, goldWeight)" />
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
            <input type="file" accept="image/*" multiple hidden @change="onFileChange"
              :disabled="imageFiles.length >= 3" />
            <span>Attach Images (max 3)</span>
          </label>
        </v-row>

        <v-row dense class="d-flex justify-space-between pb-2">
          <v-col cols="8" class="d-flex">
            <v-responsive max-width="100" max-height="100" class="mr-2" v-for="(preview, index) in imagePreviews"
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
            <v-btn density="compact" variant="tonal" color="#4CAF50" size="x-large" type="submit">
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card-item>
  </v-card>
  <v-card flat>
    <v-card-title>
      <v-text-field hide-details density="compact" width="25%" variant="outlined" v-model="searchQuery"
        label="Search by Design No., Product etc" prepend-inner-icon="mdi-magnify" clearable />
    </v-card-title>
    <v-data-table density="compact" :headers="headers" :items="filteredItems" :items-per-page="5"
      :items-per-page-options="[5, 10, 25, 50]" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-btn density="compact" variant="text" icon @click="edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>



<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { goldColors, IProductOption, productOptions, purityOptions } from '@/models/product';
import { useLoader } from '@/composables/useLoader';
import { apiCreate, apiGetAll, apiUpdate } from '@/services/apiService';
import { DataSourceObjects } from '@/models/api';
import { fetchApi } from '@/services/fetchHelper';
import { DesignImageUploadUrl, DesignImageUrl } from '@/services/apiUrls';
import { useSnackbar } from '@/composables/useSnackbar';
import { DefaultErrorMsg } from '@/services/constants';

const { showLoader, hideLoader } = useLoader();
const { showSnackbar } = useSnackbar();

// Search input
const searchQuery = ref('')

const { handleSubmit, resetForm } = useForm({
  validationSchema: {
    designNo: v => (!!v && v.length >= 1) || 'Design No. is required',
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


// Table headers
const headers = [
  { title: 'Design No.', value: 'designNo', sortable: true },
  { title: 'Product', value: 'product', sortable: true },
  { title: 'Specification', value: 'specification', sortable: true },
  { title: 'Spec Value', value: 'specValue', sortable: true },
  { title: 'Unit', value: 'unit', sortable: true },
  { title: 'Gold Carat', value: 'goldCarat', sortable: true },
  { title: 'Gold Color', value: 'goldColor', sortable: true },
  { title: 'Gold Weight', value: 'goldWeight', sortable: true },
  { title: 'Diamond Weight', value: 'diamondWeight', sortable: true },
  { title: 'Color Stone Weight', value: 'colorStoneWeight', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
]
interface IDesignTableItem { designId: string; designNo: string; product: string; specification: string; unit: string; specValue: string; goldCarat: string; goldColor: string; goldWeight: string; diamondWeight: string, colorStoneWeight: string }
const items = ref<
  IDesignTableItem[]
>([]);

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return items.value

  return items.value.filter(
    i =>
      i.designNo.toLowerCase().includes(query) ||
      i.goldColor.toLowerCase().includes(query) ||
      i.product.toLowerCase().includes(query) ||
      i.specification.toLowerCase().includes(query) ||
      i.unit.toLowerCase().includes(query)
  )
})

const designNo = useField('designNo');
const goldCarat = useField<string>('goldCarat');
const goldColor = useField<string>('goldColor');
const goldWeight = useField('goldWeight');
const diamondWeight = useField('diamondWeight');
const colorStoneWeight = useField('colorStoneWeight');
const productData = useField<null | IProductOption>('productData');
const specValue = useField<any>('specValue');
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const designImageMap = new Map<string, string[]>();

onMounted(() => {
  loadAllDesigns();
})

function loadAllDesigns() {
  showLoader()
  apiGetAll(DataSourceObjects.design).then(resp => {
    items.value = (resp.value as any[]).map(x => ({
      designId: x.designId,
      colorStoneWeight: x.colorStoneWeight,
      designNo: x.designNo,
      diamondWeight: x.diamondWeight,
      goldCarat: x.goldCarat,
      goldColor: x.goldColor,
      goldWeight: x.goldWeight,
      specValue: x.specValue,
      product: x.productData.product,
      specification: x.productData.specification,
      unit: x.productData.unit
    }))
  })
    .finally(() => hideLoader())
}

function onFileChange(event: Event) {
  const files = Array.from(
    (event.target as HTMLInputElement)?.files ?? []
  );

  combineImageAndGeneratePreviews(files);

  // Reset input value so selecting the same file again triggers change
  (event.target as HTMLInputElement).value = "";
}

function combineImageAndGeneratePreviews(files: File[]) {
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
}


function removeImage(index: number) {
  imageFiles.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
}

async function filesFromUrls(urls: string[]): Promise<File[]> {
  const files = await Promise.all(
    urls.map(async (url, index) => {
      const response = await fetch(url);
      const blob = await response.blob();

      // Try to extract filename from URL or fallback
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const originalName = pathname.substring(pathname.lastIndexOf('/') + 1).split('?')[0];
      const filename = originalName || `image_${index}.jpg`;

      return new File([blob], filename, { type: blob.type || 'image/jpeg' });
    })
  );

  return files;
}

const submit = handleSubmit(async values => {
  showLoader();
  var response = values.designId ? await apiUpdate(DataSourceObjects.design, values) : await apiCreate(DataSourceObjects.design, values);
  if (!['created', 'updated'].includes(response.status)) {
    showSnackbar(DefaultErrorMsg, 'danger');
    hideLoader();
    return;
  }

  if (imageFiles.value.length) {
    var formData = new FormData();
    imageFiles.value.forEach(file => {
      formData.append(file.name, file);
    });
    fetchApi(DesignImageUploadUrl(values.designNo), {
      method: 'POST',
      body: formData
    });
  }
  showSnackbar("Design saved successfully");
  resetDesignForm(values.designNo);
  loadAllDesigns();
  hideLoader();
});

function resetDesignForm(designNo: string) {
  resetForm({
    values: {
      designId: null,
      designNo: null,
      productData: null,
      specValue: null,
      goldCarat: null,
      goldColor: null,
      goldWeight: null,
      diamondWeight: null,
      colorStoneWeight: null
    }
  });
  imageFiles.value = [];
  imagePreviews.value = [];
  designImageMap.delete(designNo);
}

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

async function edit(item: IDesignTableItem) {
  resetForm({
    values: {
      designId: item.designId,
      designNo: item.designNo,
      productData: productOptions.find(x => x.product == item.product),
      specValue: item.specValue,
      goldCarat: item.goldCarat,
      goldColor: item.goldColor,
      goldWeight: item.goldWeight,
      diamondWeight: item.diamondWeight,
      colorStoneWeight: item.colorStoneWeight
    }
  });

  var imageUrls = designImageMap.get(item.designNo);

  if (!imageUrls?.length) {
    imageUrls = await getDesignImageUrl(item.designNo);
    designImageMap.set(item.designNo, imageUrls);
  }

  if (imageUrls?.length) {
    const imageFiles = await filesFromUrls(imageUrls);
    combineImageAndGeneratePreviews(imageFiles);
  }

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

</script>
