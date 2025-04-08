import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: () => import('@/pages/BookDetail.vue'),
    props: true,
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: () => import('@/pages/AddBook.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/pages/FavoritesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/pages/AuthPage.vue'),
    beforeEnter: (to, from, next) => {
      if (store.getters['user/isAuthenticated']) {
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
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, left: 0, behavior: 'smooth' };
  },
});

// Global auth guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters['user/isAuthenticated']) {
    next('/auth');
  } else {
    next();
  }
});

export default router;