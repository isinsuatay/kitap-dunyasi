// store/modules/books.js
import {
  getBooksFromLocalStorage,
  saveBooksToLocalStorage,
  addBookToLocalStorage,
  updateBookInLocalStorage,
  deleteBookFromLocalStorage,
  initializeLocalStorage,
  getCategoriesFromLocalStorage,
} from "@/utils/localStorage";

const state = {
  books: [],
  categories: [],
  filteredBooks: [],
  favoriteBooks: [],
  featuredBooks: [],
  languages: [],
  loading: false,
  minPageCount: null,
  maxPageCount: null,
  viewMode: "grid",
  sortOption: "title",
};

const mutations = {
  setBooks(state, books) {
    state.books = books;
    state.filteredBooks = books; 
    // state.filteredBooks = [...books]; 
    state.featuredBooks = books.filter(book => book.featured);
    state.languages = [...new Set(books.map(book => book.language).filter(Boolean))];
    state.categories = [...new Set(books.map(book => book.category).filter(Boolean))];
    saveBooksToLocalStorage(books);
  },
  addBook(state, book) {
    state.books.push(book);
    state.filteredBooks = state.books;
    addBookToLocalStorage(book);
  },
  updateBook(state, updatedBook) {
    const index = state.books.findIndex((book) => book.id === updatedBook.id);
    if (index !== -1) {
      state.books[index] = updatedBook;
      state.filteredBooks = state.books;
      updateBookInLocalStorage(updatedBook);
    }
  },
  deleteBook(state, bookId) {
    state.books = state.books.filter((book) => book.id !== bookId);
    state.filteredBooks = state.books;
    deleteBookFromLocalStorage(bookId);
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setViewMode(state, mode) {
    state.viewMode = mode;
  },
  setSortOption(state, option) {
    state.sortOption = option;
  },
  toggleFavorite(state, bookId) {
    if (state.favoriteBooks.includes(bookId)) {
      state.favoriteBooks = state.favoriteBooks.filter((id) => id !== bookId);
    } else {
      state.favoriteBooks.push(bookId);
    }
    localStorage.setItem("favoriteBooks", JSON.stringify(state.favoriteBooks));
  },
  setFilteredBooks(state, filteredBooks) {
    state.filteredBooks = filteredBooks;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  setFreeBooks(state, freeBooks) {
    state.filteredBooks = freeBooks;
  },
  setFeaturedBooks(state, featuredBooks) {
    state.featuredBooks = featuredBooks;
  },
  setPageCountFilter(state, { min, max }) {
    state.minPageCount = min;
    state.maxPageCount = max;
  },
};

const actions = {
  async loadBooks({ commit }) {
    try {
      commit("setLoading", true);
      await initializeLocalStorage();
  
      const books = getBooksFromLocalStorage();
      if (!Array.isArray(books)) {
        console.error("LocalStorage'daki kitap verisi geçersiz:", books);
        commit("setBooks", []);
      } else {
        commit("setBooks", books);
      }
  
      const categories = getCategoriesFromLocalStorage();
      if (!Array.isArray(categories)) {
        console.error("Kategori verisi geçersiz:", categories);
        commit("setCategories", []);
      } else {
        commit("setCategories", categories);
      }
    } catch (error) {
      console.error("Kitapları yüklerken hata oluştu:", error);
    } finally {
      commit("setLoading", false);
    }
  },
  async loadFeaturedBooks({ commit }) {
    try {
      commit("setLoading", true);
      const books = getBooksFromLocalStorage();
      const featuredBooks = books.filter((book) => book.featured === true);
      
      commit("setFeaturedBooks", featuredBooks);
    } catch (error) {
      console.error("Öne çıkan kitapları yüklerken hata oluştu:", error);
    } finally {
      commit("setLoading", false);
    }
  },
  filterBooks({ state, commit }, filters) {
    let filtered = [...state.books];
  
    if (filters.isFree) {
      filtered = filtered.filter(book => book.price === 0);
    }
    if (filters.minPages !== null && filters.minPages !== undefined) {
      filtered = filtered.filter(book => book.pageCount >= filters.minPages);
    }
    if (filters.maxPages !== null && filters.maxPages !== undefined) {
      filtered = filtered.filter(book => book.pageCount <= filters.maxPages);
    }
    if (filters.category) {
      filtered = filtered.filter(book => book.category?.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.language) {
      filtered = filtered.filter(book => book.language?.toLowerCase() === filters.language.toLowerCase());
    }
  
    commit("setFilteredBooks", filtered);
  },
  searchBooks({ state, commit }, searchQuery) {
    const filtered = state.books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    commit("setFilteredBooks", filtered); 
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
  changeSortOption({ commit, state }, option) {
    commit("setSortOption", option);
    const sortedBooks = sortBooks(state.filteredBooks || state.books, option);
    commit("setFilteredBooks", sortedBooks);
  },
  toggleFavorite({ commit }, bookId) {
    commit("toggleFavorite", bookId);
  },
  getFreeBooks({ commit }) {
  const books = getBooksFromLocalStorage();
  const freeBooks = books.filter((book) => book.price === 0);
  commit("setFreeBooks", freeBooks);
},

};

const getters = {
  allCategories: (state) => state.categories || [],
  allLanguages: (state) => state.languages || [],
  loading: (state) => state.loading,
  viewMode: (state) => state.viewMode,
  allBooks: (state) => state.books,
  featuredBooks: (state) => state.featuredBooks || [],
  sortedBooks: (state) => sortBooks(state.filteredBooks || state.books, state.sortOption),
  isFavorite: (state) => (bookId) => state.favoriteBooks.includes(bookId),
  getBooksByUser: (state) => (userId) => state.books.filter((book) => book.addedBy === userId),
  filteredBooksByPageCount: (state) => {
    return state.filteredBooks.filter(book => {
      return (
        (state.minPageCount === null || book.pageCount >= state.minPageCount) &&
        (state.maxPageCount === null || book.pageCount <= state.maxPageCount)
      );
    });
  },
};

function sortBooks(books, sortOption) {
  return [...books].sort((a, b) => {
    if (sortOption === "name") return a.title.localeCompare(b.title);
    if (sortOption === "price_asc") return a.price - b.price;
    if (sortOption === "price_desc") return b.price - a.price;
    if (sortOption === "publicationDate_newest") return new Date(b.publicationDate) - new Date(a.publicationDate);
    if (sortOption === "publicationDate_oldest") return new Date(a.publicationDate) - new Date(b.publicationDate);
    return 0;
  });
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

