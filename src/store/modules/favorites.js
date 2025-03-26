export default {
  namespaced: true,
  state: {
    favorites: (() => {
      const data = localStorage.getItem("favorites");
      return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : [];
    })(),
  },
  mutations: {
    ADD_FAVORITE(state, book) {
      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }
      if (!state.favorites.find((fav) => String(fav.id) === String(book.id))) {
        state.favorites.push(book);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },
    REMOVE_FAVORITE(state, bookId) {
      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }
      state.favorites = state.favorites.filter((book) => String(book.id) !== String(bookId));
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    SET_FAVORITES(state, books) {
      state.favorites = Array.isArray(books) ? books : [];
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  actions: {
    addFavorite({ commit }, book) {
      commit("ADD_FAVORITE", book);
    },
    removeFavorite({ commit }, bookId) {
      commit("REMOVE_FAVORITE", bookId);
    },
    loadFavorites({ commit }) {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
      commit("SET_FAVORITES", Array.isArray(storedFavorites) ? storedFavorites : []);
    },
  },
  getters: {
    favorites: (state) => (Array.isArray(state.favorites) ? state.favorites : []),
    isFavorite: (state) => (bookId) => 
      Array.isArray(state.favorites) && state.favorites.some((book) => String(book.id) === String(bookId)),
  },
};