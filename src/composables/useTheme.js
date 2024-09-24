import { ref, watch } from 'vue';

const isDarkTheme = ref(localStorage.getItem('theme') === 'dark');

export function useTheme() {
    const applyTheme = (dark) => {
        const theme = dark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const toggleTheme = () => {
        isDarkTheme.value = !isDarkTheme.value;
        applyTheme(isDarkTheme.value);
    };

    watch(isDarkTheme, (newVal) => {
        applyTheme(newVal);
    }, { immediate: true });

    // Apply theme on initial load
    applyTheme(isDarkTheme.value);

    return { isDarkTheme, toggleTheme };
}