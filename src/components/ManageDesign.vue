<template>

  <v-card flat class="mb-3">
    <v-card-item class="pa-0">
      <form @submit.prevent="submit">
        <v-row>
          <v-col cols="8">
            <v-row class="pt-2">
              <v-col cols="4">
                <v-text-field v-model="designNo" :error-messages="errors.designNo" label="Design No." density="compact"
                  variant="outlined" />
              </v-col>
              <v-col cols="4">
                <v-select v-model="productData" :items="productOptions" label="Product" density="compact"
                  variant="outlined" item-title="product" return-object :error-messages="errors.productData" />
              </v-col>
              <v-col cols="4">
                <template v-if="productData">
                  <v-select v-if="productData?.hasMultipleSpecValues" v-model="specValue"
                    :error-messages="errors.specValue" :items="productData?.specificationOptions"
                    :label="productData?.specification || 'Specification'" density="compact" variant="outlined"
                    :suffix="productData?.unit" />
                  <v-text-field v-else v-model="specValue" :error-messages="errors.specValue"
                    :label="productData?.specification || 'Specification'" type="number" density="compact"
                    variant="outlined" :suffix="productData?.unit" />
                </template>
                <div v-else class="text-medium-emphasis mt-3">Select product to show specifications</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-select v-model="goldCarat" :items="purityOptions" :error-messages="errors.goldCarat"
                  label="Gold Carat" density="compact" variant="outlined" item-title="gold carat" />
              </v-col>
              <v-col cols="4">
                <v-select v-model="goldColor" :error-messages="errors.goldColor" :items="goldColors" label="Gold Color"
                  density="compact" variant="outlined" item-title="gold color" />
              </v-col>

              <v-col cols="4">
                <v-text-field v-max-decimals="3" v-model="goldWeight" :error-messages="errors.goldWeight"
                  label="Gold Weight in Gms" density="compact" variant="outlined" type="number" />

              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field v-model="diamondWeight" :error-messages="errors.diamondWeight"
                  label="Diamond Weight in Cts" density="compact" variant="outlined" type="number" v-max-decimals="3" />
              </v-col>

              <v-col cols="4">
                <v-text-field v-model="colorStoneWeight" :error-messages="errors.colorStoneWeight"
                  label="Color Stone Weight in Cts" density="compact" variant="outlined" type="number"
                  v-max-decimals="3" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <!-- Image Upload -->
            <v-row class="pt-4">
              <label class="d-flex mb-4" style="cursor: pointer">
                <v-icon class="mr-2">mdi-paperclip</v-icon>
                <input type="file" accept="image/*" multiple hidden @change="onFileChange"
                  :disabled="designImages.length >= 3" />
                <span>Attach Images (max 3)</span>
              </label>
            </v-row>
            <v-row>
              <v-col cols="8" class="d-flex">
                <v-responsive max-width="200" max-height="200" class="mr-2" v-for="(image, index) in designImages"
                  :key="index">
                  <v-img :src="image.preview" cover />
                  <v-btn icon variant="flat" class="ma-2" size="x-small"
                    style="position: absolute; top: 0; right: 0; z-index: 1; background-color: rgba(0,0,0,0.6)"
                    @click="removeImage(image, index)">
                    <v-icon color="white">mdi-close</v-icon>
                  </v-btn>
                </v-responsive>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row dense class="d-flex justify-end pb-2">
          <v-col cols="auto" class="d-flex justify-end align-end">
            <v-btn class="me-2" density="compact" variant="tonal" color="danger" :onclick="resetDesignForm"
              size="x-large">
              {{ values.designId ? 'Cancel' : 'Clear' }}
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

  <v-card flat>
    <v-card-title class="pa-0 pb-3">
      <v-text-field hide-details density="compact" width="25%" variant="outlined" v-model="searchQuery"
        label="Search by Design No., Product etc" prepend-inner-icon="mdi-magnify" clearable />
    </v-card-title>
    <v-data-table density="compact" :headers="headers" :items="filteredItems" :items-per-page="5"
      :items-per-page-options="[5, 10, 25, 50]" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-btn density="compact" variant="text" icon @click="edit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
        <v-btn density="compact" variant="text" icon @click="deleteItem(item)">
          <v-icon color="danger">mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { goldColors, productOptions, purityOptions } from '@/models/product';
import { useLoader } from '@/composables/useLoader';
import { apiCreate, apiGetAll, apiUpdate } from '@/services/common/api';
import { DataSourceObjects } from '@/models/api';
import { useSnackbar } from '@/composables/useSnackbar';
import { DefaultErrorMsg } from '@/services/common/constants';
import { IDesign } from '@/models/design';
import { object, string } from 'yup';
import { deleteImages, getImages, uploadImages } from '@/services/design';
import { useConfirmDialog } from '@/composables/useConfirmDialog';

const { showLoader, hideLoader } = useLoader();
const { showSnackbar } = useSnackbar();
const { showConfirm } = useConfirmDialog();

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

const { handleSubmit, isSubmitting, resetForm, errors, setValues, values, defineField } = useForm<IDesign>({
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

interface IDesignImageFile {
  file?: File,
  preview: string,
  fileName?: string
}
const designImages = ref<IDesignImageFile[]>([]);
// const imagePreviews = ref<string[]>([]);
const designImageMap = new Map<string, string[][]>();


function loadAllDesigns() {
  showLoader()
  apiGetAll<IDesign[]>(DataSourceObjects.design).then(resp => {
    allDesigns.value = resp;
  })
    .finally(hideLoader)
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const selectedFiles = Array.from(input?.files ?? []);
  const processedFiles: IDesignImageFile[] = [];

  for (const file of selectedFiles) {
    const preview = await file.toDataUrl();
    processedFiles.push({
      file,
      preview,
    });
  }

  designImages.value = [...designImages.value, ...processedFiles].slice(0, 3);

  // Clear input so selecting the same file again triggers the change event
  input.value = "";
}


function removeImage(image: IDesignImageFile, index: number) {
  showConfirm({
    type: 'delete',
    message: 'Are you sure you want to remove this image?',
    onPrimaryAction: async () => {
      if (!image.file) {
        deleteImages(values.designId, image.fileName);
        designImageMap.delete(values.designId);
      }
      designImages.value.splice(index, 1);
    }
  })
}

const submit = handleSubmit(values =>
  showConfirm({
    onPrimaryAction: async () => {
      showLoader();
      var response = values.designId ? await apiUpdate(DataSourceObjects.design, values) : await apiCreate(DataSourceObjects.design, values);
      if (!['created', 'updated'].includes(response.status)) {
        showSnackbar(DefaultErrorMsg, 'danger');
        hideLoader();
        return;
      }

      if (designImages.value?.length) {
        var formData = new FormData();
        designImages.value.filter(x => x.file?.size).forEach(x => {
          formData.append(x.fileName, x.file);
        });
        await uploadImages(response.id || values.designId, formData);
      }
      showSnackbar("Design saved successfully");
      resetDesignForm(response.id || values.designId);
      loadAllDesigns();
      hideLoader();
    }
  })
);

function resetDesignForm(designId: string) {
  resetForm({ values: { ...initialValues } });
  designImages.value = [];
  designImageMap.delete(designId);
}

async function edit(item: IDesign) {
  setValues(item);
  let imageMap = designImageMap.get(item.designId);
  if (!imageMap?.length) {
    let imageResponse = await getImages(item.designId);
    designImageMap.set(item.designId, Object.entries(imageResponse));
    imageMap = designImageMap.get(item.designId);
  }
  if (imageMap?.length) {
    designImages.value = imageMap.map(([fileName, preview]) => ({
      fileName,
      preview
    }))
  }
}

function deleteItem(item: IDesign) {
  showConfirm({
    type: 'delete',
    title: `Delete ${item.designNo}`,
    message: 'Are you sure you want to delete this design?',
    onPrimaryAction: async () => {
      showSnackbar('Delete functionality yet to be implemented. Please contact Vishnu Vardhan (vishnu@elixapp.in)', 'danger');
    }
  })
}


</script>
