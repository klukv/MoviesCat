import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sortGenreType, sortOtherParamsType } from "../../types/filterTypes";

export interface filterState {
  genreSort: sortGenreType;
  otherParams: sortOtherParamsType;
}

const initialState: filterState = {
  genreSort: {
    genre: "Все",
    type: "default",
    order: "desc",
  },
  otherParams: {
    name: "По умолчанию",
    typeParams: "default",
    order: "desc",
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setGenreSort: (state, action: PayloadAction<sortGenreType>) => {
      state.genreSort = action.payload;
    },
    setOtherSort: (state, action: PayloadAction<sortOtherParamsType>) => {
      state.otherParams = action.payload;
    },
  },
});

export const { setGenreSort, setOtherSort } = filterSlice.actions;

export default filterSlice.reducer;
