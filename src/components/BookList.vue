<template>
  <div class="book-list-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="filters">
        <h3>Filtreler</h3>

        <div class="filter-item">
          <SearchBar />
        </div>

        <div class="filter-item">
          <div class="view-toggle">
            <button @click="changeViewMode('grid')" :class="{ active: viewMode === 'grid' }">
              <i class="fas fa-th-large"></i>
            </button>
            <button @click="changeViewMode('list')" :class="{ active: viewMode === 'list' }">
              <i class="fas fa-list"></i>
            </button>
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
          <label for="minPages">Min. Sayfa Sayısı:</label>
          <input 
            type="number" 
            v-model="minPages" 
            @input="applyFilters" 
            @change="minPages = Math.max(minPages, 0)" 
          />

          <label for="maxPages">Max. Sayfa Sayısı:</label>
          <input 
            type="number" 
            v-model="maxPages" 
            @input="applyFilters" 
            @change="maxPages = Math.max(maxPages, 0)" 
          />
        </div>

        <!-- Para Birimi Seçici -->
        <div class="filter-item">
          <label for="currency">Para Birimi:</label>
          <select v-model="selectedCurrency" @change="updateCurrency">
            <option v-for="(rate, currency) in exchangeRates" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
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
            <option value="title">İsim (A-Z)</option>
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
import { computed, ref, onMounted } from 'vue'; 
import { useStore } from 'vuex';
import BookCard from './BookCard.vue';
import SearchBar from './SearchBar.vue';
import { getStoredExchangeRates, fetchExchangeRates } from "@/services/exchangeService"

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
const minPages = ref(null);
const maxPages = ref(null);
const isFree = ref(false);
const selectedSort = ref("newest");
const categories = computed(() => store.state.books.categories);
const languages = computed(() => store.state.books.languages);

// Kitapları ve döviz kurlarını Vuex'ten al
const exchangeRates = computed(() => store.state.currency.exchangeRates || {});

// Para birimi seçimi ve güncelleme
const selectedCurrency = computed({
  get: () => store.state.currency.selectedCurrency,
  set: (value) => store.dispatch("currency/setSelectedCurrency", value),
});

// Döviz verilerini API'den çekme ve Vuex'e kaydetme
const fetchAndUpdateExchangeRates = async () => {
  const rates = await fetchExchangeRates();
  if (rates) {
    store.commit("currency/setExchangeRates", rates);  // Vuex'te döviz kuru verisini güncelle
  }
};

// Sayfa yüklendiğinde döviz verilerini kontrol etme
onMounted(() => {
  const storedRates = getStoredExchangeRates();

  if (storedRates) {
    store.commit("currency/setExchangeRates", storedRates);  // Döviz kurlarını Vuex'e kaydet
  } else {
    fetchAndUpdateExchangeRates();  // Eğer localStorage'da veri yoksa, API'den al
  }
});

// Para birimi seçildiğinde işlem yapma
const updateCurrency = () => {
  store.dispatch("currency/setSelectedCurrency", selectedCurrency.value);
};

// Filtreleri uygulama
const applyFilters = () => {
  const filters = {
    category: selectedCategory.value,
    language: selectedLanguage.value,
    minPages: minPages.value,
    maxPages: maxPages.value,
    isFree: isFree.value,
    sort: selectedSort.value,
  };
  
  console.log("Filtreleme uygulanıyor:", filters);
  store.dispatch("books/filterBooks", filters);
};

// Filtreleri temizleme
const clearFilters = () => {
  selectedCategory.value = "";
  selectedLanguage.value = "";
  minPages.value = null;
  maxPages.value = null;
  isFree.value = false;
  selectedSort.value = "title";  

  store.dispatch("books/filterBooks", {
    category: "",
    language: "",
    sortOption: "title",
    minPages: 0,
    maxPages: Infinity,
    isFree: false,
  });
  localStorage.removeItem("filters");
};

// Görünüm modunu değiştirme
const changeViewMode = (mode) => {
  viewMode.value = mode;
  localStorage.setItem("viewMode", mode);
};

// Sıralama işlemi
const sortedBooks = computed(() => {
  let books = [...filteredBooks.value];

  const sortBy = {
    newest: (a, b) => b.publishYear - a.publishYear,
    oldest: (a, b) => a.publishYear - b.publishYear,
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    title: (a, b) => a.title.localeCompare(b.title)
  };

  return books.sort(sortBy[selectedSort.value] || sortBy.title);
});
</script>

<style lang="scss">
@use "@/styles/bookList";
</style>
<!-- <template>
  <div class="book-list-container">
    <div class="sidebar">
      <div class="filters">
        <h3>Filtreler</h3>

        <div class="filter-item">
          <SearchBar/>
        </div>
        
        <div class="filter-item">
          <div class="view-toggle">
  <button @click="changeViewMode('grid')" :class="{ active: viewMode === 'grid' }">
    <i class="fas fa-th-large"></i>
  </button>
  <button @click="changeViewMode('list')" :class="{ active: viewMode === 'list' }">
    <i class="fas fa-list"></i>
  </button>
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
  <label for="minPages">Min. Sayfa Sayısı:</label>
  <input 
    type="number" 
    v-model="minPages" 
    @input="applyFilters" 
    @change="minPages = Math.max(minPages, 0)" 
  />

  <label for="maxPages">Max. Sayfa Sayısı:</label>
  <input 
    type="number" 
    v-model="maxPages" 
    @input="applyFilters" 
    @change="maxPages = Math.max(maxPages, 0)" 
  />
</div>

    <div class="filter-item">
      <label for="currency">Para Birimi:</label>
      <select v-model="selectedCurrency" @change="updateCurrency">
        <option v-for="(rate, currency) in exchangeRates" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
    </div>

        <div class="filter-item">
          <label for="isFree">
            <input type="checkbox" v-model="isFree" @change="applyFilters" /> Ücretsiz Kitaplar
          </label>
        </div>

         <div class="filter-item">
          <label>Sıralama:</label>
          <select v-model="selectedSort" @change="applyFilters">
            <option value="newest">Yayın Yılı (Yeniden Eskiye)</option>
            <option value="oldest">Yayın Yılı (Eskiden Yeniye)</option>
            <option value="priceAsc">Fiyat (Artan)</option>
            <option value="priceDesc">Fiyat (Azalan)</option>
            <option value="title">İsim (A-Z)</option>
          </select>
        </div>

        <button class="clear-filters" @click="clearFilters">Filtreleri Temizle</button>
      </div>
    </div>

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
import { computed, ref, onMounted } from 'vue'; 
import { useStore } from 'vuex';
import BookCard from './BookCard.vue';
import SearchBar from './SearchBar.vue';
import { getStoredExchangeRates, fetchExchangeRates } from "@/services/exchangeService"

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
const minPages = ref(null);
const maxPages = ref(null);
const isFree = ref(false);
const selectedSort = ref("newest");
const categories = computed(() => store.state.books.categories);
const languages = computed(() => store.state.books.languages);

// Kitapları ve döviz kurlarını Vuex'ten al
const exchangeRates = computed(() => store.state.currency.exchangeRates || {});

// Para birimi seçimi ve güncelleme
const selectedCurrency = computed({
  get: () => store.state.currency.selectedCurrency,
  set: (value) => store.dispatch("currency/setSelectedCurrency", value),
});

// Döviz verilerini API'den çekme ve Vuex'e kaydetme
const fetchAndUpdateExchangeRates = async () => {
  const rates = await fetchExchangeRates();
  if (rates) {
    store.commit("currency/setExchangeRates", rates);  // Vuex'te döviz kuru verisini güncelle
  }
};

// Sayfa yüklendiğinde döviz verilerini kontrol etme
onMounted(() => {
  const storedRates = getStoredExchangeRates();

  if (storedRates) {
    store.commit("currency/setExchangeRates", storedRates);  // Döviz kurlarını Vuex'e kaydet
  } else {
    fetchAndUpdateExchangeRates();  // Eğer localStorage'da veri yoksa, API'den al
  }
});

// Para birimi seçildiğinde işlem yapma
const updateCurrency = () => {
  store.dispatch("currency/setSelectedCurrency", selectedCurrency.value);
};

// Filtreleri uygulama
const applyFilters = () => {
  console.log("Filtreleme uygulanıyor:", {
    category: selectedCategory.value,
    language: selectedLanguage.value,
    minPages: minPages.value,
    maxPages: maxPages.value,
    isFree: isFree.value,
    sort: selectedSort.value,
  });

  store.dispatch("books/filterBooks", {
    category: selectedCategory.value,
    language: selectedLanguage.value,
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
  minPages.value = null;
  maxPages.value = null;
  isFree.value = false;
  selectedSort.value = "title";  

  store.dispatch("books/filterBooks", {
    category: "",
    language: "",
    sortOption: "title",
    minPages: 0,
    maxPages: Infinity,
    isFree: false,
  });
  localStorage.removeItem("filters");
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
    case "title":
      return books.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return books;
  }
});
</script>

<style lang="scss">
@use "@/styles/bookList";
</style> -->
