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
    meta: { requiresAuth: true }, 
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage,
    meta: { requiresAuth: true }, 
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) {
        next('/profile'); 
      } else {
        next(); 
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Eğer önceki konum kaydedilmişse, oraya dön
    if (savedPosition) {
      return savedPosition;
    }
    // Sayfa geçişlerinde her zaman en üstte başla
    return { top: 0, left: 0, behavior: 'smooth' };
  },
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