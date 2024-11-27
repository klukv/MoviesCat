import { movieType } from "./movieType";
import { serialType } from "./serialsType";

export interface Idata {
  message: string;
  success: boolean;
}
export interface IresponseMovies {
  data: movieType[];
  status: number;
}
export interface IresponseSerials {
  data: serialType[];
  status: number;
}
export interface IQueryJSON {
  sort: string;
  genre: string;
}
