<template>
  <div class="book-list-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="filters">
        <h3>Filtreler</h3>

        <div class="filter-item">
          <SearchBar/>
        </div>
        
        <div class="filter-item">
          <div class="view-toggle">
        <button @click="changeViewMode('grid')" :class="{ active: viewMode === 'grid' }">📚 Grid</button>
        <button @click="changeViewMode('list')" :class="{ active: viewMode === 'list' }">📖 List</button>
      </div>
        </div>
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
          <label for="minPages">Min. Sayfa Sayısı:</label>
          <input type="number" v-model="minPages" @input="applyFilters" />

          <label for="maxPages">Max. Sayfa Sayısı:</label>
          <input type="number" v-model="maxPages" @input="applyFilters" />
        </div>

        <div class="filter-item">
          <label for="isFree">
            <input type="checkbox" v-model="isFree" @change="applyFilters" /> Ücretsiz Kitaplar
          </label>
        </div>

         <!-- Sıralama Seçenekleri -->
         <div class="filter-item">
          <label>Sıralama:</label>
          <select v-model="selectedSort" @change="applyFilters">
            <option value="newest">Yayın Yılı (Yeniden Eskiye)</option>
            <option value="oldest">Yayın Yılı (Eskiden Yeniye)</option>
            <option value="priceAsc">Fiyat (Artan)</option>
            <option value="priceDesc">Fiyat (Azalan)</option>
            <option value="name">İsim (A-Z)</option>
          </select>
        </div>

        <button class="clear-filters" @click="clearFilters">Filtreleri Temizle</button>
      </div>
    </div>

    <!-- Kitaplar ve Görünüm -->
    <div class="book-list-content">  
      <div v-if="filteredBooks.length" :class="['book-list', viewMode]">
        <BookCard 
  v-for="book in sortedBooks" 
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
import { computed, ref } from 'vue';import { useStore } from 'vuex';
import BookCard from './BookCard.vue';
import SearchBar from './SearchBar.vue';

const store = useStore();

// Tüm kitapları Vuex'ten al
const allBooks = computed(() => store.state.books.books || []);

// Filtrelenmiş kitapları al
const filteredBooks = computed(() => store.state.books.filteredBooks?.length ? store.state.books.filteredBooks : allBooks.value);

// Görünüm modu
const viewMode = ref(localStorage.getItem("viewMode") || "grid");

// Filtreler için state'ler
const selectedCategory = ref("");
const selectedLanguage = ref("");
const minPrice = ref(null);
const maxPrice = ref(null);
const minPages = ref(null);
const maxPages = ref(null);
const isFree = ref(false);
const selectedSort = ref("newest");



const categories = computed(() => store.state.books.categories);
const languages = computed(() => store.state.books.languages);


// Filtreleri uygulama
const applyFilters = () => {
  store.dispatch("books/filterBooks", {
    category: selectedCategory.value,
    language: selectedLanguage.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    minPages: minPages.value,
    maxPages: maxPages.value,
    isFree: isFree.value,
    sort: selectedSort.value,
  });
};

// Filtreleri temizleme
const clearFilters = () => {
  selectedCategory.value = "";
  selectedLanguage.value = "";
  minPrice.value = null;
  maxPrice.value = null;
  minPages.value = null;
  maxPages.value = null;
  isFree.value = false;
  selectedSort.value = "newest";
  store.dispatch("books/filterBooks", {});
};

// Görünüm modunu değiştirme
const changeViewMode = (mode) => {
  viewMode.value = mode;
  localStorage.setItem("viewMode", mode);
};
// Sıralama işlemi
const sortedBooks = computed(() => {
  let books = [...filteredBooks.value];

  switch (selectedSort.value) {
    case "newest":
      return books.sort((a, b) => b.publishYear - a.publishYear);
    case "oldest":
      return books.sort((a, b) => a.publishYear - b.publishYear);
    case "priceAsc":
      return books.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return books.sort((a, b) => b.price - a.price);
    case "name":
      return books.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return books;
  }
});

</script>

<style lang="scss">
@use "@/styles/bookList";
</style>