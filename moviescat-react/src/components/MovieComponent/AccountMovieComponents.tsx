import React from "react";
import { useNavigate } from "react-router-dom";
import { oneMovie } from "../../const/const";
import { Imovie } from "../../types/movieType";



const AccountMovieComponents: React.FC<Imovie> = ({ id, title, imgUrl }) => {
  const navigate = useNavigate();
  const clickRecentlyMovie = (id: number) => {
    navigate(oneMovie + "/" + id);
  };

  return (
    <div className="person__block">
      <a href="#1">
        <img src={imgUrl} alt="movie" className="person__image" />
        <div className="movie__hover">
          <div className="movie__hover-title">
            <span>{title}</span>
          </div>
          <div>
            <button
              className="movie__hover-btn"
              onClick={() => clickRecentlyMovie(id)}
            >
              Смотреть
            </button>
          </div>
        </div>
      </a>
    </div>
  );
};

export default AccountMovieComponents;
