// composables/useImageViewer.ts
import { ref } from "vue";

const isOpen = ref(false);
const imageSrc = ref("");
const caption = ref("");

export function useImageViewer() {
  function showImageViewer({ src, title = "" }: { src: string; title?: string }) {
    imageSrc.value = src;
    caption.value = title;
    isOpen.value = true;
  }

  function closeViewer() {
    isOpen.value = false;
  }

  return { isOpen, imageSrc, caption, showImageViewer, closeViewer };
}
