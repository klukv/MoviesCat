import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/movies.scss";
import {
  SortPopupDate,
  SortPopupGenre,
  MovieComponent,
  MovieLoadingComponent,
  usePagination,
} from "../components";
import Pagination from "../components/Pagination";
import qs from "qs";
import { sortItemsGenre, sortItemsOther } from "../const/const";
import { getAllFilms } from "../services/contentService";
import { addFilms, setLoaded } from "../redux/slices/moviesSlice";
import { searchContext } from "../App";
import {
  selectActiveLabel,
  selectIsLoadedMovies,
  selectCategoryMovies,
} from "../redux/selectors";
import { useNavigate } from "react-router-dom";
import { sortGenreType, sortOtherParamsType } from "../types/filterTypes";
import { IQueryJSON } from "../types/dataType";
import  { setGenreSort, setOtherSort } from "../redux/slices/filter";

const Movies: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [URL, setURL] = React.useState<string>("");
  const isURL = React.useRef<boolean>(false);
  const { sortParams, genreURL, searchMovies } =
    React.useContext(searchContext);
  const { movies } = useSelector(selectCategoryMovies);
  const isLoaded = useSelector(selectIsLoadedMovies);
  const activeLabel = useSelector(selectActiveLabel);

  useEffect(() => {
    if (window.location.search.substring(1)) {
      const queryJSON: IQueryJSON | qs.ParsedQs = qs.parse(
        window.location.search.substring(1)
      );
      if (queryJSON) {
        const sortValue: string | undefined =
          typeof queryJSON.sort === "string"
            ? queryJSON.sort.split(",")[0]
            : undefined;
        const selectGenre = sortItemsGenre.find(
          (objGenre: sortGenreType) => objGenre.genre === queryJSON.genre
        );
        const selectSort = sortItemsOther.find(
          (objOtherParams: sortOtherParamsType) =>
            objOtherParams.typeParams === sortValue
        );
        selectGenre && dispatch(setGenreSort(selectGenre));
        selectSort && dispatch(setOtherSort(selectSort));
      }
    }
  }, []);
  useEffect(() => {
    if (isURL.current) {
      const URL = qs.stringify(
        {
          sort: sortParams,
          genre: genreURL,
        },
        {
          filter: (prefix, value: string) => {
            if (value !== "default") {
              return value;
            }
          },
        }
      );
      setURL(URL);
      navigate(`?${URL}`);
    }
    console.log(URL);

    isURL.current = true;
  }, [sortParams, genreURL, dispatch]);

  useEffect(() => {
    getAllFilms(URL).then((data) => {
      dispatch(addFilms(data));
      dispatch(setLoaded(true));
    });
  }, [URL, dispatch]);

  const paginateMovies = usePagination({
    contentPerPage: 5,
    count: movies.length,
  });

  return (
    <div className="main">
      <main>
        <section className="movies">
          <div className="container">
            <SortPopupDate
              items={sortItemsOther}
              activeObj={activeLabel.otherParams}
            />
            <SortPopupGenre
              items={sortItemsGenre}
              activeObj={activeLabel.genreSort}
            />
            <div className="movies__row">
              {isLoaded
                ? movies.length < 5
                  ? movies.map((movie, index) => (
                      <MovieComponent key={`index=${index}`} {...movie} />
                    ))
                  : movies
                      .slice(
                        paginateMovies.firstContentIndex,
                        paginateMovies.lastContentIndex
                      )
                      .map((movies, index) => (
                        <MovieComponent key={`index=${index}`} {...movies} />
                      ))
                : [...new Array(5)].map((_, index) => (
                    <MovieLoadingComponent key={`indexLoading=${index}`} />
                  ))}
            </div>
            {movies.length > 5 && <Pagination {...paginateMovies} />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Movies;
