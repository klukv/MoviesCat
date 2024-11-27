import React from "react";

interface UsePaginationProps {
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  firstContentIndex: number;
  lastContentIndex: number;
  page: number;
}

const Pagination: React.FC<UsePaginationProps> = React.memo(({
  firstContentIndex,
  lastContentIndex,
  nextPage,
  prevPage,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="movies__pagination">
      <div className="movies__pagination-inner">
        <span className="movies__pagination-btn" onClick={prevPage}>
          <svg
            className="pagination-left"
            viewBox="0 0 96 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title />
            <path d="M39.3756,48.0022l30.47-25.39a6.0035,6.0035,0,0,0-7.6878-9.223L26.1563,43.3906a6.0092,6.0092,0,0,0,0,9.2231L62.1578,82.615a6.0035,6.0035,0,0,0,7.6878-9.2231Z" />
          </svg>
        </span>
        {[...new Array(totalPages)].map((_, index) => (
          <span
            key={`${index}__keySpan`}
            className={
              page === index + 1
                ? "movies__pagination-btn active"
                : "movies__pagination-btn"
            }
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </span>
        ))}
        <span className="movies__pagination-btn" onClick={nextPage}>
          <svg
            className="pagination-right"
            viewBox="0 0 96 96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title />
            <path d="M69.8437,43.3876,33.8422,13.3863a6.0035,6.0035,0,0,0-7.6878,9.223l30.47,25.39-30.47,25.39a6.0035,6.0035,0,0,0,7.6878,9.2231L69.8437,52.6106a6.0091,6.0091,0,0,0,0-9.223Z" />
          </svg>
        </span>
      </div>
    </div>
  );
});

export default Pagination;
