<!-- components/ImageViewer.vue -->
<template>
    <v-dialog v-model="isOpen" max-width="600" persistent>
        <v-card density="compact">
            <div class="pa-3 d-flex">
                <v-img :src="imageSrc" max-height="400" contain />
                <v-btn icon flat density="compact" @click="closeViewer"><v-icon>mdi-close</v-icon></v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useImageViewer } from '@/composables/useImageViewer';
const { isOpen, imageSrc, closeViewer } = useImageViewer();
</script>
