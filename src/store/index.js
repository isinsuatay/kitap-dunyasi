import { createStore } from 'vuex';
import persistedState from 'vuex-persistedstate';
import books from './modules/books';
import user from './modules/user';
import favorites from './modules/favorites';
import currency from './modules/currency';
import ui from './modules/ui';
import search from './modules/search';
import reviews from './modules/reviews';

const store = createStore({
  modules: {
    books,
    user,
    favorites,
    currency,
    search,
    ui,
    reviews,
  },
  plugins: [persistedState()],
});

export default store;