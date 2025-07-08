// useSnackbar.ts
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const color = ref('success')
const timeout = ref(3000)

export function useSnackbar() {
  function showSnackbar(
    msg: string,
    toastColor: 'success' | 'danger' = 'success',
    time = 3000
  ) {
    message.value = msg
    color.value = toastColor
    timeout.value = time
    visible.value = true
  }

  return {
    // state
    visible,
    message,
    color,
    timeout,
    // method
    showSnackbar
  }
}
