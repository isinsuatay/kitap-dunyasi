<template>
  <div class="profile-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul>
        <li
          :class="{ active: activeTab === 'info' }"
          @click="activeTab = 'info'"
        >
          Bilgilerim
        </li>
        <li
          :class="{ active: activeTab === 'favorites' }"
          @click="activeTab = 'favorites'"
        >
          Favorilerim
        </li>
        <li
          :class="{ active: activeTab === 'reviews' }"
          @click="activeTab = 'reviews'"
        >
          Yorumlarım
        </li>
        <li
          :class="{ active: activeTab === 'addedBooks' }"
          @click="activeTab = 'addedBooks'"
        >
          Eklediğim Kitaplar
        </li>
        <li
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
        >
          İstatistiklerim
        </li>
        <li class="logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Çıkış Yap
        </li>
      </ul>
    </aside>

    <!-- İçerik Alanı -->
    <div class="profile-content">
      <!-- Bilgilerim -->
      <div v-if="activeTab === 'info'" class="profile-card">
        <h3>Bilgilerim</h3>
        <p><strong>Ad:</strong> {{ user.firstName }} {{ user.lastName }}</p>
        <p>
          <strong>Doğum Tarihi:</strong> {{ user.birthdate || "Belirtilmemiş" }}
        </p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="openEditModal" class="edit-btn">Düzenle</button>
      </div>

      <!-- Modal -->
      <teleport to="body">
        <div v-if="isEditModalOpen" class="modal-overlay">
          <div class="modal">
            <h3>Bilgileri Düzenle</h3>
            <input v-model="editedUser.firstName" placeholder="Adınızı girin" />
            <input
              v-model="editedUser.lastName"
              placeholder="Soyadınızı girin"
            />
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
          <div
            v-for="review in userReviews"
            :key="review.id"
            class="review-item"
          >
            <p class="book-title">
              <strong>Kitap:</strong>
              <span
                :class="{
                  'missing-book':
                    getBookTitleById(review.bookId) === 'Bilinmeyen Kitap',
                }"
              >
                {{ getBookTitleById(review.bookId) }}
              </span>
            </p>
            <div class="review-header">
              <span class="review-user">{{ review.username }}</span>
              <span class="review-date">{{
                formatDate(review.createdAt)
              }}</span>
            </div>
            <p class="review-text">{{ review.text }}</p>
            <div class="review-rating" v-if="review.rating">
  <strong>Puan:</strong>
  <span v-for="i in Number(review.rating)" :key="i" class="star">★</span>
</div>
<div class="review-rating" v-else>
  <strong>Puan:</strong> Belirtilmemiş
</div>
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

      <!-- İstatistiklerim -->
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

const activeTab = ref("info");
const isEditModalOpen = ref(false);

const user = computed(() => store.getters["user/user"]);
const favorites = computed(() => store.getters["favorites/favorites"]);
const books = computed(() => store.state.books.books);

// Düzenleme için kullanıcı bilgisi
const editedUser = ref({
  firstName: "",
  lastName: "",
  birthdate: "",
  email: "",
});

const openEditModal = () => {
  editedUser.value = { ...user.value };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editedUser.value = { firstName: "", lastName: "", birthdate: "", email: "" };
};

const saveUserInfo = async () => {
  const updatedUser = { ...user.value, ...editedUser.value };
  await store.dispatch("user/updateUser", updatedUser);
  closeEditModal();
};

const userReviews = computed(() => {
  if (!user.value?.id) return [];
  return store.getters["reviews/getReviewsByUser"](user.value.id);
});

const userBooks = computed(() => {
  if (!user.value?.id) return [];
  return books.value.filter((book) => book.addedBy === user.value.id);
});

const logout = () => {
  store.dispatch("user/logout");
  router.push("/");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const getBookTitleById = (bookId) => {
  if (!bookId) {
    console.warn("Geçersiz kitap ID: bookId boş veya undefined");
    return "Bilinmeyen Kitap";
  }

  const book = books.value.find((b) => b.id === bookId);

  if (!book) {
    console.warn(`Kitap bulunamadı: ${bookId}`);
    return "Bilinmeyen Kitap";
  }

  return book.title;
};

onMounted(() => {
  store.dispatch("books/loadBooks");
  store.dispatch("reviews/loadReviews");
});
</script>

<style scoped lang="scss">
@use "@/styles/profile";
</style>
