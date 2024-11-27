import {
  home,
  login,
  movies,
  oneMovie,
  oneSerial,
  personAcc,
  serials,
  signup,
} from "./const/const";

import Home from "./pages/home";
import Login from "./pages/login";
import Movies from "./pages/movies";
import OneMovie from "./pages/oneMovie";
import OneSerial from "./pages/oneSerial";
import PersonalAccount from "./pages/personalAC";
import Serials from "./pages/serials";
import Signup from "./pages/signup";


export const authRoutes = [
  {
    path: home,
    Component: Home,
  },
  {
    path: movies,
    Component: Movies,
  },
  {
    path: personAcc,
    Component: PersonalAccount,
  },
  {
    path: serials,
    Component: Serials,
  },
  {
    path: oneMovie + "/:id",
    Component: OneMovie,
  },
  {
    path: oneSerial + "/:id",
    Component: OneSerial,
  },
]

export const publicRoutes = [
  {
    path: login,
    Component: Login,
  },
  {
    path: signup,
    Component: Signup,
  },
];
