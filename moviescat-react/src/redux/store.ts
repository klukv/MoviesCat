import serialsSlice from "./slices/serialsSlice";
import filterSlice from "./slices/filter";
import moviesSlice from "./slices/moviesSlice";
import userSlice from "./slices/user";
import {
  configureStore,
  combineReducers,
  Reducer,
  AnyAction,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";

const appReducer = combineReducers({
  moviesSlice,
  filterSlice,
  serialsSlice,
  userSlice,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "user/logoutUser") {
    storage.removeItem("persist:root");
    storage.removeItem("token");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
