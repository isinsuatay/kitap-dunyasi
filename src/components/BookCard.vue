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
import { computed, onMounted } from "vue";
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
</script>

<style lang="scss">
@use "@/styles/bookCard";
</style>