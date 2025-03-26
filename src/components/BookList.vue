<template>
  <div class="book-list-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <SearchBar />
      <div class="filters">
        <h3>Filtreler</h3>
        <div class="filter-item">
          <label for="category">Kategori:</label>
          <select v-model="selectedCategory" @change="applyFilters">
            <option value="">Tümü</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label for="language">Dil:</label>
          <select v-model="selectedLanguage" @change="applyFilters">
            <option value="">Tümü</option>
            <option v-for="lang in languages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label for="minPrice">Min. Fiyat:</label>
          <input type="number" v-model="minPrice" @input="applyFilters" />

          <label for="maxPrice">Max. Fiyat:</label>
          <input type="number" v-model="maxPrice" @input="applyFilters" />
        </div>

        <div class="filter-item">
          <label for="isFree">
            <input type="checkbox" v-model="isFree" @change="applyFilters" /> Ücretsiz Kitaplar
          </label>
        </div>
  <!-- Görünüm Seçimi: Grid veya Liste -->
  <div>
      <button @click="changeViewMode('grid')">Grid View</button>
      <button @click="changeViewMode('list')">List View</button>
    </div>
        <button class="clear-filters" @click="clearFilters">Filtreleri Temizle</button>
      </div>

    
    </div>

    <!-- Kitaplar ve Görünüm -->
    <div class="book-list-content">
      <div v-if="filteredBooks.length" :class="['book-list', viewMode]">
        <BookCard 
          v-for="book in filteredBooks" 
          :key="book.id" 
          :book="book"
          :class="viewMode" 
        />
      </div>

      <div v-else-if="allBooks.length" :class="['book-list', viewMode]">
        <BookCard 
          v-for="book in allBooks" 
          :key="book.id" 
          :book="book"
          :class="viewMode" 
        />
      </div>

      <div v-else class="no-books">
        📖 No books found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import BookCard from './BookCard.vue';
import SearchBar from './SearchBar.vue';

const store = useStore();

// Tüm kitapları Vuex'ten al
const allBooks = computed(() => store.state.books.books || []);

// Filtrelenmiş kitapları al
const filteredBooks = computed(() => store.state.books.filteredBooks?.length ? store.state.books.filteredBooks : allBooks.value);

// Görünüm modu
const viewMode = computed(() => store.getters["books/viewMode"] || "grid");

// Filtreler için state'ler
const selectedCategory = ref("");
const selectedLanguage = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);
const isFree = ref(false);

const categories = computed(() => store.state.books.categories);
const languages = computed(() => store.state.books.languages);

// Kitaplar yüklendiğinde
onMounted(() => {
  if (!store.state.books.books?.length) {
    store.dispatch('books/loadBooks');
  }
});

// Filtreleri uygulama
const applyFilters = () => {
  store.dispatch("books/filterBooks", {
    category: selectedCategory.value,
    language: selectedLanguage.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    isFree: isFree.value,
  });
};

// Filtreleri temizleme
const clearFilters = () => {
  selectedCategory.value = "";
  selectedLanguage.value = "";
  minPrice.value = null;
  maxPrice.value = null;
  isFree.value = false;
  store.dispatch("books/filterBooks", {});
};

// Görünüm modunu değiştirme
const changeViewMode = (mode) => {
  store.dispatch('books/setViewMode', mode);
};
</script>

<style lang="scss">

@use "@/styles/bookList";

</style>