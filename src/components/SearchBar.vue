<template>
  <div class="search-bar" @focusin="isFocused = true" @focusout="handleBlur">
    <div class="search-icon">
      <i class="fas fa-search"></i> <!-- Arama ikonu -->
    </div>
    <input
      v-model.trim="searchQuery"
      type="text"
      placeholder="Kitap ara..."
      @input="debouncedSearch"
      class="search-input"
    />
    <ul v-if="isFocused && searchQuery.length > 0 && searchResults.length" class="search-results">
      <li 
        v-for="book in searchResults" 
        :key="book.id" 
        @click="goToBookDetail(book.id)"
      >
        {{ book.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const searchQuery = ref("");
const isFocused = ref(false);
const searchResults = ref([]); // 🔥 Vuex’ten gelen sonuçları burada saklıyoruz

let timeout = null;

// **Debounced Search (Gecikmeli Arama)**
const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      store.dispatch("books/searchBooks", searchQuery.value.trim());
    } else {
      store.commit("books/setFilteredBooks", []);
    }
  }, 300);
};

// **Store'daki Sonuçları İzle**
watch(
  () => store.state.books.filteredBooks,
  (newResults) => {
    console.log("🔍 Güncellenen Arama Sonuçları:", newResults); // 📌 Konsola yazdır
    searchResults.value = newResults || [];
  },
  { immediate: true } // 🎯 Uygulama başladığında Vuex’ten sonuçları al
);

// **Kitap detayına git**
const goToBookDetail = (bookId) => {
  if (!bookId) return;
  router.push({ name: "BookDetail", params: { id: bookId } });
  clearSearch(); // 📌 Sayfa değişince listeyi kapat
};

// **Odak dışına çıkınca listeyi kapat**
const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

// **Arama kutusunu temizle ve listeyi kapat**
const clearSearch = () => {
  searchQuery.value = "";
  isFocused.value = false;
  store.commit("books/setFilteredBooks", []);
};

// **Sayfa değiştiğinde arama listesini temizle**
onMounted(() => {
  router.afterEach(() => {
    clearSearch();
  });
});

onUnmounted(() => {
  router.afterEach(() => {}); // Router event’ini temizle
});
</script>

<style lang="scss">

@use "@/styles/searchBar";
</style>