<template>
  <header class="header-container">
    <div class="header-left">
      <img src="../assets/netflix-logo.png" alt="Netflix Logo" class="logo" @click="reloadPage">
      <nav>
        <ul class="nav-links">
          <li><a href="#" class="nav-link">Home</a></li>
          <li><a href="#" class="nav-link">Genres</a></li>
          <li><a href="#" class="nav-link">Movies</a></li>
          <li><a href="#" class="nav-link">Series</a></li>
        </ul>
      </nav>
    </div>
    <div class="header-right">
      <input type="text" v-model="query" @keyup.enter="search" class="search-input" placeholder="Search...">
      <button @click="search" class="search-button">Search</button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const query = ref('');
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

  emit('update:results', [...movieData.results, ...tvData.results]);
};

const reloadPage = () => {
  window.location.reload();
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #141414;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 2.5rem;
  margin-right: 2rem;
  cursor: pointer;
}

.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin-right: 1.5rem;
  font-size: 1rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-link:hover {
  color: #e50914;
  transform: scale(1.1);
  text-decoration: none;
}

.header-right {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 2px solid white;
  margin-right: 0.5rem;
  background-color: #333;
  color: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input::placeholder {
  color: #bbb;
}

.search-input:focus {
  border-color: #e50914;
  box-shadow: 0 0 5px #e50914;
  outline: none;
}

.search-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #e50914;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
  display: flex;
  align-items: center;
}

.search-button:hover {
  background-color: #f40612;
}

.search-button:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .logo {
    height: 2rem;
    margin-right: 1rem;
  }

  .search-input {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 100px;
  }
}
</style>