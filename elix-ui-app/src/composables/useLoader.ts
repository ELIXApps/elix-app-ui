// useSnackbar.ts
import { ref } from 'vue'

const loading = ref(false)

export function useLoader() {
    const showLoader = () => loading.value = true;
    const hideLoader = () => loading.value = false;
  return {
    loading,
    showLoader,
    hideLoader
  }
}
