import axios from "axios";
import { TMDB_API_KEY } from "@env";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

// --- API Response Interfaces ---

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

export interface MoviesResponse {
  results: Movie[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: any[];
}

// --- API Call Functions ---

// Fetches a list of popular movies.
export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<MoviesResponse>("/movie/popular", {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// Fetches a list of upcoming movies.
export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get<MoviesResponse>("/movie/upcoming", {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
};

// Fetches the list of all movie genres.
// This is the function that provides the genre names.
export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await tmdbApi.get<GenresResponse>("/genre/movie/list", {
      params: { api_key: TMDB_API_KEY },
    });
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// Fetches detailed information for a single movie by its ID.
export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  const response = await tmdbApi.get<Movie>(`/movie/${id}`, {
    params: { api_key: TMDB_API_KEY },
  });
  return response.data;
};

// Fetches the cast and crew for a specific movie by its ID.
export const fetchMovieCredits = async (movieId: number): Promise<MovieCredits> => {
  const response = await tmdbApi.get<MovieCredits>(`/movie/${movieId}/credits`, {
    params: { api_key: TMDB_API_KEY },
  });
  return response.data;
};