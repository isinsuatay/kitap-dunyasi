<template>
  <div class="review-section">
    <h3 class="review-title">Değerlendirmeler ({{ reviews.length }})</h3>
    <div v-if="reviews.length" class="reviews-list">
  <div v-for="review in reviews" :key="review.id" class="review-item">
    <div class="review-header">
      <span class="review-user">{{ review.username || 'Bilinmeyen Kullanıcı' }}</span>
      <span class="review-date">{{ formatDate(review.createdAt) }}</span>
      
    </div>

    <!-- Yorumun yanında yıldızlı puan göster -->
    <div class="review-rating">
  <strong>Puan:</strong> 
  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
</div>

    <!-- Düzenleme kısmı -->
    <div v-if="editingReview === review.id">
      <textarea v-model="updatedReviewText" class="edit-textarea"></textarea>
      <div class="rating">
        <label>Puan:</label>
        <select v-model="updatedReviewRating">
          <option v-for="i in 5" :key="i" :value="i">{{ i }} Yıldız</option>
        </select>
      </div>
      <button @click="saveEdit(review)" class="save-btn">Kaydet</button>
      <button @click="editingReview = null" class="cancel-btn">İptal</button>
    </div>

    <!-- Düzenleme ve silme butonları -->
    <div v-else>
      <p class="review-text">{{ review.text }}</p>
      <button v-if="review.userId === userId" @click="startEditing(review)" class="edit-btn">Düzenle</button>
      <button v-if="review.userId === userId" @click="deleteReview(review.id)" class="delete-btn">Sil</button>
    </div>
  </div>
</div>

    <div class="review-input">
      <textarea v-model="newReview.text" placeholder="Değerlendirmenizi yazın..." class="review-textarea"></textarea>
      <div class="rating">
        <label for="rating">Puan:</label>
        <select v-model="newReview.rating">
          <option v-for="i in 5" :key="i" :value="i">{{ i }} Yıldız</option>
        </select>
      </div>
      <button @click="submitReview" class="submit-btn":disabled="!newReview.text.trim() || !newReview.rating">Değerlendir</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const store = useStore();
const router = useRouter();

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
});
const reviews = computed(() => store.getters["reviews/getReviewsByBook"](String(props.bookId)));

// Yorum alanı
const newReview = ref({
  text: '',
  rating: 5,
});

// Giriş yapan kullanıcı bilgisi
const user = computed(() => store.getters["user/user"]);
const userId = computed(() => user.value?.id || null);
const username = computed(() => user.value?.username || `${user.value?.firstName || ''} ${user.value?.lastName || ''}`.trim());

const submitReview = () => {
  if (!user.value) {
    Swal.fire({
      title: 'Giriş Yapın',
      text: 'Yorum yapabilmek için giriş yapmalısınız.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Giriş Yap',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/auth');
      }
    });
    return;
  }

  store.commit('reviews/ADD_REVIEW', {
    bookId: props.bookId,
    text: newReview.value.text,
    userId: userId.value,
    username: username.value,
    rating: newReview.value.rating,
  });

  newReview.value.text = '';
  newReview.value.rating = 5;
};

const deleteReview = (reviewId) => {
  if (!user.value) {
    Swal.fire("Hata!", "Yorum silmek için giriş yapmalısınız.", "error");
    return;
  }

  store.commit("reviews/DELETE_REVIEW", {
    bookId: props.bookId,
    reviewId,
    userId: userId.value,
  });

  Swal.fire("Başarılı!", "Yorum silindi.", "success");
};

// Yorum düzenleme
const editingReview = ref(null);
const updatedReviewText = ref('');
const updatedReviewRating = ref(5);

const startEditing = (review) => {
  editingReview.value = review.id;
  updatedReviewText.value = review.text;
  updatedReviewRating.value = review.rating;
};

const saveEdit = (review) => {
  store.commit('reviews/UPDATE_REVIEW', {
    bookId: props.bookId,
    reviewId: review.id,
    updatedText: updatedReviewText.value,
    updatedRating: updatedReviewRating.value,
  });

  editingReview.value = null;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

<style lang="scss">
@use "@/styles/reviews";

</style>