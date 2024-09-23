<template>
  <div id="app">
    <AppHeader @update:results="updateResults" />
    <AppMain :results="filteredResults" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';

const defaultResults = ref([]);
const results = ref([]);

const filteredResults = computed(() => {
  return results.value.length ? results.value : defaultResults.value;
});

const updateResults = (newResults) => {
  results.value = newResults;
};

const fetchDefaultMovies = async () => {
  const apiKey = '0ce2844fed81d4ad76f3e2c70fd52dfe';
  const language = 'it_IT';
  const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=1`;

  const response = await fetch(popularMoviesUrl);
  const data = await response.json();
  defaultResults.value = data.results;
};

onMounted(() => {
  fetchDefaultMovies();
});
</script>

<style>
#app {
  background-color: #141414; /* Stesso sfondo dell'header */
  color: white; /* Colore del testo per contrastare con lo sfondo scuro */
  padding-top: 6rem; /* Aggiungi un padding per evitare che il contenuto venga coperto dall'header */
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  #app {
    padding-top: 5rem;
  }
}

@media (max-width: 480px) {
  #app {
    padding-top: 4rem;
  }
}
</style>
