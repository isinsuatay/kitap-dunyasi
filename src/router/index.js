import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import BookDetail from '@/pages/BookDetail.vue';
import FavoritesPage from '@/pages/FavoritesPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import AuthPage from '@/pages/AuthPage.vue';
import store from '@/store';
import AddBook from '@/pages/AddBook.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: BookDetail,
    props: true,
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBook,
    meta: { requiresAuth: true }, // Bu sayfada giriş yapılması gerekir
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
    meta: { requiresAuth: true }, // Bu sayfada giriş yapılması gerekir
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }, // Giriş yapmayan kullanıcılar erişemez
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) {
        next('/profile'); // Eğer giriş yapıldıysa profile yönlendir
      } else {
        next(); // Giriş yapılmadıysa devam et
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Sayfalara giriş kontrolü ekleme
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth'); // Eğer yetki gerektiren bir sayfaya gidiliyorsa ve giriş yapılmadıysa auth sayfasına yönlendir
  } else {
    next();
  }
});

export default router;

