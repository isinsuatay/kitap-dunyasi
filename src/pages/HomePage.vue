<template>
  <div class="home-page">
    <div class="content">
      <!-- Hero Bölümü -->
      <div class="hero-section">
        <h1>📚 Kitap Dünyasına Hoş Geldiniz</h1>
        <p>Binlerce kitap arasından keşfe çıkın, favorilerinizi yönetin ve yeni hikayeler keşfedin.</p>
        <h4>📚 Okuma Yolculuğuna Başla</h4>
        <p>Favori kitaplarını listele, yeni kitaplar keşfet ve okuma alışkanlıklarını geliştir.</p>
        <button class="cta-button" @click="$router.push('/addbook')">
          📖 Hemen Kitap Ekle
        </button>
      </div>

      <!-- Kitap Carousel -->
      <BookCarousel class="book-carousel" />

      <!-- Kitap Listesi -->
      <BookList class="book-list" :books="filteredBooks" :viewMode="viewMode" />
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import BookList from "@/components/BookList.vue";
import BookCarousel from "@/components/BookCarousel.vue";

const store = useStore();

const viewMode = computed(() => store.state.books.viewMode);
const filteredBooks = computed(() => store.state.books.filteredBooks);


onMounted(() => {
  store.dispatch("books/loadBooks");
});
</script>

<style lang="scss">

@use "@/styles/homePageStyles";
</style>