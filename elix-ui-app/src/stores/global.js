import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    isAuthLoading: true, // This will be used to show/hide loading state during authentication
  }),
  actions: {
    authLoading(flag) {
      this.isAuthLoading = flag;
    },
  },
});
