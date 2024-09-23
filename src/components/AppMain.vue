<template>
  <main class="container">
    <div v-if="results.length" class="results">
      <div v-for="result in results" :key="result.id" class="result-item" :style="{ backgroundImage: `url(${getPosterUrl(result.poster_path)})` }">
        <div class="info">
          <p class="title">{{ result.title || result.name }}</p>
          <p class="release-date">{{ result.release_date || result.first_air_date }}</p>
          <div class="stars">
            <i v-for="n in getStars(result.vote_average)" :key="n" class="fas fa-star"></i>
            <i v-for="n in 5 - getStars(result.vote_average)" :key="n" class="far fa-star"></i>
          </div>
          <p class="overview">{{ result.overview }}</p>
          <p class="origin-country">{{ result.origin_country }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  }
});

const getPosterUrl = (posterPath) => {
  if (!posterPath) return '';
  return `https://image.tmdb.org/t/p/w342${posterPath}`;
};

const getStars = (voteAverage) => {
  return Math.ceil(voteAverage / 2);
};
</script>

<style scoped>
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
}

.result-item:hover {
  transform: scale(1.05);
}

.info {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.result-item:hover .info {
  opacity: 1;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
}

.release-date, .origin-country {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.stars {
  display: flex;
  margin-top: 0.5rem;
}

.stars .fas, .stars .far {
  color: #e50914;
  margin-right: 0.2rem;
}

.overview {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>