import { movieType } from "./movieType";
import { serialType } from "./serialsType";

export type User = {
    id: number;
    username: string;
    email: string;
    roles: string[];
    isAuth?: boolean;
  };
  export type allVideos = movieType | serialType