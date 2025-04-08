<template>
  <header class="navbar">
    <div class="logo">
      <router-link to="/">
        <i class="fas fa-book-open"></i> Kitap Dünyası
      </router-link>
    </div>

    <div class="menu-icon" :class="{ dark: isDark }" @click="toggleMenu">
      <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </div>

    <ul :class="['nav-links', { active: menuOpen }]">
      <li>
        <router-link to="/"><i class="fas fa-home"></i> Ana Sayfa</router-link>
      </li>
      <li>
        <router-link to="/favorites"
          ><i class="fas fa-star"></i> Favoriler</router-link
        >
      </li>
      <li>
        <router-link to="/addbook"
          ><i class="fas fa-plus-circle"></i> Kitap Ekle</router-link
        >
      </li>

      <li v-if="isAuthenticated">
        <router-link to="/profile"
          ><i class="fas fa-user"></i> Profil</router-link
        >
      </li>

      <li v-if="!isAuthenticated">
        <router-link to="/auth"
          ><i class="fas fa-sign-in-alt"></i> Giriş Yap / Kayıt Ol</router-link
        >
      </li>

      <div class="search-container">
        <SearchBar />
      </div>

      <li>
        <div class="theme-toggle" @click="toggleTheme">
          <div :class="['toggle-slider', { dark: isDark }]">
            <i v-if="!isDark" class="fas fa-sun sun-icon"></i>
            <i v-else class="fas fa-moon moon-icon"></i>
          </div>
        </div>
      </li>
    </ul>
  </header>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";

defineProps(["isDark", "toggleTheme"]);
const store = useStore();
const router = useRouter();
const isAuthenticated = computed(() => store.getters["user/isAuthenticated"]);
const menuOpen = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

watch(menuOpen, (newValue) => {
  if (newValue) {
    router.afterEach(() => {
      menuOpen.value = false;
    });
  }
});
</script>

<style lang="scss">
@use "@/styles/header";
</style>
