// store/modules/books.js
import {
  getBooksFromLocalStorage,
  saveBooksToLocalStorage,
  addBookToLocalStorage,
  updateBookInLocalStorage,
  deleteBookFromLocalStorage,
  initializeLocalStorage,
} from "@/utils/localStorage";

import { applyFilters } from "@/utils/filters";
import { sortBooks } from "@/utils/sort";
import { debounce } from "lodash";

const state = {
  books: [],
  categories: [],
  languages: [],
  filteredBooks: [],
  favoriteBooks: [],
  featuredBooks: [],
  loading: false,
  searchQuery: null,
  viewMode: "grid", 
  filters: {
    category: "",
    language: "",
    sortOption: "title",
    minPages: 0,
    maxPages: Infinity,
    isFree: false, 
  },
};


// const saveFavoritesDebounced = debounce((favorites) => {
//   localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
// }, 300);

const mutations = {
  setBooks(state, books) {
    state.books = books;
    state.filteredBooks = [...books];
    state.featuredBooks = books.filter(book => book.featured);
  
    const newCategories = new Set();
    const newLanguages = new Set();
  
    books.forEach(book => {
      if (book.category) newCategories.add(book.category);
      if (book.language) newLanguages.add(book.language);
    });
  
    state.categories = [...newCategories];
    state.languages = [...newLanguages];
  
    saveBooksToLocalStorage(books);
  },
  addBook(state, book) {
    state.books.push(book);
    if (book.featured) state.featuredBooks.push(book);
  
    if (book.category && !state.categories.includes(book.category)) {
      state.categories.push(book.category);
    }
    if (book.language && !state.languages.includes(book.language)) {
      state.languages.push(book.language);
    }
  
    addBookToLocalStorage(book);
  },
  updateBook(state, updatedBook) {
    const index = state.books.findIndex((book) => book.id === updatedBook.id);
    if (index !== -1) {
      Object.assign(state.books[index], updatedBook);
      updateBookInLocalStorage(updatedBook);
    }
  },
  deleteBook(state, bookId) {
    const bookToDelete = state.books.find(book => book.id === bookId);
    state.books = state.books.filter(book => book.id !== bookId);
    state.featuredBooks = state.featuredBooks.filter(book => book.id !== bookId);
  
    if (bookToDelete) {
      const hasOtherBooksInCategory = state.books.some(book => book.category === bookToDelete.category);
      if (!hasOtherBooksInCategory) {
        state.categories = state.categories.filter(category => category !== bookToDelete.category);
      }
  
      const hasOtherBooksInLanguage = state.books.some(book => book.language === bookToDelete.language);
      if (!hasOtherBooksInLanguage) {
        state.languages = state.languages.filter(language => language !== bookToDelete.language);
      }
    }
  
    deleteBookFromLocalStorage(bookId);
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setFilters(state, filters) {
    state.filters = { ...filters }; 
    localStorage.setItem("filters", JSON.stringify(state.filters)); 
  },
  setViewMode(state, mode) {
    state.viewMode = mode;
  },
  setSortOption(state, option) {
    state.sortOption = option;
  },
  setFavoriteBooks(state, favoriteBooks) {
    state.favoriteBooks = favoriteBooks;
  },
  setFilteredBooks(state, filteredBooks) {
    state.filteredBooks = filteredBooks;
  },
  setFeaturedBooks(state, featuredBooks) {
    state.featuredBooks = featuredBooks;
  },
  setSearchQuery(state, query) {
    state.searchQuery = query;
  },
};

const actions = {
  async loadBooks({ commit }) {
    try {
      commit("setLoading", true);
      await initializeLocalStorage();
      const books = getBooksFromLocalStorage();
      const favoriteBooks = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
      const savedFilters = JSON.parse(localStorage.getItem("filters")); 
  
      commit("setBooks", Array.isArray(books) ? books : []);
      commit("setFavoriteBooks", favoriteBooks);
  
      if (savedFilters) {
        commit("setFilters", savedFilters);
      } else {
        commit("setFilters", {
          category: "",
          language: "",
          sortOption: "title",
          minPages: 0,
          maxPages: Infinity,
          isFree: false,
        });
      }
    } catch (error) {
      console.error("Kitapları yüklerken hata oluştu:", error);
    } finally {
      commit("setLoading", false);
    }
  },
  async searchBooks({ commit, state }, searchQuery) {
    commit("setSearchQuery", searchQuery);
    
    const filteredBooks = applyFilters(state.books, { 
      ...state.filters, 
      searchQuery 
    });
    
    commit("setFilteredBooks", filteredBooks);
  },
  toggleFavorite({ state, commit }, bookId) {
    const updatedFavorites = new Set(state.favoriteBooks);
    updatedFavorites.has(bookId) ? updatedFavorites.delete(bookId) : updatedFavorites.add(bookId);
    commit("setFavoriteBooks", [...updatedFavorites]);
    // saveFavoritesDebounced([...updatedFavorites]);
  },
  filterBooks({ state, commit }, filters) {
    const newFilters = { ...state.filters, ...filters }; 
    commit("setFilters", newFilters);
    
    const filteredBooks = applyFilters(state.books, newFilters);
    const sortedBooks = sortBooks(filteredBooks, state.sortOption); 
    commit("setFilteredBooks", sortedBooks);
  },

  changeSortOption({ commit, state }, option) {
    commit("setSortOption", option);
    const sortedBooks = sortBooks(state.filteredBooks || state.books, option);
    commit("setFilteredBooks", sortedBooks);
  },
  addBook({ commit, rootState }, book) {
    commit("addBook", { ...book, addedBy: rootState.user?.id });
  },
  updateBook({ commit }, book) {
    commit("updateBook", book);
  },
  deleteBook({ commit }, bookId) {
    commit("deleteBook", bookId);
  },
  changeViewMode({ commit }, mode) {
    commit("setViewMode", mode);
  },
};

const getters = {
  allCategories: (state) => state.categories || [],
  allLanguages: (state) => state.languages || [],
  loading: (state) => state.loading,
  viewMode: (state) => state.viewMode,
  allBooks: (state) => state.books,
  featuredBooks: (state) => state.featuredBooks || [],
  sortedBooks: (state) => computed(() => sortBooks(state.filteredBooks || state.books, state.sortOption)),
  isFavorite: (state) => (bookId) => state.favoriteBooks.includes(bookId),
  getBooksByUser: (state) => (userId) => state.books.filter((book) => book.addedBy === userId),
};


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

