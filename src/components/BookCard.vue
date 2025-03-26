<template>
  <div class="book-card" @click="goToDetail" role="button" tabindex="0">
    <!-- Favori Butonu -->
    <button @click.stop="toggleFavorite" class="favorite-btn">
      <i :class="isFavorite ? 'fas fa-star active' : 'far fa-star'"></i>
    </button>

    <div class="book-image-container">
      <img :src="bookImage" :alt="book.title" class="book-cover" />
    </div>

    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-category">{{ book.category }}</p>
      
      <!-- Kitap fiyatı -->
      <p class="book-price">
        {{ convertedPrice }} {{ selectedCurrency }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps({
  book: Object,
});

const store = useStore();
const router = useRouter();
const defaultImage = "/default-book.jpg"; 

// Kitap resmini belirleme
const bookImage = computed(() => props.book.image || props.book.cover || defaultImage);

// Favori durumu
const isFavorite = computed(() => store.getters["favorites/isFavorite"](props.book.id));

// Seçilen para birimi ve döviz kurları
const selectedCurrency = computed(() => store.state.currency.selectedCurrency);
const exchangeRates = computed(() => store.state.currency.exchangeRates);

// Fiyat bilgisi
const originalPrice = computed(() => props.book.price || 0);
const bookCurrency = computed(() => props.book.currency || "USD");

// Döviz çevirme
const convertedPrice = computed(() => {
  if (!exchangeRates.value || !exchangeRates.value[selectedCurrency.value]) {
    return originalPrice.value.toFixed(2); // Döviz kurları yoksa orijinal fiyatı göster
  }

  if (bookCurrency.value === selectedCurrency.value) {
    return originalPrice.value.toFixed(2); // Zaten aynı para birimindeyse çeviri yapma
  }

  const baseRate = exchangeRates.value[bookCurrency.value];
  const targetRate = exchangeRates.value[selectedCurrency.value];

  if (!baseRate || !targetRate) return originalPrice.value.toFixed(2);

  return ((originalPrice.value / baseRate) * targetRate).toFixed(2);
});

// Detay sayfasına git
const goToDetail = () => {
  router.push({ name: 'BookDetail', params: { id: props.book.id.toString() } });
};

// Favori ekleme/çıkartma
const toggleFavorite = () => {
  if (isFavorite.value) {
    store.dispatch("favorites/removeFavorite", props.book.id);
  } else {
    store.dispatch("favorites/addFavorite", props.book); 
  }
};

// Döviz kurlarını yükle
onMounted(() => {
  store.dispatch("currency/fetchExchangeRates");  
});

// Para birimi değiştiğinde döviz kurlarını güncelle
watch(selectedCurrency, () => {
  store.dispatch("currency/fetchExchangeRates");
});
</script>

<style lang="scss">
@use "@/styles/bookCard";
</style>