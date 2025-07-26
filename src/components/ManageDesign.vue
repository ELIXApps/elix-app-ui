<template>

  <v-card flat class="mb-3">
    <v-card-item>
      <form @submit.prevent="submit">
        <v-row dense class="pt-2">
          <v-col cols="3">
            <v-text-field v-model="designNo" :error-messages="errors.designNo" label="Design No." density="compact"
              variant="outlined" />
          </v-col>
          <v-col cols="3">
            <v-select v-model="productData" :items="productOptions" label="Product" density="compact" variant="outlined"
              item-title="product" return-object
              :error-messages="errors['productData.product'] || errors.productData" />
          </v-col>
          <v-col cols="3" class="d-flex justify-space-between">
            <template v-if="productData">
              <!-- Specification Name -->
              <div class="d-flex flex-column">
                <div class="text-caption text-medium-emphasis">Specification</div>
                <div class="text-body-1">{{ productData.specification }}</div>
              </div>
              <!-- Specification Value -->
              <div style="width: 60%;">
                <v-select v-if="productData.hasMultipleSpecValues" v-model="specValue"
                  :items="productData.specificationOptions" label="Spec Value" density="compact" variant="outlined"
                  :error-messages="errors.specValue" />
                <v-text-field v-else v-model="specValue" label="Spec Value" type="number" density="compact"
                  variant="outlined" :error-messages="errors.specValue" />
              </div>

              <!-- Unit -->
              <div class="d-flex flex-column">
                <div class="text-caption text-medium-emphasis">Unit</div>
                <div class="text-body-1">{{ productData.unit }}</div>
              </div>

            </template>
            <div v-else class="text-medium-emphasis mt-3">Select product to show specifications</div>
          </v-col>

          <v-col cols="3">
            <v-select v-model="goldCarat" :items="purityOptions" :error-messages="errors.goldCarat" label="Gold Carat"
              density="compact" variant="outlined" item-title="gold carat" />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="3">
            <v-select v-model="goldColor" :error-messages="errors.goldColor" :items="goldColors" label="Gold Color"
              density="compact" variant="outlined" item-title="gold color" />
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="goldWeight" :error-messages="errors.goldWeight" label="Gold Weight in Gms"
              density="compact" variant="outlined" type="text" @blur="formatDecimal(goldWeight)"
              @input="limitDecimals($event, goldWeight)" />
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="diamondWeight" :error-messages="errors.diamondWeight" label="Diamond Weight in Cts"
              density="compact" variant="outlined" type="text" @blur="formatDecimal(diamondWeight)"
              @input="limitDecimals($event, diamondWeight)" />
          </v-col>

          <v-col cols="3">
            <v-text-field v-model="colorStoneWeight" :error-messages="errors.colorStoneWeight"
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
          <v-col cols="auto" class="d-flex justify-end align-end">
            <v-btn class="me-2" density="compact" variant="tonal" color="success" size="x-large" type="submit">
              Submit
            </v-btn>
            <v-btn density="compact" variant="tonal" color="danger" :onclick="resetDesignForm" size="x-large">
              {{ values.designId ? 'Cancel' : 'Clear' }}
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
import { computed, onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { goldColors, productOptions, purityOptions } from '@/models/product';
import { useLoader } from '@/composables/useLoader';
import { apiCreate, apiGetAll, apiUpdate } from '@/services/apiService';
import { DataSourceObjects } from '@/models/api';
import { fetchApi } from '@/services/fetchHelper';
import { DesignImageUploadUrl, DesignImageUrl } from '@/services/apiUrls';
import { useSnackbar } from '@/composables/useSnackbar';
import { DefaultErrorMsg } from '@/services/constants';
import { IDesign } from '@/models/design';
import { object, string } from 'yup';

const { showLoader, hideLoader } = useLoader();
const { showSnackbar } = useSnackbar();

// Search input
const searchQuery = ref('');


onMounted(() => {
  loadAllDesigns();
})

// Table headers
const headers = [
  { title: 'Design No.', key: 'designNo', sortable: true },
  { title: 'Product', key: 'productData.product', sortable: true },
  { title: 'Specification', key: 'productData.specification', sortable: true },
  { title: 'Spec Value', key: 'specValue', sortable: true },
  { title: 'Unit', key: 'productData.unit', sortable: true },
  { title: 'Gold Carat', key: 'goldCarat', sortable: true },
  { title: 'Gold Color', key: 'goldColor', sortable: true },
  { title: 'Gold Weight', key: 'goldWeight', sortable: true },
  { title: 'Diamond Weight', key: 'diamondWeight', sortable: true },
  { title: 'Color Stone Weight', key: 'colorStoneWeight', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const allDesigns = ref<IDesign[]>([]);

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return allDesigns.value

  return allDesigns.value.filter(
    i =>
      i.designNo.toLowerCase().includes(query) ||
      i.goldColor.toLowerCase().includes(query) ||
      i.productData?.product.toLowerCase().includes(query) ||
      i.productData?.specification.toLowerCase().includes(query) ||
      i.productData?.unit.toLowerCase().includes(query)
  )
})

const validationSchema = object({
  designNo: string()
    .required('Design No. is required')
    .min(1, 'Design No. is required'),
  productData: object({
    product: string().required("Product is required")
  }).required(),
  specValue: string()
    .trim()
    .required('Required'),
  goldCarat: string()
    .required('Gold Carat is required')
    .min(1, 'Gold Carat is required'),
  goldColor: string()
    .required('Gold Color is required')
    .min(1, 'Gold Color is required'),
  goldWeight: string()
    .required('Gold Weight is required')
    .test(
      'is-valid-number',
      'Gold Weight is required',
      value => value != null && value.toString().trim() !== '' && !isNaN(parseFloat(value))
    ),
  diamondWeight: string()
    .required('Diamond Weight is required')
    .test(
      'is-valid-number',
      'Diamond Weight is required',
      value => value != null && value.toString().trim() !== '' && !isNaN(parseFloat(value))
    ),
  colorStoneWeight: string()
    .required('Color Stone Weight is required')
    .test(
      'is-valid-number',
      'Color Stone Weight is required',
      value => value != null && value.toString().trim() !== '' && !isNaN(parseFloat(value))
    ),
});


const initialValues: IDesign = {
  designId: '',
  designNo: null,
  productData: null,
  goldCarat: null,
  colorStoneWeight: null,
  diamondWeight: null,
  goldColor: null,
  goldWeight: null,
  specValue: null
}

const { handleSubmit, resetForm, errors, setValues, values, defineField } = useForm<IDesign>({
  validationSchema,
  validateOnMount: false,
  initialValues: { ...initialValues }
});



const [designNo] = defineField('designNo');
const [goldCarat] = defineField('goldCarat');
const [goldColor] = defineField('goldColor');
const [goldWeight] = defineField('goldWeight');
const [diamondWeight] = defineField('diamondWeight');
const [colorStoneWeight] = defineField('colorStoneWeight');
const [productData] = defineField('productData');
const [specValue] = defineField('specValue');
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const designImageMap = new Map<string, string[]>();


function loadAllDesigns() {
  showLoader()
  apiGetAll<IDesign[]>(DataSourceObjects.design).then(resp => {
    allDesigns.value = resp;
  })
    .finally(hideLoader)
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
  resetForm({ values: { ...initialValues } });
  imageFiles.value = [];
  imagePreviews.value = [];
  designImageMap.delete(designNo);
}

function formatDecimal(field) {
  const raw = field?.toString().trim();
  if (!raw) {
    field = '';
    return;
  }

  const val = parseFloat(raw);
  if (isNaN(val)) {
    field = '';
  } else {
    field = val.toFixed(3);
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
  field = value;
}

async function edit(item: IDesign) {
  setValues(item);
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
