const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Popular movies fetch karne ka function
export async function getPopularMovies(page = 1) {
    // 10 second ka timeout laga raha hoon taaki lagatar loading na dikhae
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
        const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId); // Request complete hone par timeout cancel karein

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.results; // Movies ka array return karega
    } catch (error) {
        console.error('getPopularMovies failed:', error.message);
        throw error;
    }
}

//movies search karne ka function
export async function searchMovies(query, page = 1) {
    if (!query || query.trim() === '') {
        return [];
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
        const encodedQuery = encodeURIComponent(query.trim());
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodedQuery}&page=${page}`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId); // Request complete hone par timeout cancel karega

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.results; // Movies ka array return karega
    } catch (error) {
        console.error('searchMovies failed:', error.message);
        throw error;
    }
}

// Single movie ki extended details (runtime, genres, backdrop, etc.)
export async function getMovieDetails(movieId) {
    if (!movieId) return null;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Details API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('getMovieDetails failed:', error.message);
        throw error;
    }
}