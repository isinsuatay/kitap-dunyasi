<template>
  <div :class="{ 'dark-mode': isDark }">
    <HeaderComponent :isDark="isDark" :toggleTheme="toggleTheme" />
    <main>
      <slot />
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

const isDark = ref(false);

const loadTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  isDark.value = savedTheme === "dark";
  document.body.classList.toggle("dark-mode", isDark.value);
};

onMounted(() => {
  loadTheme();
});

const toggleTheme = () => {
  document.body.classList.add("theme-transition");
  setTimeout(() => {
    isDark.value = !isDark.value;
    document.body.classList.toggle("dark-mode", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }, 200);
};
</script>

