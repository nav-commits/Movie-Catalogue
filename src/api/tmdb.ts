import axios from "axios";
import { TMDB_API_KEY } from "@env";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export interface MoviesResponse {
  results: Movie[];
}

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const response = await tmdbApi.get<MoviesResponse>("/movie/popular", {
    params: { api_key: TMDB_API_KEY },
  });
  return response.data.results;
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  const response = await tmdbApi.get<Movie>(`/movie/${id}`, {
    params: { api_key: TMDB_API_KEY },
  });
  return response.data;
};
