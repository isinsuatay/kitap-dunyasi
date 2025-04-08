<template>
  <div class="favorites">
    <h1>Your Favorite Books</h1>
    <div v-if="favorites.length === 0">
      <p>No books in favorites yet!</p>
    </div>
    <div v-else class="favorites-grid">
      <BookCard v-for="book in favorites" :key="book.id" :book="book" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import BookCard from "@/components/BookCard.vue";

export default {
  components: {
    BookCard,
  },
  setup() {
    const store = useStore();
    const favorites = computed(() => store.getters["favorites/favorites"]);

    onMounted(() => {
      store.dispatch("favorites/loadFavorites");
    });

    return { favorites };
  },
};
</script>

<style scoped>
.favorites {
  margin-top: 40px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: gray;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px;

    & > * {
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      border-radius: 10px;
      
      &:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      }
    }
  }

  p {
    font-size: 1.2rem;
    font-style: italic;
    color: gray;
    opacity: 0.9;
  }
}
</style>
