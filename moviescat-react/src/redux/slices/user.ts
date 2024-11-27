import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { allVideos, User } from "../../types/userType";

export interface userState {
  user: User;
  recentlyVideos: allVideos[];
}

const initialState: userState = {
  user: {
    id: 0,
    username: "",
    email: "",
    roles: [],
    isAuth: false,
  },
  recentlyVideos: [],
};

const findId = (arrayVideos: allVideos[], videoId: number, title: string) => {
  return arrayVideos.find(
    (elem) => elem.id === videoId && elem.title === title
  ) !== undefined
    ? true
    : false;
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.user.isAuth = action.payload;
    },
    addRecentlyVideos: (state, action: PayloadAction<allVideos>) => {
      if (
        findId(state.recentlyVideos, action.payload.id, action.payload.title)
      ) {
        return state;
      } else {
        state.recentlyVideos = [
          action.payload,
          ...state.recentlyVideos.slice(0, 4),
        ];
      }
    },
    logoutUser: () => {},
  },
});

export const { saveUser, setIsAuth, logoutUser, addRecentlyVideos } =
  userSlice.actions;

export default userSlice.reducer;
