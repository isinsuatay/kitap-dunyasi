<template>
  <div class="profile-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <ul>
        <li :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">Bilgilerim</li>
        <li :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">Favorilerim</li>
        <li :class="{ active: activeTab === 'addedBooks' }" @click="activeTab = 'addedBooks'">Eklediğim Kitaplar</li>
        <li :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">Yorumlarım</li>
        <li class="logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i> Çıkış Yap
        </li>
      </ul>
    </aside>

    <!-- İçerik Alanı -->
    <div class="profile-content">
      <!-- Kullanıcı Bilgileri -->
      <div v-if="activeTab === 'info'" class="profile-card">
        <div v-if="!isEditing">
          <h3>{{ user.name }} {{ user.surname }}</h3>
          <p><strong>E-posta:</strong> {{ user.email }}</p>
          <p><strong>Doğum Tarihi:</strong> {{ user.birthDate || 'Belirtilmemiş' }}</p>
          <button class="edit-btn" @click="startEditing">
            <i class="fas fa-edit"></i> Düzenle
          </button>
        </div>

        <div v-else>
          <input v-model="editableName" placeholder="Ad" />
          <input v-model="editableSurname" placeholder="Soyad" />
          <input type="date" v-model="editableBirthDate" />
          <button class="save-btn" @click="saveProfile">Kaydet</button>
          <button class="cancel-btn" @click="cancelEditing">İptal</button>
        </div>
      </div>

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

      <!-- Eklediğim Kitaplar -->
      <div v-if="activeTab === 'addedBooks'" class="profile-card">
        <h3>Eklediğim Kitaplar</h3>
        <ul>
          <li v-for="book in addedBooks" :key="book.id">{{ book.title }}</li>
        </ul>
      </div>

      <!-- Yorumlarım -->
      <div v-if="activeTab === 'comments'" class="profile-card">
        <h3>Yorumlarım</h3>
        <div v-if="userComments.length === 0">
          <p>Henüz yorum yapılmamış!</p>
        </div>
        <div v-else>
          <ul class="comments-list">
            <li v-for="comment in userComments" :key="comment.id">
              <strong>{{ getBookTitle(comment.bookId) }}:</strong>
              <p>{{ comment.text }}</p>
              <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              <button class="delete-btn" @click="deleteComment(comment.bookId, comment.id)">Sil</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import BookCard from "@/components/BookCard.vue";

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters.user || {});
const activeTab = ref("info");

const isEditing = ref(false);
const editableName = ref("");
const editableSurname = ref("");
const editableBirthDate = ref("");

// Favoriler
const favorites = computed(() => store.getters["favorites/favorites"]);
onMounted(() => {
  store.dispatch("favorites/loadFavorites");
});

// Eklenen kitaplar
const addedBooks = computed(() => store.state.books?.addedBooks || []);

// Kullanıcının yaptığı yorumları al
const userComments = computed(() => {
  return store.getters["reviews/userComments"](user.value.id)?.map(comment => ({
    ...comment,
    isEditing: false,
    editText: comment.text
  })) || [];
});

// Kitap başlığını almak için
// Kitap başlığını almak için
const getBookTitle = (bookId) => {
  const books = store.getters["books/allBooks"] || [];
  const book = books.find((b) => b.id === bookId);
  
  if (!book) {
    console.warn(`Kitap bulunamadı! bookId: ${bookId}`);
  }
  
  return book ? book.title : "Bilinmeyen Kitap";
};

// Yorumu düzenleme işlemi
const editComment = (comment) => {
  comment.isEditing = true;
};

// Yorumu kaydetme işlemi
const saveComment = (comment) => {
  store.dispatch("reviews/updateReview", {
    bookId: comment.bookId,
    reviewId: comment.id,
    updatedText: comment.editText,
    updatedRating: comment.rating
  });

  comment.text = comment.editText;
  comment.isEditing = false;

  Swal.fire({
    icon: "success",
    title: "Yorum başarıyla güncellendi!",
    showConfirmButton: false,
    timer: 1500
  });
};

// Yorumu silme işlemi
const deleteComment = (bookId, reviewId) => {
  Swal.fire({
    title: "Yorumu silmek istediğinizden emin misiniz?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "İptal"
  }).then((result) => {
    if (result.isConfirmed) {
      store.dispatch("reviews/deleteReview", { bookId, reviewId });
      
      Swal.fire({
        icon: "success",
        title: "Yorum başarıyla silindi!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
};

const saveProfile = async () => {
  try {
    await store.dispatch("user/updateUser", {
      name: editableName.value,
      surname: editableSurname.value,
      birthDate: editableBirthDate.value
    });
    isEditing.value = false;
    Swal.fire({
      icon: "success",
      title: "Profil başarıyla güncellendi!",
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error("Profil güncellenemedi: ", error);
    Swal.fire({
      icon: "error",
      title: "Bir şeyler yanlış gitti!",
      text: "Lütfen tekrar deneyin.",
      showConfirmButton: true
    });
  }
};

const cancelEditing = () => {
  isEditing.value = false;
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