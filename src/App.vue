<template>
  <div id="app" :class="{ 'light-theme': !isDarkTheme, 'dark-theme': isDarkTheme }">
    <AppHeader @update:results="updateResults" />
    <AppMain :results="filteredResults" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppMain from './components/AppMain.vue';
import { useTheme } from './composables/useTheme';

const { isDarkTheme } = useTheme();

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

<style lang="scss">
#app {
  background-color: var(--main-background-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
  padding-top: 4rem; // Ridotto da 6rem a 4rem
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-top: 3.5rem; // Ridotto da 5rem a 3.5rem
  }

  @media (max-width: 480px) {
    padding-top: 3rem; // Ridotto da 4rem a 3rem
  }
}

.light-theme {
  --main-background-color: #f0f0f0;
  --text-color: #213547;
}

.dark-theme {
  --main-background-color: #141414;
  --text-color: rgba(255, 255, 255, 0.87);
}

// SASS mixins for theme colors
@mixin light-theme {
  --main-background-color: #f0f0f0;
  --text-color: #213547;
  --header-background-color: #ffffff;
  --card-background-color: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

@mixin dark-theme {
  --main-background-color: #141414;
  --text-color: rgba(255, 255, 255, 0.87);
  --header-background-color: #1f1f1f;
  --card-background-color: #2a2a2a;
  --shadow-color: rgba(255, 255, 255, 0.1);
}

// Apply themes
.light-theme {
  @include light-theme;
}

.dark-theme {
  @include dark-theme;
}

// New SASS functions
@function lighten-color($color, $amount) {
  @return lighten($color, $amount);
}

@function darken-color($color, $amount) {
  @return darken($color, $amount);
}

// Example usage of new functions
.card {
  background-color: var(--card-background-color);
  box-shadow: 0 2px 8px var(--shadow-color);

  .light-theme & {
    border: 1px solid lighten-color(#000000, 80%);
  }

  .dark-theme & {
    border: 1px solid darken-color(#ffffff, 80%);
  }
}

.header {
  background-color: var(--header-background-color);

  .light-theme & {
    border-bottom: 1px solid lighten-color(#000000, 90%);
  }

  .dark-theme & {
    border-bottom: 1px solid darken-color(#ffffff, 90%);
  }
}
</style>
