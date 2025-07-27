<!-- components/ConfirmDialog.vue -->
<template>
    <v-dialog v-model="isVisible" width="30%">
        <v-card>
            <v-card-title class="text-h6">{{ options.title }}</v-card-title>
            <v-card-text>{{ options.message }}</v-card-text>
            <v-card-actions class="justify-end">
                <v-btn density="compact" variant="tonal" :color="cancelColor" @click="handleSecondaryAction">
                    {{ options.secondaryText }}
                </v-btn>
                <v-btn density="compact" variant="tonal" :color="confirmColor" @click="handlePrimaryAction">
                    {{ options.primaryText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { computed } from 'vue';

const { isVisible, confirmOptions: options, closeConfirm } = useConfirmDialog();

const confirmColor = computed(() =>
    options.value.type === 'delete' ? 'danger' : 'success'
);
const cancelColor = computed(() =>
    options.value.type === 'delete' ? 'success' : 'danger'
);

function handlePrimaryAction() {
    options.value.onPrimaryAction();
    closeConfirm();
}

function handleSecondaryAction() {
    options.value.onSecondaryAction?.();
    closeConfirm();
}
</script>
