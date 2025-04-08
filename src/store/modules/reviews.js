import { v4 as uuidv4 } from "uuid";

export default {
  namespaced: true,

  state: {
    reviews: JSON.parse(localStorage.getItem("reviews")) || {},
  },

  mutations: {
    ADD_REVIEW(state, { bookId, userId, username, text, rating }) {
      if (!userId || typeof userId !== "string" || !username) {
        console.error("Geçersiz kullanıcı bilgileri! Yorum eklenemedi.");
        return;
      }
    
      const review = {
        id: uuidv4(),
        bookId, 
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

      const review = state.reviews[bookId].find((r) => r.id === reviewId);
      if (!review) return;

      if (review.userId !== userId) {
        console.warn("Bu yorumu silme yetkiniz yok.");
        return;
      }

      state.reviews[bookId] = state.reviews[bookId].filter((r) => r.id !== reviewId);

      if (state.reviews[bookId].length === 0) {
        delete state.reviews[bookId];
      }

      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    },

    UPDATE_REVIEW(state, { bookId, reviewId, updatedText, updatedRating }) {
      if (!state.reviews[bookId]) return;

      const reviewIndex = state.reviews[bookId].findIndex((r) => r.id === reviewId);
      if (reviewIndex === -1) return;

      state.reviews[bookId][reviewIndex] = {
        ...state.reviews[bookId][reviewIndex],
        text: updatedText,
        rating: updatedRating,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("reviews", JSON.stringify(state.reviews));
    },

    SET_REVIEWS(state, reviews) {
      state.reviews = reviews;
    },
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
    },
    loadReviews({ commit }) {
      const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};
      commit("SET_REVIEWS", storedReviews);
    },
  },

  getters: {
    getReviewsByBook: (state) => (bookId) => {
      return state.reviews[bookId] || [];
    },

    getReviewsByUser: (state) => (userId) => {
      if (!userId) return [];
      return Object.values(state.reviews)
        .flat()
        .filter((review) => review.userId?.toString() === userId.toString());
    },
  },
};

