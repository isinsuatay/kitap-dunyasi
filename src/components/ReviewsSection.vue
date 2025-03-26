<template>
  <div class="review-section">
    <h3 class="review-title">Değerlendirmeler</h3>

    <div v-if="reviews.length" class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <span class="review-user">{{ review.username || 'Bilinmeyen Kullanıcı' }}</span>
          <span class="review-date">{{ formatDate(review.createdAt) }}</span>
        </div>
        <p class="review-text">{{ review.text }}</p>
        <button @click="deleteReview(review.id)" class="delete-btn">Sil</button>
      </div>
    </div>
    
    <div v-else class="no-reviews">
      <p>Henüz değerlendirme yapılmamış.</p>
    </div>

    <div class="review-input">
      <textarea v-model="newReview.text" placeholder="Değerlendirmenizi yazın..." class="review-textarea"></textarea>
      <div class="rating">
        <label for="rating">Puan:</label>
        <select v-model="newReview.rating">
          <option v-for="i in 5" :key="i" :value="i">{{ i }} Yıldız</option>
        </select>
      </div>
      <button @click="submitReview" class="submit-btn" :disabled="!newReview.text.trim()">Değerlendir</button>
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
  bookId: String,
});

const reviews = computed(() => store.getters["reviews/getReviewsByBook"](props.bookId));
const newReview = ref({
  text: '',
  rating: 5,
});

const submitReview = () => {
  const isAuthenticated = store.state.user && store.state.user.user;
  if (!isAuthenticated) {
    Swal.fire({
      title: 'Giriş Yapın',
      text: 'Yorum yapabilmek için öncelikle giriş yapmanız gerekiyor.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Kayıt Ol',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/auth');
      }
    });
    return;
  }

const user = store.state.user.user;  
  if (!user || !user.id || !user.username) {
    console.error("Kullanıcı bilgileri eksik:", user);
    return;
  }

  store.commit('reviews/ADD_REVIEW', { 
    bookId: props.bookId, 
    text: newReview.value.text,
    userId: user.id,
    username: user.username,  // Burada kullanıcı adı eksik olabilir, kontrol ettik.
    rating: newReview.value.rating
  });

  newReview.value.text = '';
  newReview.value.rating = 5;
};

const deleteReview = (reviewId) => {
  store.commit('reviews/DELETE_REVIEW', { bookId: props.bookId, reviewId });
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



<style scoped>
.review-section {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.review-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.reviews-list {
  margin-bottom: 20px;
}

.review-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-user {
  font-weight: bold;
  font-size: 1rem;
}

.review-date {
  font-size: 0.9rem;
  color: #777;
}

.review-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
}

.delete-btn {
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;
}

.delete-btn:hover {
  background-color: #e60000;
}

.no-reviews {
  text-align: center;
  font-size: 1.1rem;
  color: #555;
}

.review-input {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  resize: none;
}

.submit-btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-btn:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .review-section {
    padding: 15px;
  }

  .review-title {
    font-size: 1.3rem;
  }

  .review-item {
    padding: 10px;
  }

  .review-user {
    font-size: 0.9rem;
  }

  .review-text {
    font-size: 0.95rem;
  }

  .submit-btn {
    font-size: 0.9rem;
  }
}
</style>