<template>
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const currentIndex = ref(0);
const autoplayInterval = ref(null);
const defaultImage = "https://via.placeholder.com/800x300?text=No+Image";

// Featured kitapları Vuex store'dan alıyoruz, eğer boşsa boş dizi döndürüyoruz
const featuredBooks = computed(() => {
  const books = store.state.books.featuredBooks; 
  return books && books.length > 0 ? books : []; 
});

const errorMessage = ref(""); // Hata mesajı durumu

// Önceki slayta gitme fonksiyonu
const prevSlide = () => {
  if (featuredBooks.value.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + featuredBooks.value.length) % featuredBooks.value.length;
  }
};

// Sonraki slayta gitme fonksiyonu
const nextSlide = () => {
  if (featuredBooks.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % featuredBooks.value.length;
  }
};

// Eğer resim yüklenemezse varsayılan resme geçir
const handleImageError = (index) => {
  featuredBooks.value[index].cover = defaultImage;
};

// Otomatik geçiş başlatma fonksiyonu
const startAutoplay = () => {
  if (featuredBooks.value.length > 0) {
    autoplayInterval.value = setInterval(nextSlide, 10000); // 10 saniyede bir otomatik geçiş
  }
};

// Otomatik geçişi durdurma fonksiyonu
const stopAutoplay = () => {
  clearInterval(autoplayInterval.value);
};

const carouselStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: 'transform 0.8s ease-in-out'
}));

// Sayfa yüklendiğinde yapılacak işlemler
onMounted(() => {
  if (featuredBooks.value.length === 0) {
    errorMessage.value = "No featured books available."; 
  } else {
    startAutoplay(); 
  }
});

watch(featuredBooks, (newBooks) => {
  if (newBooks.length > 0) {
    errorMessage.value = ""; 
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style lang="scss">
@use "@/styles/carousel";
</style>