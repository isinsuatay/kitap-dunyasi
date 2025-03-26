import { v4 as uuidv4 } from 'uuid';

export default {
  namespaced: true,
  state: {
    reviews: JSON.parse(localStorage.getItem("reviews")) || {},
  },
  mutations: {
    ADD_REVIEW(state, { bookId, userId, username, text, rating }) {
      if (!userId || !username) {
        console.error("Kullanıcı bilgileri eksik! Yorum eklenemedi.");
        return;
      }

      const review = {
        id: uuidv4(),
        userId,
        username,
        text,
        rating,
        createdAt: new Date().toISOString(),
      };

      if (!state.reviews[bookId]) {
        state.reviews[bookId] = [];
      }

      state.reviews[bookId].push(review);
      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    },

    DELETE_REVIEW(state, { bookId, reviewId, userId }) {
      if (!state.reviews[bookId]) return;
    
      // Yorumu kaldır
      state.reviews[bookId] = state.reviews[bookId].filter((review) => review.id !== reviewId);
    
      if (state.reviews[bookId].length === 0) {
        delete state.reviews[bookId];
      }
    
      state.reviews = { ...state.reviews };
    
      // LocalStorage güncelle
      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    },

    UPDATE_REVIEW(state, { bookId, reviewId, updatedText, updatedRating }) {
      if (!state.reviews[bookId]) return;

      const reviewIndex = state.reviews[bookId].findIndex(r => r.id === reviewId);
      if (reviewIndex === -1) return;

      state.reviews[bookId][reviewIndex] = {
        ...state.reviews[bookId][reviewIndex],
        text: updatedText,
        rating: updatedRating,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    }
  },
  getters: {
    // Kullanıcıya ait yorumları döndürür
    getReviewsByUser: (state) => (userId) => {
      const reviews = [];
      for (const bookId in state.reviews) {
        if (state.reviews[bookId]) {
          reviews.push(...state.reviews[bookId].filter(review => review.userId === userId));
        }
      }
      return reviews;
    },
    // Bu getter, bookId'ye göre yorumları döndürür
    getReviewsByBook: (state) => (bookId) => state.reviews[bookId] || [],
  },
  actions: {
    addReview({ commit }, payload) {
      commit("ADD_REVIEW", payload);
    },
    deleteReview({ commit }, payload) {
      commit("DELETE_REVIEW", payload);
    },
    updateReview({ commit }, payload) {
      commit("UPDATE_REVIEW", payload);
    }
  }
};