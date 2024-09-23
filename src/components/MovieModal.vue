<template>
  <transition name="modal-sketch">
    <div class="modal" v-if="isVisible" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div class="modal-body" v-if="movieDetails">
          <h2>{{ movieDetails.title || movieDetails.name }}</h2>
          <img :src="getPosterUrl(movieDetails.poster_path)" alt="Poster" class="poster">
          <p><strong>Release Date:</strong> {{ movieDetails.release_date || movieDetails.first_air_date }}</p>
          <p><strong>Overview:</strong> {{ movieDetails.overview }}</p>
          <p><strong>Vote Average:</strong> {{ movieDetails.vote_average }}</p>
          <p><strong>Origin Country:</strong> {{ movieDetails.origin_country }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const movieDetails = ref(null);

const closeModal = () => {
  movieDetails.value = null;
  emit('close');
};

const getPosterUrl = (posterPath) => {
  if (!posterPath) return '';
  return `https://image.tmdb.org/t/p/w342${posterPath}`;
};

const fetchMovieDetails = async () => {
  const apiKey = '0ce2844fed81d4ad76f3e2c70fd52dfe';
  const language = 'it_IT';
  const movieUrl = `https://api.themoviedb.org/3/movie/${props.movie.id}?api_key=${apiKey}&language=${language}`;
  const response = await fetch(movieUrl);
  const data = await response.json();
  movieDetails.value = data;
};

const handleKeyUp = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    fetchMovieDetails();
    document.addEventListener('keyup', handleKeyUp);
  } else {
    document.removeEventListener('keyup', handleKeyUp);
  }
});

onMounted(() => {
  if (props.isVisible) {
    document.addEventListener('keyup', handleKeyUp);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUp);
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #141414;
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  color: white;
  text-align: center;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  animation: sketch-in 0.5s ease forwards;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  cursor: pointer;
}

.poster {
  width: 100%;
  max-width: 300px;
  margin: 1rem 0;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-body p {
  margin: 0.5rem 0;
}

.modal-body h2 {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .modal-content {
    width: 90%;
    padding: 1rem;
  }

  .poster {
    max-width: 200px;
  }

  .close {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 0.5rem;
  }

  .poster {
    max-width: 150px;
  }

  .close {
    font-size: 1.2rem;
  }
}

@keyframes sketch-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

.modal-sketch-enter-active, .modal-sketch-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
}
.modal-sketch-enter, .modal-sketch-leave-to {
  opacity: 0;
  transform: scale(0.8);
  filter: blur(10px);
}
</style>