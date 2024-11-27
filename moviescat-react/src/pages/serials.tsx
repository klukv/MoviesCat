import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "../scss/movies.scss";
import {
  SortPopupDate,
  SortPopupGenre,
  MovieLoadingComponent,
  MovieComponent,
  usePagination,
} from "../components";
import Pagination from "../components/Pagination";
import { sortItemsGenre, sortItemsOther } from "../const/const";
import { addSerials, setLoadedSerials } from "../redux/slices/serialsSlice";
import { getAllSerials } from "../services/contentService";
import { searchContext } from "../App";
import { serialType } from "../types/serialsType";
import { selectActiveLabel, selectIsLoadedSerials } from "../redux/selectors";

const Serials: React.FC = () => {
  const dispatch = useDispatch();
  const { sortParams, genreURL, searchMovies } =
    React.useContext(searchContext);
  const [serails, setSerials] = React.useState<serialType[]>([]);
  const isLoaded = useSelector(selectIsLoadedSerials);
  const activeLabel = useSelector(selectActiveLabel);
  React.useEffect(() => {
    getAllSerials(sortParams, genreURL, searchMovies).then((data) => {
      dispatch(addSerials(data));
      setSerials(data);
      dispatch(setLoadedSerials(true));
    });
  }, [sortParams, genreURL, searchMovies, dispatch]);

  const paginateserials = usePagination({
    contentPerPage: 5,
    count: serails.length,
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
                ? serails.length < 5
                  ? serails.map((serial, index) => (
                      <MovieComponent key={`index=${index}`} {...serial} />
                    ))
                  : serails
                      .slice(
                        paginateserials.firstContentIndex,
                        paginateserials.lastContentIndex
                      )
                      .map((serials, index) => (
                        <MovieComponent key={`index=${index}`} {...serials} />
                      ))
                : [...new Array(5)].map((_, index) => (
                    <MovieLoadingComponent key={`indexLoading=${index}`} />
                  ))}
            </div>
            {serails.length > 5 ? <Pagination {...paginateserials} /> : ""}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Serials;
