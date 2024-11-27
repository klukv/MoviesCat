export type movieType = {
  id: number;
  title: string;
  description: string;
  year: number;
  country: string;
  genre: string;
  director: string;
  time: number;
  budget: number;
  imgUrl: string;
  type: string;
};
export interface IMovieData {
  title: string;
  description: string;
  year: number;
  country: string;
  genres: string;
  director: string;
  time: number;
  budget: number;
  imgUrl: string;
  type: string;
}
export interface Imovie {
  id: number;
  title: string;
  imgUrl: string;
}
export interface IDropdownSelectItem {
  name: string;
  id: number;
}
