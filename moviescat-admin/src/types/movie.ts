export interface IMovie {
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

export interface IResponseCreatingMovie {
  message: string;
}
