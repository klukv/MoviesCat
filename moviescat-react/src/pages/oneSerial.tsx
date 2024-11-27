import debounce from "lodash.debounce";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUserIdArrayVideos } from "../redux/selectors";
import {
  setStateFSerials,
} from "../redux/slices/serialsSlice";
import { addRecentlyVideos } from "../redux/slices/user";
import "../scss/oneMovie.scss";
import { addFavouriteSerial } from "../services/contentService";
import { Idata } from "../types/dataType";
import { serialType } from "../types/serialsType";

const initialValues = {
  message: "",
  success: false,
};

const OneSerial: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  //const video = document.getElementsByTagName("video")[0];
  const [dataMessage, setDataMessage] = React.useState<Idata>(initialValues);
  const [activeVideo, setActiveVideo] = React.useState(false);

  const { userId, arraySerials } = useSelector(selectUserIdArrayVideos);
  const selectSerial: serialType = arraySerials.find(
    (serial: serialType) => serial.id.toString() === id
  );

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

  const handleWatchSerial = (serialWatched: serialType) => {
    if (serialWatched) {
      dispatch(addRecentlyVideos(serialWatched));
    }
    setActiveVideo(!activeVideo);
    // if (video.played) {
    //   video.pause();
    // }
  };

  const handleFavouriteSerial = (serialFavourite: serialType) => {
    if (serialFavourite?.id) {
      addFavouriteSerial(userId, serialFavourite.id).then(
        (data) => {
          setDataMessage((prevState) => {
            return {
              ...prevState,
              message: data.message,
              success: true,
            };
          });
          dispatch(setStateFSerials(true));
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

  return (
    <div className="main">
      <main>
        <section className="inforamtion">
          <div className="container">
            <div className="information__inner">
              <div className="information__row">
                <div className="information__block-one">
                  <div className="information__image">
                    <img
                      src={selectSerial && selectSerial.imgUrl}
                      alt="movie"
                    />
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
                    {selectSerial && selectSerial.title}
                  </div>
                  <div className="information__description">
                    {selectSerial && selectSerial.description}
                  </div>
                  <div className="information__buttons">
                    <button
                      className="information__button"
                      onClick={() => {
                        if (selectSerial) handleWatchSerial(selectSerial);
                      }}
                    >
                      Смотреть
                    </button>
                    <div className="information__like">
                      <svg
                        className="information__like-svg"
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          if (selectSerial) handleFavouriteSerial(selectSerial);
                        }}
                      >
                        <defs>
                          <style></style>
                        </defs>
                        <title />
                        <g data-name="Layer 54" id="Layer_54">
                          <path
                            className="cls-1"
                            d="M16,28.72a3,3,0,0,1-2.13-.88L3.57,17.54a8.72,8.72,0,0,1-2.52-6.25,8.06,8.06,0,0,1,8.14-8A8.06,8.06,0,0,1,15,5.68l1,1,.82-.82h0a8.39,8.39,0,0,1,11-.89,8.25,8.25,0,0,1,.81,12.36L18.13,27.84A3,3,0,0,1,16,28.72ZM9.15,5.28A6.12,6.12,0,0,0,4.89,7a6,6,0,0,0-1.84,4.33A6.72,6.72,0,0,0,5,16.13l10.3,10.3a1,1,0,0,0,1.42,0L27.23,15.91A6.25,6.25,0,0,0,29,11.11a6.18,6.18,0,0,0-2.43-4.55,6.37,6.37,0,0,0-8.37.71L16.71,8.8a1,1,0,0,1-1.42,0l-1.7-1.7a6.28,6.28,0,0,0-4.4-1.82Z"
                          />
                        </g>
                      </svg>
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
                        {selectSerial && selectSerial.year}
                      </div>
                      <div className="information__about-point">Страна</div>
                      <div className="information__about-point">
                        {selectSerial && selectSerial.country}
                      </div>
                      <div className="information__about-point">Жанр</div>
                      <div className="information__about-point">
                        {selectSerial && selectSerial.genre}
                      </div>
                      <div className="information__about-point">Режиссер</div>
                      <div className="information__about-point">
                        {selectSerial && selectSerial.director}
                      </div>
                      <div className="information__about-point">Время</div>
                      <div className="information__about-point">
                        {selectSerial && `${selectSerial.time} мин.`}
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

export default OneSerial;
