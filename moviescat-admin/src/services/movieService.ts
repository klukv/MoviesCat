import axios from "axios";
import { API_URL } from "../const/global";
import { IMovie, IMovieWithoutId, IResponseCreatingMovie } from "../types/movie";

const $host = axios.create({
  baseURL: API_URL,
});

export const createMovie = async (
  movie: IMovieWithoutId | null
): Promise<IResponseCreatingMovie | undefined> => {
  if (movie) {
    const { data } = await $host.post(`api/movie`, {
      title: movie.title,
      description: movie.description,
      year: movie.year,
      country: movie.country,
      genre: movie.genres,
      director: movie.director,
      time: movie.time,
      budget: movie.budget,
      imgUrl: movie.imgUrl,
      type: movie.type,
    });
    return data;
  }
};

export const editMovie = async (movie: IMovie | null) => {
  if (movie) {
    const { data } = await $host.put(`api/movie`, {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      year: movie.year,
      country: movie.country,
      genre: movie.genres,
      director: movie.director,
      time: movie.time,
      budget: movie.budget,
      imgUrl: movie.imgUrl,
      type: movie.type,
    });
    return data;
  }
};

export const deleteMovie = async (movie_id: number | null) => {
  if (movie_id) {
    const { data } = await $host.delete(`api/movie?id=${movie_id}`);
    return data;
  }
};

export const fetchAllMovies = async () => {
  const { data } = await $host.get("api/movies");
  return data;
}
