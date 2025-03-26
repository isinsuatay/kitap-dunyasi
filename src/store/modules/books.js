// store/modules/books.js
import {
  getBooksFromLocalStorage,
  saveBooksToLocalStorage,
  addBookToLocalStorage,
  updateBookInLocalStorage,
  deleteBookFromLocalStorage,
  initializeLocalStorage,
  getCategoriesFromLocalStorage
} from "@/utils/localStorage";

const state = {
  books: [],
  categories: [],
  filteredBooks: [], 
  featuredBooks: [],
  favoriteBooks: [],
  languages: [],
  loading: false,
  viewMode: "grid",
  sortOption: "name",
  addedBooks: [],
  userAddedBooks: [],
};

const mutations = {
  setBooks(state, books) {
    state.books = books;
    state.filteredBooks = books;
    state.featuredBooks = books.filter(book => book.featured);
    const languages = [...new Set(books.map(book => book.language))];
    state.languages = languages;
  
    // Kategorileri localStorage'a kaydediyoruz
    const categories = [...new Set(books.map(book => book.category))];
    state.categories = categories;
    saveBooksToLocalStorage(books);
    localStorage.setItem('categories', JSON.stringify(categories)); // Kategoriler localStorage'a kaydediliyor
  },
  setLanguages(state, languages) {
    state.languages = languages;
  },
  setFilteredBooks(state, books) {
    state.filteredBooks = books; // Filtreleme sonucunu güncelle
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  addBook(state, book) {
    state.books.push(book);
    state.filteredBooks = state.books; // Güncellenmiş listeyi göster
    saveBooksToLocalStorage(state.books);
    addBookToLocalStorage(book);
  },
  updateBook(state, updatedBook) {
    const index = state.books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      state.books[index] = updatedBook;
      state.filteredBooks = state.books;
      saveBooksToLocalStorage(state.books);
      updateBookInLocalStorage(updatedBook);
    }
  },
  deleteBook(state, bookId) {
    state.books = state.books.filter(book => book.id !== bookId);
    state.filteredBooks = state.books;
    saveBooksToLocalStorage(state.books);
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
  setFilteredBooks(state, books) {
    state.filteredBooks = books;
  },
  addBookToAddedBooks(state, book) {
    if (!state.addedBooks.some(b => b.id === book.id)) {
      state.addedBooks.push(book);
    }
  },
  setUserAddedBooks(state, books) {
    state.userAddedBooks = books;
  },
  addFavorite(state, bookId) {
    if (!state.favoriteBooks.includes(bookId)) {
      state.favoriteBooks.push(bookId);
    }
  },
  removeFavorite(state, bookId) {
    state.favoriteBooks = state.favoriteBooks.filter(id => id !== bookId);
  },
};

const actions = {
  async loadUserAddedBooks({ commit, rootState }) {
    try {
      const response = await fetch(`/api/books?userId=${rootState.user.id}`);
      const data = await response.json();
      commit("setUserAddedBooks", data);
    } catch (error) {
      console.error("Kitaplar yüklenirken hata oluştu:", error);
    }
  },
  async loadBooks({ commit }) {
    commit("setLoading", true);
    await initializeLocalStorage();
    const books = getBooksFromLocalStorage();
    const categories = getCategoriesFromLocalStorage(); 
    console.log(categories); 
    commit("setBooks", books);
    commit("setCategories", categories); 
    commit("setLoading", false);
  },
  filterBooks({ state, commit }, { category, language, minPrice, maxPrice, isFree }) {
    let filtered = [...state.books];

    if (category) {
      filtered = filtered.filter(book => book.category === category);
    }
    if (language) {
      filtered = filtered.filter(book => book.language === language);
    }
    if (minPrice !== null) {
      filtered = filtered.filter(book => book.price >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter(book => book.price <= maxPrice);
    }
    if (isFree) {
      filtered = filtered.filter(book => book.price === 0);
    }

    commit("setFilteredBooks", filtered);
  },

  searchBooks({ state, commit }, searchQuery) {
    if (!state.books || !Array.isArray(state.books)) {
      console.error(" Hata: books dizisi tanımlı değil!");
      return;
    }

    const filtered = state.books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    commit("setFilteredBooks", filtered);
  },
  addBook({ commit, rootState }, book) {
    const newBook = {
      ...book,
      addedBy: rootState.user?.id, // Kullanıcı ID’sini eklediğimizden emin ol
    };
    commit("ADD_BOOK", newBook);
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
    commit("setFilteredBooks", sortBooks(state.filteredBooks || state.books, option));
  },
  toggleFavorite({ commit, state }, bookId) {
    if (state.favoriteBooks.includes(bookId)) {
      commit("removeFavorite", bookId);  // Eğer kitap favorilerde varsa, çıkar
    } else {
      commit("addFavorite", bookId);     // Eğer kitap favorilerde yoksa, ekle
    }
  },
  changeCurrency({ state, commit }, currency) {
    const exchangeRates = {
      "TRY": 1,
      "USD": 0.032,
      "EUR": 0.029
    };

    if (!exchangeRates[currency]) {
      console.error("Geçersiz para birimi seçildi!");
      return;
    }

    const conversionRate = exchangeRates[currency];
    const updatedBooks = state.books.map(book => ({
      ...book,
      convertedPrice: (book.price * conversionRate).toFixed(2),
      currency: currency
    }));

    commit("setBooks", updatedBooks);
  }
};

const getters = {
  allCategories: (state) => state.categories || [],
  allLanguages: (state) => state.languages || [],
  loading: (state) => state.loading,
  viewMode: (state) => state.viewMode,
  addedBooks: (state) => state.addedBooks || [],
  allBooks: (state) => state.books,
  userAddedBooks: (state, _, rootState) => {
    return state.books.filter((book) => book.userId === rootState.user.id);
  },
  sortedBooks: (state) => {
    const books = state.filteredBooks.length ? state.filteredBooks : state.books;
    return sortBooks(books || [], state.sortOption);
  },

  booksByCategory: (state) => {
    return (state.categories || []).reduce((acc, category) => {
      acc[category] = (state.books || []).filter((book) => book.category === category);
      return acc;
    }, {});
  },

  userAddedBooks: (state, getters, rootState) => {
    const userId = rootState.user?.id;
    if (!userId) return [];
    return (state.books || []).filter((book) => book.addedBy === userId);
  },
  isFavorite: (state) => (bookId) => {
    return state.favoriteBooks.includes(bookId);  // Kitap favorilerde mi?
  }
};


// Kitapları sıralayan yardımcı fonksiyon
function sortBooks(books, sortOption) {
  return [...books].sort((a, b) => {
    if (sortOption === "name") return a.title.localeCompare(b.title);
    if (sortOption === "price") return a.price - b.price;
    if (sortOption === "publicationDate") return new Date(a.publicationDate) - new Date(b.publicationDate);
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