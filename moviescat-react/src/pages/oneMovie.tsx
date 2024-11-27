import debounce from "lodash.debounce";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUserIdArrayVideos } from "../redux/selectors";
import { setStateFMovies } from "../redux/slices/moviesSlice";
import { addRecentlyVideos } from "../redux/slices/user";
import "../scss/oneMovie.scss";
import { addFavouriteFilm } from "../services/contentService";
import { Idata } from "../types/dataType";
import { movieType } from "../types/movieType";

const initialValues = {
  message: "",
  success: false,
};

const OneMovie: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  //const video = document.getElementsByTagName("video")[0];
  const [dataMessage, setDataMessage] = React.useState<Idata>(initialValues);
  const [activeVideo, setActiveVideo] = React.useState(false);
  const [clickLike, setClickLike] = React.useState<boolean>(false);

  const closeWindowData = React.useCallback(
    debounce(() => {
      setDataMessage((prevState) => {
        return {
          ...prevState,
          message: initialValues.message,
          success: initialValues.success,
        };
      });
    }, 3000),
    []
  );

  const { userId, arrayMovies } = useSelector(selectUserIdArrayVideos);
  const selectMovie: movieType = arrayMovies.find(
    (movie: movieType) => movie.id.toString() === id
  );

  const handleWatchMovie = (movieWatched: movieType) => {
    if (movieWatched) {
      dispatch(addRecentlyVideos(movieWatched));
    }
    setActiveVideo(!activeVideo);
    // if (video.played) {
    //   video.pause();
    // }
  };

  const handleFavouriteMovie = (movieFavourite: movieType) => {
    if (movieFavourite?.id) {
      addFavouriteFilm(userId, movieFavourite.id).then(
        (data) => {
          setDataMessage((prevState) => {
            return {
              ...prevState,
              message: data.message,
              success: true,
            };
          });
          dispatch(setStateFMovies(true));
          closeWindowData();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setDataMessage((prevState: Idata) => {
            return {
              ...prevState,
              message: resMessage,
              success: false,
            };
          });
          closeWindowData();
        }
      );
    }
  };

  const handleClickLike = () => {
    setClickLike(!clickLike);
  };
  return (
    <div className="main">
      <main>
        <section className="inforamtion">
          <div className="container">
            <div className="information__inner">
              <div className="information__row">
                <div className="information__block-one">
                  <div className="information__image">
                    <img src={selectMovie && selectMovie.imgUrl} alt="movie" />
                  </div>
                  <div className="information__rating">
                    <h2 className="information__rating-title">
                      Рейтинг фильма
                    </h2>
                    <div className="information__rating-stars">
                      <div className="information__rating-star">
                        <div className="rating-area">
                          <input
                            type="radio"
                            id="star-10"
                            name="rating"
                            value="10"
                          />
                          <label htmlFor="star-10" title="Оценка «10»"></label>
                          <input
                            type="radio"
                            id="star-9"
                            name="rating"
                            value="9"
                          />
                          <label htmlFor="star-9" title="Оценка «9»"></label>
                          <input
                            type="radio"
                            id="star-8"
                            name="rating"
                            value="8"
                          />
                          <label htmlFor="star-8" title="Оценка «8»"></label>
                          <input
                            type="radio"
                            id="star-7"
                            name="rating"
                            value="7"
                          />
                          <label htmlFor="star-7" title="Оценка «7»"></label>
                          <input
                            type="radio"
                            id="star-6"
                            name="rating"
                            value="6"
                          />
                          <label htmlFor="star-6" title="Оценка «6»"></label>
                          <input
                            type="radio"
                            id="star-5"
                            name="rating"
                            value="5"
                          />
                          <label htmlFor="star-5" title="Оценка «5»"></label>
                          <input
                            type="radio"
                            id="star-4"
                            name="rating"
                            value="4"
                          />
                          <label htmlFor="star-4" title="Оценка «4»"></label>
                          <input
                            type="radio"
                            id="star-3"
                            name="rating"
                            value="3"
                          />
                          <label htmlFor="star-3" title="Оценка «3»"></label>
                          <input
                            type="radio"
                            id="star-2"
                            name="rating"
                            value="2"
                          />
                          <label htmlFor="star-2" title="Оценка «2»"></label>
                          <input
                            type="radio"
                            id="star-1"
                            name="rating"
                            value="1"
                          />
                          <label htmlFor="star-1" title="Оценка «1»"></label>
                        </div>
                      </div>
                      <div className="information__rating-number">8.0</div>
                    </div>
                  </div>
                </div>
                <div className="information__block-two">
                  <div className="information__title">
                    {selectMovie && selectMovie.title}
                  </div>
                  <div className="information__description">
                    {selectMovie && selectMovie.description}
                  </div>
                  <div className="information__buttons">
                    <button
                      className="information__button"
                      onClick={() => {
                        if (selectMovie) handleWatchMovie(selectMovie);
                      }}
                    >
                      Смотреть
                    </button>
                    <div className="information__like">
                      <div
                        className="information__like-icon"
                        onClick={() => {
                          if (selectMovie) handleFavouriteMovie(selectMovie);
                        }}
                      >
                        <i
                          className={clickLike ? "press" : ""}
                          onClick={handleClickLike}
                        ></i>
                      </div>
                      {dataMessage.message && (
                        <div className="information__like-message">
                          <div
                            className={
                              dataMessage.success
                                ? "message__success"
                                : "message__error"
                            }
                          >
                            {dataMessage.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="information__about">
                    <h2 className="information__about-title">О фильме</h2>
                    <div className="information__about-grid">
                      <div className="information__about-point">Год</div>
                      <div className="information__about-point">
                        {selectMovie && selectMovie.year}
                      </div>
                      <div className="information__about-point">Страна</div>
                      <div className="information__about-point">
                        {selectMovie && selectMovie.country}
                      </div>
                      <div className="information__about-point">Жанр</div>
                      <div className="information__about-point">
                        {selectMovie && selectMovie.genre}
                      </div>
                      <div className="information__about-point">Режиссер</div>
                      <div className="information__about-point">
                        {selectMovie && selectMovie.director}
                      </div>
                      <div className="information__about-point">Время</div>
                      <div className="information__about-point">
                        {selectMovie && `${selectMovie.time} мин.`}
                      </div>
                      <div className="information__about-point">Бюджет</div>
                      <div className="information__about-point">
                        {selectMovie && `$ ${selectMovie.budget}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                activeVideo ? "video__player-active" : "video__player video"
              }
            >
              <video controls width="100%" id="video">
                <source
                  src="https://harrypotter-film.ru/video/part_one/harry_potter_and_philosophers_stone_480.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OneMovie;
