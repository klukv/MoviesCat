import React from "react";
import { useLocation } from "react-router-dom";

interface IProps {
  logOut: () => void;
}

type TParseJwt = {
  sub: string;
  iat: number;
  exp: number;
};

const parseJWT = (token: string): TParseJwt | null => {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch (error) {
    return null;
  }
};

const AuthVerify = ({ logOut }: IProps) => {
  const location = useLocation();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = parseJWT(token);

      if (decodeToken && decodeToken.exp * 1000 < Date.now()) {
        logOut();
      }
    }
  }, [location, logOut]);
  return <></>;
};

export default AuthVerify;
