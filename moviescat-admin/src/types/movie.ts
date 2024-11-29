export interface IMovie {
  id: number;
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

export type IMovieWithoutId = Omit<IMovie, "id">;

export interface IResponseCreatingMovie {
  message: string;
}
