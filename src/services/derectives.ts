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

// Add more directives here in the same pattern
// const otherDirective = {
//   mounted(el: HTMLElement) {
//     // Future custom directive logic
//   }
// };

// Register all
export function registerDirectives(app: App) {
  app.directive("max-decimals", decimalFormat);
  //   app.directive("other-directive", otherDirective); // example
}
