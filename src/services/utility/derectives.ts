// directives.ts
import type { App, DirectiveBinding } from "vue";

// Decimal format directive
const decimalFormat = {
  mounted(el: HTMLElement, binding: DirectiveBinding<number>) {
    const precision = binding.value ?? 3;

    // find the actual input inside v-text-field wrapper
    const inputEl = el.querySelector("input");
    if (!inputEl) {
      console.warn("v-decimal-format directive: no inner input found");
      return;
    }

    const onBlur = () => {
      const val = parseFloat(inputEl.value);
      if (!isNaN(val)) {
        inputEl.value = val.toFixed(precision);
        inputEl.dispatchEvent(new Event("input"));
      }
    };

    const onInput = () => {
      const val = inputEl.value;

      const parts = val.split(".");
      if (parts.length > 2) {
        inputEl.value = parts[0] + "." + parts.slice(1).join("");
      }

      // Limit decimal digits to 3
      if (parts.length === 2) {
        parts[1] = parts[1].slice(0, 2);
        inputEl.value = parts[0] + "." + parts[1];
      }
    };

    inputEl.addEventListener("blur", onBlur);
    inputEl.addEventListener("keypress", onInput);

    (el as any)._decimalFormatCleanup = () => {
      inputEl.removeEventListener("blur", onBlur);
      inputEl.removeEventListener("input", onInput);
    };
  },

  unmounted(el: HTMLElement) {
    (el as any)._decimalFormatCleanup?.();
  },
};

import { useImageViewer } from "@/composables/useImageViewer";

// Image viewer directive
const imageViewer = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    el.style.cursor = "pointer"; // Optional styling

    el.addEventListener("click", () => {
      const src = binding.value || el.getAttribute("src");
      const title = el.getAttribute("alt") || "";
      if (src) {
        // Reuse viewer composable
        const { showImageViewer } = useImageViewer();
        showImageViewer({ src, title });
      }
    });

    (el as any)._imageViewerCleanup = () => {
      el.removeEventListener("click", () => {});
    };
  },
  unmounted(el: HTMLElement) {
    (el as any)._imageViewerCleanup?.();
  },
};


// Register all
export function registerDirectives(app: App) {
  app.directive("max-decimals", decimalFormat);
  app.directive("image-viewer", imageViewer);
}
