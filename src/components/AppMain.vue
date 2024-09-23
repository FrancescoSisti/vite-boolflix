<template>
  <main class="container">
    <div v-if="results.length" class="results">
      <div v-for="result in results" :key="result.id" class="result-item" :style="{ backgroundImage: `url(${getPosterUrl(result.poster_path)})` }" @click="openModal(result)">
      </div>
    </div>
    <MovieModal :movie="selectedMovie" :isVisible="isModalVisible" @close="closeModal" />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import MovieModal from './MovieModal.vue';

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
});

const selectedMovie = ref(null);
const isModalVisible = ref(false);

const openModal = (movie) => {
  selectedMovie.value = movie;
  isModalVisible.value = true;
};

const closeModal = () => {
  selectedMovie.value = null;
  isModalVisible.value = false;
};

const getPosterUrl = (posterPath) => {
  if (!posterPath) return '';
  return `https://image.tmdb.org/t/p/w342${posterPath}`;
};
</script>

<style scoped>
.container {
  padding-top: 6rem; /* Aggiunto padding top per distaccare i contenuti dall'header */
}

.results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.result-item {
  position: relative;
  width: 200px;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.result-item:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .result-item {
    width: 150px;
    height: 225px;
  }
}

@media (max-width: 480px) {
  .result-item {
    width: 100px;
    height: 150px;
  }
}
</style>