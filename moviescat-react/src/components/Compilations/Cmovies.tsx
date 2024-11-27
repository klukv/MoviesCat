import React from "react";
import { useSelector } from "react-redux";
import { MovieComponent, usePagination } from "..";
import { selectCategoryFavourite } from "../../redux/selectors";
import { movieType } from "../../types/movieType";
import EmptySlider from "../EmptySlider";
import Pagination from "../Pagination";

const Cmovies: React.FC = () => {
  const { favouriteMovies } = useSelector(selectCategoryFavourite);
  const paginateFavouriteMovies = usePagination({
    count: favouriteMovies.length,
    contentPerPage: 5,
  });
  return (
    <>
      <div className="person__compilation-slider">
        {favouriteMovies.length !== 0 ? (
          favouriteMovies
            .slice(
              paginateFavouriteMovies.firstContentIndex,
              paginateFavouriteMovies.lastContentIndex
            )
            .map((movie: movieType, index: number) => (
              <MovieComponent key={`keyFavourite=${index}`} {...movie} />
            ))
        ) : (
          <EmptySlider />
        )}
      </div>
      {favouriteMovies.length > 5 ? (
        <Pagination {...paginateFavouriteMovies} />
      ) : (
        ""
      )}
    </>
  );
};

export default Cmovies;
