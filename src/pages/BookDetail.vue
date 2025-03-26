<template>
  <div v-if="book" class="book-detail-container">
    <div class="book-detail-card">
      <div class="book-cover">
        <img :src="book.image || book.cover" :alt="book.title" class="book-cover-image" />
      </div>
      <div class="book-info">
        <h1>{{ book.title }}</h1>
        <p class="author">📖 Yazar: <strong>{{ book.author }}</strong></p>
        <p class="category">📚 Kategori: <strong>{{ book.category }}</strong></p>
        <p class="isbn">📎 ISBN: <strong>{{ book.isbn }}</strong></p>
        <p class="page-count">📑 Sayfa Sayısı: <strong>{{ book.pageCount }}</strong></p>
        <p class="publish-date">🗓️ Basım Tarihi: <strong>{{ book.publicationDate }}</strong></p>
        <p class="description">{{ book.description }}</p>
        <button @click="toggleFavorite" class="book-favorite-btn">
          {{ isFavorite ? "❤️ Favorilerden Çıkar" : "⭐ Favorilere Ekle" }}
        </button>
      </div>
    </div>

    <div class="social-media-share">
      <p>Kitabınızı paylaşarak başkalarına önerin:</p>
      <button class="social-toggle-btn" @click="toggleSocialIcons">
        <i class="fas fa-share-alt"></i> Paylaş
      </button>
      <div class="social-media-icons" :class="{ show: showSocialIcons }">
        <a class="social-icon" href="https://www.facebook.com" target="_blank" aria-label="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a class="social-icon" href="https://www.twitter.com" target="_blank" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a class="social-icon" href="https://www.instagram.com" target="_blank" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a class="social-icon" href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
          <i class="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>

    <button @click="goBack" class="back-button">Geri Dön</button>
    
    <ReviewsSection :bookId="book.id" />

    <div v-if="relatedBooks.length" class="related-books">
  <h2>📚 İlgili Kitaplar</h2>
  <div class="related-books-list">
    <BookCard 
      v-for="related in relatedBooks" 
      :key="related.id" 
      :book="related" 
    />
  </div>
</div>
  </div>

  <div v-else>
    <p>Kitap bulunamadı! <router-link to="/">Anasayfaya dön</router-link></p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Swal from "sweetalert2";
import ReviewsSection from "@/Components/ReviewsSection.vue";
import BookCard from "@/components/BookCard.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const showSocialIcons = ref(false);

const book = computed(() => store.state.books.books.find(b => String(b.id) === route.params.id));
const isFavorite = computed(() => store.getters["favorites/isFavorite"](route.params.id));

const goBack = () => router.go(-1);


const relatedBooks = computed(() => {
  if (!book.value) return [];
  return store.state.books.books.filter(
    b => b.category === book.value.category && b.id !== book.value.id
  );
});


const toggleFavorite = () => {
  if (!book.value) return;
  if (isFavorite.value) {
    store.dispatch("favorites/removeFavorite", route.params.id);
    Swal.fire({
      icon: "info",
      title: "Favorilerden Çıkarıldı",
      text: `"${book.value.title}" favorilerden çıkarıldı!`,
      confirmButtonText: "Tamam",
    });
  } else {
    store.dispatch("favorites/addFavorite", book.value);
    Swal.fire({
      icon: "success",
      title: "Favorilere Eklendi",
      text: `"${book.value.title}" favorilerinize eklendi!`,
      confirmButtonText: "Tamam",
    });
  }
};

const toggleSocialIcons = () => showSocialIcons.value = !showSocialIcons.value;


onMounted(() => {
  store.dispatch("books/loadBooks");
  store.dispatch("favorites/loadFavorites");
  window.scrollTo(0, 0);
  
  if (!book.value) {
    const storedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    const foundBook = storedBooks.find(b => String(b.id) === route.params.id);
    if (foundBook) {
      store.dispatch("books/addBook", foundBook);
    } else {
      router.push("/");
    }
  }
});
</script>

<style lang="scss">
@use "@/styles/bookDetail";
</style>