import React, { useState, useEffect } from "react";
import { Carousel, MovieComponent } from "../components";
import "../scss/home.scss";
import CategorySlider from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import { movieType } from "../types/movieType";
import { selectCategoryMovies, selectIsAuth } from "../redux/selectors";
import { getFilmsByType } from "../services/contentService";
import { useDispatch } from "react-redux";
import { addActualMovies, addPopularMovies } from "../redux/slices/moviesSlice";

const aboutOneIMG = require("../assets/img/about/quality.jpg");
const aboutTwoIMG = require("../assets/img/about/download.jpg");

const typePopular: string = "popular";
const typeActual: string = "actual";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthUser = useSelector(selectIsAuth);
  const [popularFilms, setPopularFilms] = useState(true);
  const { sliderPopularMovies, sliderActualMovies } =
    useSelector(selectCategoryMovies);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  useEffect(() => {
    if (isAuthUser) {
      getFilmsByType(typeActual).then((data) =>
        dispatch(addActualMovies(data))
      );
      getFilmsByType(typePopular).then((data) =>
        dispatch(addPopularMovies(data))
      );
    }
  }, [dispatch, isAuthUser]);

  const handleActiveSlider = (value: boolean) => {
    setPopularFilms(value);
  };
  return (
    <div className="main">
      <main>
        <section className="banner">
          <div className="container">
            <div className="banner__inner">
              <Carousel />
              <div className="banner__inner-info">
                <h1 className="banner__title">
                  Почувствуй силу кино
                  <br />у себя дома
                </h1>
                <h3 className="banner__subtitle">
                  Смотрите фильмы и сериалы только у нас
                </h3>
                <a className="banner__link" href="#learn__more">
                  Узнать больше
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="compilation">
          <div className="container">
            <div className="compilation__inner">
              <div className="compilation__titles">
                <div
                  className={
                    popularFilms
                      ? "compilation__title title active"
                      : "compilation__title title"
                  }
                >
                  <h2 onClick={() => handleActiveSlider(true)}>Популярное</h2>
                </div>
                <div
                  className={
                    !popularFilms
                      ? "compilation__title title active"
                      : "compilation__title title"
                  }
                >
                  <h2 onClick={() => handleActiveSlider(false)}>Актуальное</h2>
                </div>
              </div>
              <CategorySlider
                responsive={responsive}
                itemClass="carousel-item-padding-40-px"
              >
                {popularFilms
                  ? sliderPopularMovies
                      .slice(0, 8)
                      .map((movie: movieType, index: number) => (
                        <MovieComponent key={`index__${index}`} {...movie} />
                      ))
                  : sliderActualMovies
                      .slice(0, 8)
                      .map((movie: movieType, index: number) => (
                        <MovieComponent key={`index__${index}`} {...movie} />
                      ))}
              </CategorySlider>
            </div>
          </div>
        </section>
        <section className="about" id="learn__more">
          <div className="container">
            <div className="about__inner">
              <div className="about__title title">О нас</div>
              <div className="about__quality">
                <div className="about__quality-image">
                  <img src={aboutOneIMG} alt="family" />
                </div>
                <div className="about__quality-info">
                  <div className="about__quality-title title">
                    Гарантия качества
                  </div>
                  <div className="about__quality-text">
                    Все фильмы и сериалы в нашем онлайн-кионтеатре представлены
                    зрителю в наилучшем качестве и с профессиональной озвучкой.
                  </div>
                </div>
              </div>
              <div className="about__download">
                <div className="about__download-info">
                  <div className="about__download-title title">
                    Удобный интерфейс
                  </div>
                  <div className="about__download-text">
                    Для современного человека удобство и комфорт особенно
                    ценятся при постоянной занятости или просто в конце рабочего
                    дня. По этой причине, на сегодняшний день так популярны
                    онлайн-кинотеатры. Здесь вы можете посмотреть любимый фильм,
                    увлечь ребенка интересным видео, либо насладиться нашумевшим
                    блокбастером, который только недавно вышел на экраны, не
                    выходя из дома.
                  </div>
                </div>
                <div className="about__download-image">
                  <img src={aboutTwoIMG} alt="family" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
