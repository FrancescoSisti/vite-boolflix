<template>
  <div class="container">
    <input type="text" v-model="query" @keyup.enter="search" class="form-control" placeholder="Search...">
    <button @click="search" class="search-button">Search</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const query = ref('');
const results = ref([]);

const emit = defineEmits(['update:results']);

const search = async () => {
  const apiKey = '0ce2844fed81d4ad76f3e2c70fd52dfe';
  const language = 'it_IT';
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${language}&query=${query.value}`;
  const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=${language}&query=${query.value}`;

  const [movieResponse, tvResponse] = await Promise.all([
    fetch(movieUrl),
    fetch(tvUrl)
  ]);

  const movieData = await movieResponse.json();
  const tvData = await tvResponse.json();

  results.value = [...movieData.results, ...tvData.results];
  emit('update:results', results.value);
};
</script>

<style scoped>
/* Stili esistenti */
</style>