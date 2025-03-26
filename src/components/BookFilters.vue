<template>
    <div class="filters">
      <select v-model="selectedCategory" @change="updateFilters">
        <option value="">Kategori Seç</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
  
      <select v-model="selectedLanguage" @change="updateFilters">
        <option value="">Dil Seç</option>
        <option v-for="language in languages" :key="language" :value="language">{{ language }}</option>
      </select>
  
      <input type="number" v-model="minPrice" placeholder="Min Fiyat" @input="updateFilters" />
      <input type="number" v-model="maxPrice" placeholder="Max Fiyat" @input="updateFilters" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  
  const store = useStore();
  const selectedCategory = ref("");
  const selectedLanguage = ref("");
  const minPrice = ref(null);
  const maxPrice = ref(null);
  
  const categories = computed(() => store.state.books.categories);
  const languages = computed(() => store.state.books.languages);
  
  const updateFilters = () => {
    store.commit("books/setFilters", {
      category: selectedCategory.value,
      language: selectedLanguage.value,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
    });
  };
  </script>
  
  <style scoped lang="scss">
  .filters {
    display: flex;
    gap: 10px;
  }
  select, input {
    padding: 5px;
  }
  </style>