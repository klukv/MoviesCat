import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { oneMovie, oneSerial } from "../../const/const";

interface movie {
  id: number;
  title: string;
  imgUrl: string;
}

const MoviesComponent: React.FC<movie> = ({ id, title, imgUrl }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const clickMovie = (pathname: string, id: number) => {
    if (pathname.includes("movies")) {
      navigate(oneMovie + "/" + id);
    } else if (pathname.includes("serials")) {
      navigate(oneSerial + "/" + id);
    } else {
      navigate(oneMovie + "/" + id);
    }
  };

  return (
    <div className="movie__div movies__block compilation__slider_block">
      <img src={imgUrl} alt="movie" className="compilation__movie" />
      <div className="movie__hover">
        <div className="movie__hover-title">
          <span>{title}</span>
        </div>
        <div>
          <button
            className="movie__hover-btn"
            onClick={() => clickMovie(pathname, id)}
          >
            Смотреть
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviesComponent;
