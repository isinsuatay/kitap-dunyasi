export default {
    namespaced: true,
    state: {
      searchTerm: "",
    },
    mutations: {
      setSearchTerm(state, term) {
        state.searchTerm = term;
      },
    },
    getters: {
      filteredBooks: (state, getters, rootState) => {
        if (!state.searchTerm) return rootState.books.books;
        return rootState.books.books.filter((book) =>
          book.title.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      },
    },
  };