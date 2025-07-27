// composables/useConfirmDialog.ts
import { ref } from 'vue';

export type ConfirmType = 'default' | 'delete';

interface ConfirmOptions {
  title?: string;
  message?: string;
  type?: ConfirmType;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

const isVisible = ref(false);
const confirmOptions = ref<ConfirmOptions>({
  title: '',
  message: '',
  type: 'default',
  primaryText: 'Yes',
  secondaryText: 'No',
  onPrimaryAction: () => {},
});

function showConfirm(options: ConfirmOptions) {
  confirmOptions.value = {
    title: 'Confirm',
    type: 'default',
    message: 'Are you sure you want to save the changes?',
    primaryText: 'Yes',
    secondaryText: 'No',
    ...options,
  };
  isVisible.value = true;
}

function closeConfirm() {
  isVisible.value = false;
}

export function useConfirmDialog() {
  return {
    isVisible,
    confirmOptions,
    showConfirm,
    closeConfirm,
  };
}
