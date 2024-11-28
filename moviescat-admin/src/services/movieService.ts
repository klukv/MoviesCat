import axios from "axios";
import { API_URL } from "../const/global";
import { IMovie, IResponseCreatingMovie } from "../types/movie";

const $host = axios.create({
  baseURL: API_URL,
});

export const createMovie = async (movie: IMovie | null): Promise<IResponseCreatingMovie | undefined> => {
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

export const editMovie = async () => {
  const { data } = await $host.put("/movie");

  return data;
};

export const deleteMovie = async () => {
  const { data } = await $host.delete("/movie");

  return data;
};
