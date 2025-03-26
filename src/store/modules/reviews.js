import { v4 as uuidv4 } from 'uuid';
import { toRaw } from 'vue'; // Proxy nesnesini düz nesneye çevirmek için gerekli

export default {
  namespaced: true,
  state: {
    reviews: JSON.parse(localStorage.getItem("reviews")) || {},
  },
  mutations: {
    ADD_REVIEW(state, payload) {
      const rawPayload = toRaw(payload); // Proxy nesnesini düz nesneye çevir
      const { bookId, userId, username, text, rating } = rawPayload;
  
      if (!userId || !username) {
        console.error("Kullanıcı bilgileri eksik! Yorum eklenemedi.", rawPayload);
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
  
      state.reviews[bookId] = [...state.reviews[bookId], review];
  
      // Reaktiviteyi korumak için state'i yeniden atıyoruz
      state.reviews = { ...state.reviews };

      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    },

    DELETE_REVIEW(state, { bookId, reviewId }) {
      if (!state.reviews[bookId]) return;

      state.reviews[bookId] = state.reviews[bookId].filter(r => r.id !== reviewId);

      if (state.reviews[bookId].length === 0) {
        delete state.reviews[bookId];
      }

      // Reaktiviteyi korumak için state'i yeniden atıyoruz
      state.reviews = { ...state.reviews };

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

      // Reaktiviteyi korumak için state'i yeniden atıyoruz
      state.reviews = { ...state.reviews };

      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    }
  },
  getters: {
    getReviewsByBook: (state) => (bookId) => state.reviews[bookId] || [],

    userComments: (state) => (userId) => {
      if (!userId) return [];

      const userReviews = [];
      Object.entries(state.reviews).forEach(([bookId, reviews]) => {
        reviews.forEach(review => {
          if (review.userId === userId) {
            userReviews.push({ ...review, bookId });
          }
        });
      });
      return userReviews;
    }
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