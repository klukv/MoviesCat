import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllFavouriteMovies } from "../../services/contentService";
import { movieType } from "../../types/movieType";

export interface moviesState {
  movies: movieType[];
  sliderPopularMovies: movieType[];
  sliderActualMovies: movieType[];
  favouriteMovies: movieType[];
  isLoaded: boolean;
  error: string | null;
  isAddedFMovie: boolean;
}

const initialState: moviesState = {
  movies: [],
  favouriteMovies: [],
  sliderPopularMovies: [],
  sliderActualMovies: [],
  isLoaded: false,
  error: null,
  isAddedFMovie: true,
};

export const fetchLikeMovies = createAsyncThunk<
  movieType[],
  number,
  { rejectValue: string }
>("movies/fetchLikeMovies", async (user_id, { rejectWithValue }) => {
  const { data, status } = await getAllFavouriteMovies(user_id);
  if (status !== 200) {
    return rejectWithValue("Server Error!");
  }
  return data;
});

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    addFilms: (state, action: PayloadAction<movieType[]>) => {
      state.movies = action.payload;
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    setStateFMovies: (state, action: PayloadAction<boolean>) => {
      state.isAddedFMovie = action.payload;
    },
    addFavouriteMovies: (state, action: PayloadAction<movieType[]>) => {
      state.favouriteMovies = action.payload;
    },
    addPopularMovies: (state, action: PayloadAction<movieType[]>) => {
      state.sliderPopularMovies = action.payload;
    },
    addActualMovies: (state, action: PayloadAction<movieType[]>) => {
      state.sliderActualMovies = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikeMovies.pending, (state) => {
        if (state !== null && state !== undefined) {
          state.isAddedFMovie = false;
          state.error = null;
        }
      })
      .addCase(fetchLikeMovies.fulfilled, (state, action) => {
        if (state !== null && state !== undefined) {
          state.isAddedFMovie = false;
          state.favouriteMovies = action.payload;
        }
      })
      .addCase(fetchLikeMovies.rejected, (state, action) => {
        if (state !== null && state !== undefined) {
          state.isAddedFMovie = false;
          state.error = action.error?.message ?? null;
        }
      });
  },
});

export const {
  addFilms,
  setLoaded,
  setStateFMovies,
  addFavouriteMovies,
  addPopularMovies,
  addActualMovies,
} = moviesSlice.actions;

export default moviesSlice.reducer;
