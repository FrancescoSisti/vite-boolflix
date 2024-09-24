<template>
  <transition name="modal-sketch">
    <div class="modal" v-if="isVisible" @click.self="closeModal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <div class="modal-body" v-if="movieDetails">
          <h2>{{ movieDetails.title || movieDetails.name }}</h2>
          <img :src="getPosterUrl(movieDetails.poster_path)" alt="Poster" class="poster">
          <span><strong>Data di uscita:</strong> {{ movieDetails.release_date || movieDetails.first_air_date }}</span>
          <span><strong>Panoramica:</strong> {{ movieDetails.overview }}</span>
          <span><strong>Voto medio:</strong> {{ formatVote(movieDetails.vote_average) }}</span>
          <span><strong>Paese di origine:</strong> {{ movieDetails.origin_country }}</span>

          <!-- Aggiunta del sistema di votazione -->
          <div class="rating">
            <span><strong>Il tuo voto:</strong></span>
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': 6 - star <= userRating }"
                @click="setRating(6 - star)" @mouseenter="hoverRating = 6 - star" @mouseleave="hoverRating = 0">
                ★
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useTheme } from '../composables/useTheme';

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

const userRating = ref(0);
const hoverRating = ref(0);

// Create a map to store ratings for each movie
const movieRatings = ref(new Map());

const closeModal = () => {
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
  // Set the user rating from stored ratings
  userRating.value = movieRatings.value.get(props.movie.id) || 0;
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

watch(() => props.movie, (newMovie) => {
  if (newMovie) {
    userRating.value = movieRatings.value.get(newMovie.id) || 0;
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

const setRating = (rating) => {
  userRating.value = rating;
  // Store the rating for this movie
  movieRatings.value.set(props.movie.id, rating);
};

const formatVote = (vote) => {
  return vote.toFixed(1);
};

const { isDarkTheme } = useTheme();
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: v-bind('isDarkTheme ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"');
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.modal-content {
  background-color: v-bind('isDarkTheme ? "#141414" : "#f0f0f0"');
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  color: v-bind('isDarkTheme ? "white" : "black"');
  text-align: center;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  animation: sketch-in 0.5s ease forwards;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  cursor: pointer;
  color: v-bind('isDarkTheme ? "white" : "black"');
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

.modal-sketch-enter-active,
.modal-sketch-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
}

.modal-sketch-enter,
.modal-sketch-leave-to {
  opacity: 0;
  transform: scale(0.8);
  filter: blur(10px);
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.stars {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  margin-top: 0.5rem;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: v-bind('isDarkTheme ? "#ccc" : "#666"');
  transition: color 0.3s ease, transform 0.2s ease, text-shadow 0.3s ease;
}

.star.filled,
.star:hover,
.star:hover~.star {
  color: #ffd700;
  transform: scale(1.1);
  text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700;
}

.star:active {
  transform: scale(0.95);
}

.star:hover,
.star:hover~.star {
  color: #ffd700;
  transform: scale(1.1);
  text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700;
}

.star.filled {
  color: #ffd700;
}

.star:hover,
.star:hover~.star {
  color: #ffd700;
  transform: scale(1.1);
  text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700;
}
</style>