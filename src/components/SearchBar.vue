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
        {{ book.name }}
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

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 25px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.search-icon {
  padding: 10px;
  color: #888;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.search-icon:hover {
  transform: scale(1.2);
}

.search-input {
  width: 100%;
  padding: 8px 16px 8px 0;
  font-size: 16px;
  border: none;
  outline: none;
  border-radius: 25px;
  padding-left: 32px;
  transition: all 0.3s ease;
}

.search-input:focus {
  border: 1px solid #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.search-results {
  position: absolute;
  top: 100%; /* Bu kısım, listeyi input'un hemen altına yerleştirir */
  left: 0;
  background: white;
  border: 1px solid #ddd;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px; /* Maksimum yükseklik */
  overflow-y: auto; /* Eğer liste çok uzunsa kaydırılabilir yap */
}

.search-results li {
  padding: 8px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.search-results li:hover {
  background: #007bff;
  color: white;
}
</style>