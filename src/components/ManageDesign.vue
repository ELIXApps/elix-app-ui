<template>
  <form @submit.prevent="submit">
    <v-row dense>
      <v-col cols="6" md="6">
        <v-text-field v-model="designName.value.value" :error-messages="designName.errorMessage.value"
          label="Design Name" density="compact" variant="outlined" />
      </v-col>

      <v-col cols="12" md="6">
        <v-select v-model="ornament.value.value" :items="ornamentOptions" :error-messages="ornament.errorMessage.value"
          label="Ornament" density="compact" variant="outlined" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field v-model="specification.value.value" :error-messages="specification.errorMessage.value"
          label="Specification" readonly density="compact" variant="outlined" />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field v-model="unit.value.value" :error-messages="unit.errorMessage.value" label="Unit"
          density="compact" variant="outlined" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-text-field v-model="goldCarat.value.value" :error-messages="goldCarat.errorMessage.value" label="Gold Carat"
          density="compact" variant="outlined" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="goldColor.value.value" :error-messages="goldColor.errorMessage.value" label="Gold Color"
          density="compact" variant="outlined" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="4">
        <v-text-field v-model="goldWeight.value.value" :error-messages="goldWeight.errorMessage.value"
          label="Gold Weight" density="compact" variant="outlined" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="diamondWeight.value.value" :error-messages="diamondWeight.errorMessage.value"
          label="Diamond Weight" density="compact" variant="outlined" />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="colorStoneWeight.value.value" :error-messages="colorStoneWeight.errorMessage.value"
          label="Color Stone Weight" density="compact" variant="outlined" />
      </v-col>
    </v-row>

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

const ornamentOptions = ['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Pendant']

const { handleSubmit } = useForm({
  validationSchema: {
    designName: v => (!!v && v.length >= 1) || 'Design Name is required',
    ornament: v => !!v || 'Ornament is required',
    specification: v => (!!v && v.length >= 1) || 'Specification is required',
    unit: v => (!!v && v.length >= 1) || 'Unit is required',
    goldCarat: v => (!!v && v.length >= 1) || 'Gold Carat is required',
    goldColor: v => (!!v && v.length >= 1) || 'Gold Color is required',
    goldWeight: v => (!!v && v.length >= 1) || 'Gold Weight is required',
    diamondWeight: v => (!!v && v.length >= 1) || 'Diamond Weight is required',
    colorStoneWeight: v => (!!v && v.length >= 1) || 'Color Stone Weight is required',
  },
})

const designName = useField('designName')
const ornament = useField<string>('ornament')
const specification = useField('specification', undefined, { initialValue: 'Default Specification' })
const unit = useField('unit')
const goldCarat = useField('goldCarat')
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
  console.log('Form submitted:', values)
})
</script>
