import { API_URL_CONTENT } from "../const/const";
import { IresponseMovies, IresponseSerials } from "../types/dataType";
import { IMovieData, movieType } from "../types/movieType";
import { $authHost } from "./authService";

export const getAllFilms = async (
  URL: string
) => {
  const { data } = await $authHost.get(
    API_URL_CONTENT + `/movies?${URL}`
  );
  return data;
};

export const getFilmsByType = async (type: string) => {
  const { data } = await $authHost.get(
    API_URL_CONTENT + `/type-movies?type=${type}`
  );
  return data;
};

export const getAllSerials = async (
  sort: string,
  genre: string,
  search: string
) => {
  const { data } = await $authHost.get(
    API_URL_CONTENT + `/serials?${sort}${genre}`
  );
  return data;
};

export const addFavouriteFilm = async (user_id: number, movie_id: number) => {
  const { data } = await $authHost.post(API_URL_CONTENT + `/addMovie`, {
    user_id,
    movie_id,
  });
  return data;
};
export const addFavouriteSerial = async (
  user_id: number,
  serial_id: number
) => {
  const { data } = await $authHost.post(API_URL_CONTENT + `/addSerial`, {
    user_id,
    serial_id,
  });
  return data;
};

export const getAllFavouriteMovies = async (
  user_id: number
): Promise<IresponseMovies> => {
  const { data, status } = await $authHost.get(
    API_URL_CONTENT + `/all-favourite-movies?user_id=${user_id}`
  );
  return { data: data, status: status };
};
export const getAllFavouriteSerial = async (
  user_id: number
): Promise<IresponseSerials> => {
  const { data, status } = await $authHost.get(
    API_URL_CONTENT + `/all-favourite-serials?user_id=${user_id}`
  );
  return { data: data, status: status };
};
export const createMovie = async (movie: IMovieData) => {
  const { data } = await $authHost.post(API_URL_CONTENT + `/movie`, {
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
};
export const putFilm = async (movie: movieType) => {
  const { data } = await $authHost.put(API_URL_CONTENT + `/movie`, {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    year: movie.year,
    country: movie.country,
    genre: movie.genre,
    director: movie.director,
    time: movie.time,
    budget: movie.budget,
    imgUrl: movie.imgUrl,
    type: movie.type,
  });
  return data;
};
export const deleteFilm = async (movie_id: number) => {
  const { data } = await $authHost.delete(
    API_URL_CONTENT + `/movie/` + movie_id
  );
  return data;
};
