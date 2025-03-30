									<template>
  <div class="profile-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul>
        <li :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">Bilgilerim</li>
        <li :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">Favorilerim</li>
        <li :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">Yorumlarım</li>
        <li :class="{ active: activeTab === 'addedBooks' }" @click="activeTab = 'addedBooks'">Eklediğim Kitaplar</li>
        <li :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">İstatistiklerim</li>
        <li class="logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Çıkış Yap
        </li>
      </ul>
    </aside>

    <!-- İçerik Alanı -->
    <div class="profile-content">
    <!-- Kullanıcı Bilgileri Alanı -->
<div v-if="activeTab === 'info'" class="profile-card">
  <h3>Bilgilerim</h3>
  <p><strong>Ad:</strong> {{ user.firstName }} {{ user.lastName }}</p>
  <p><strong>Doğum Tarihi:</strong> {{ user.birthdate || "Belirtilmemiş" }}</p>
  <p><strong>Email:</strong> {{ user.email }}</p>
  <button @click="openEditModal" class="edit-btn">Düzenle</button>
</div>

<!-- Popup (Modal) -->
<teleport to="body">
  <div v-if="isEditModalOpen" class="modal-overlay">
    <div class="modal">
      <h3>Bilgileri Düzenle</h3>
      <input v-model="editedUser.firstName" placeholder="Adınızı girin" />
      <input v-model="editedUser.lastName" placeholder="Soyadınızı girin" />
      <input v-model="editedUser.birthdate" type="date" />
      <input v-model="editedUser.email" type="email" disabled />

      <button @click="saveUserInfo" class="save-btn">Kaydet</button>
      <button @click="closeEditModal" class="cancel-btn">İptal</button>
    </div>
  </div>
</teleport>
      <!-- Favorilerim -->
      <div v-if="activeTab === 'favorites'" class="profile-card">
        <h3>Favorilerim</h3>
        <div v-if="favorites.length === 0">
          <p>Henüz favorilere eklenen kitap yok!</p>
        </div>
        <div v-else class="favorites-grid">
          <BookCard v-for="book in favorites" :key="book.id" :book="book" />
        </div>
      </div>

      <!-- Yorumlarım -->
      <div v-if="activeTab === 'reviews'" class="profile-card">
        <h3>Yorumlarım</h3>
        <div v-if="userReviews.length === 0">
          <p>Henüz yorum yapılmamış!</p>
        </div>
        <div v-else>
          <div v-for="review in userReviews" :key="review.id" class="review-item">
            <div class="review-header">
              <span class="review-user">{{ review.username }}</span>
              <span class="review-date">{{ formatDate(review.createdAt) }}</span>
            </div>
            <p class="review-text">{{ review.text }}</p>
            <div class="review-rating">
              <strong>Puan:</strong> 
              <span v-for="i in review.rating" :key="i" class="star">★</span>
            </div>
            <button v-if="review.userId === user.id" @click="deleteReview(review.id)" class="delete-btn">Sil</button>
            <button v-if="review.userId === user.id" @click="startEditingReview(review)" class="edit-btn">Düzenle</button>
          </div>
        </div>
      </div>

      <!-- Eklediğim Kitaplar -->
      <div v-if="activeTab === 'addedBooks'" class="profile-card">
        <h3>Eklediğim Kitaplar</h3>
        <div v-if="userBooks.length === 0">
          <p>Henüz eklediğiniz bir kitap yok!</p>
        </div>
        <div v-else class="added-books-grid">
          <BookCard v-for="book in userBooks" :key="book.id" :book="book" />
        </div>
      </div>

      <!-- Kullanıcı İstatistikleri -->
      <div v-if="activeTab === 'stats'" class="profile-card">
        <h3>Kullanıcı İstatistikleri</h3>
        <p><strong>Toplam Favori Kitaplar:</strong> {{ favorites.length }}</p>
        <p><strong>Eklenen Kitaplar:</strong> {{ userBooks.length }}</p>
        <p><strong>Yapılan Yorumlar:</strong> {{ userReviews.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import BookCard from "@/components/BookCard.vue";

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters.user || {});
const activeTab = ref("info");
const isEditModalOpen = ref(false);
const editedUser = ref({ ...user.value });

const openEditModal = () => {
  editedUser.value = { ...user.value };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const saveUserInfo = () => {
  store.dispatch("updateUser", editedUser.value).then(() => {
    localStorage.setItem("user", JSON.stringify(editedUser.value));
    closeEditModal();
  });
};


// Favoriler
const favorites = computed(() => store.getters["favorites/favorites"]);
onMounted(() => {
  store.dispatch("favorites/loadFavorites");
});

// Kullanıcının yorumları
const userReviews = computed(() => {
  return store.getters["reviews/getReviewsByUser"](user.value.email); 
});

// Kullanıcının eklediği kitaplar
const userBooks = computed(() => store.getters["books/getBooksByUser"](user.value.id));
onMounted(() => {
  store.dispatch("books/loadBooks");
});

// Yorum Silme
const deleteReview = (reviewId) => {
  store.dispatch("reviews/deleteReview", { bookId: reviewId, reviewId, userId: user.value.id });
};

const logout = () => {
  store.dispatch("logout");
  localStorage.removeItem("user");
  router.push("/");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" });
};
</script>

<style scoped lang="scss">
@use "@/styles/profile";

</style> 