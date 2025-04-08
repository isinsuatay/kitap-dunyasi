import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store";
import router from "./router";

import "@/styles/_index.scss"; 
import "@fortawesome/fontawesome-free/css/all.css";

const app = createApp(App);
app.use(store).use(router).mount("#app");