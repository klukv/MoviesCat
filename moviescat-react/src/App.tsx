import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Cmovies, Cserials } from "./components";
import Footer from "./components/footer";
import Header from "./components/header";
import { likeMovies, likeSerials } from "./const/const";
import Login from "./pages/login";
import PersonalAC from "./pages/personalAC";
import { selectIsAuth, selectParamsURL } from "./redux/selectors";
import { logoutUser } from "./redux/slices/user";
import { authRoutes, publicRoutes } from "./routes";
import AuthVerify from "./components/authVerify";

interface contextSearch {
  searchValue: string;
  setSearchValue: (value: string) => void;
  genreURL: string;
  searchMovies: string;
  sortParams: string;
}
const defaultState = {
  searchValue: "",
  setSearchValue: () => "",
  genreURL: "",
  searchMovies: "",
  sortParams: "",
};

export const searchContext = React.createContext<contextSearch>(defaultState);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = React.useState("");
  const isAuthUser = useSelector(selectIsAuth);

  const { genre, type, typeParams, order } = useSelector(selectParamsURL);
  const genreURL = type !== "default" ? `${genre}` : "default";
  const searchMovies = searchValue ? `&title=${searchValue}` : "";
  const sortParams =
    typeParams !== "default" ? `${typeParams}, order=${order}` : "default";
  const logOut = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <div className="page">
      <searchContext.Provider
        value={{
          searchValue,
          setSearchValue,
          genreURL,
          searchMovies,
          sortParams,
        }}
      >
        <Header />
        <Routes>
          {isAuthUser ? (
            authRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))
          ) : (
            <Route key="login-key" path="*" element={<Login />} />
          )}
          {publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="/person" element={<PersonalAC />}>
            <Route path={likeMovies} element={<Cmovies />} />
            <Route path={likeSerials} element={<Cserials />} />
          </Route>
        </Routes>
        <Footer />
      </searchContext.Provider>
      <AuthVerify logOut={logOut} />
    </div>
  );
};

export default App;
