import { moviesState } from "./slices/moviesSlice";
import { RootState } from "./store";

export const selectIsAuth = (state: RootState) => state.userSlice.user.isAuth;
export const selectUser = (state: RootState) => state.userSlice;
export const selectCategoryMovies = (state: RootState): moviesState => state.moviesSlice;
export const selectIsLoadedMovies = (state: RootState) =>
  state.moviesSlice.isLoaded;
export const selectActiveLabel = (state: RootState) => state.filterSlice;
export const selectIsLoadedSerials = (state: RootState) =>
  state.serialsSlice.isLoaded;
export const selectUserIdArrayVideos = ({
  userSlice,
  moviesSlice,
  serialsSlice,
}: RootState) => {
  return {
    userId: userSlice.user.id,
    arrayMovies: moviesSlice.movies,
    arraySerials: serialsSlice.serials,
  };
};
export const selectInfoPersonAcc = ({
  moviesSlice,
  serialsSlice,
  userSlice
}: RootState) => {
  return {
    allRecentlyVideos: userSlice.recentlyVideos,
    favouriteMovies: moviesSlice.favouriteMovies,
    isAddedFMovie: moviesSlice.isAddedFMovie,
    isAddedFSerial: serialsSlice.isAddedFSerial,
  };
};
export const selectParamsURL = ({ filterSlice }: RootState) => {
  return {
    typeParams: filterSlice.otherParams.typeParams,
    order:filterSlice.otherParams.order,
    genre:filterSlice.genreSort.genre,
    type:filterSlice.genreSort.type,
  };
};
export const selectCategoryFavourite = ({ moviesSlice, serialsSlice }: RootState) => {
    return {
        favouriteMovies: moviesSlice.favouriteMovies,
        favouriteSerials: serialsSlice.favouriteSerials
    };
  };
