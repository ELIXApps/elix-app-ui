/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Prototypes
import './services/utility/prototype';

// Styles
import "unfonts.css";
import { registerDirectives } from "./services/utility/derectives";

const app = createApp(App);
registerPlugins(app);
registerDirectives(app);
app.mount("#app");
