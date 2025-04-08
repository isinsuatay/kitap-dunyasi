<template>
  <div class="book-carousel">
    <h2 class="carousel-title">Öne Çıkan Kitaplar</h2>
    <div class="carousel">
      <div class="carousel-inner" :style="carouselStyle">
        <div 
          v-for="(book, index) in featuredBooks" 
          :key="book.id" 
          class="carousel-item"
          :class="{ active: index === currentIndex }"
        >
          <img 
            :src="book.cover || defaultImage" 
            :alt="book.title" 
            @error="handleImageError(index)"
          />
          <div class="carousel-overlay"></div>
          <div class="carousel-caption">
            <h3>{{ book.title }}</h3>
            <p>{{ book.author }}</p>
          </div>
        </div>
      </div>
      <button @click="prevSlide" class="prev">❮</button>
      <button @click="nextSlide" class="next">❯</button>

      <!-- Error Message -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const currentIndex = ref(0);
const autoplayInterval = ref(null);
const defaultImage = "https://via.placeholder.com/800x300?text=No+Image";

// Vuex'ten öne çıkan kitapları al
const featuredBooks = computed(() => store.state.books.featuredBooks || []);

const errorMessage = computed(() => 
  featuredBooks.value.length === 0 ? "No featured books available." : ""
);

const prevSlide = () => {
  if (featuredBooks.value.length) {
    currentIndex.value = (currentIndex.value - 1 + featuredBooks.value.length) % featuredBooks.value.length;
  }
};

const nextSlide = () => {
  if (featuredBooks.value.length) {
    currentIndex.value = (currentIndex.value + 1) % featuredBooks.value.length;
  }
};

const handleImageError = (book) => {
  book.cover = defaultImage;
};

// Otomatik geçiş başlatma fonksiyonu
const startAutoplay = () => {
  stopAutoplay(); 
  if (featuredBooks.value.length > 0) {
    autoplayInterval.value = setInterval(nextSlide, 10000);
  }
};

// Otomatik geçişi durdurma fonksiyonu
const stopAutoplay = () => clearInterval(autoplayInterval.value);

const carouselStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: "transform 0.8s ease-in-out",
}));

onMounted(() => {
  startAutoplay();
});

watch(featuredBooks, () => {
  startAutoplay(); 
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style lang="scss">
@use "@/styles/carousel";
</style>