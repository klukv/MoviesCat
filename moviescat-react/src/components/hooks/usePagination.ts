import React from "react";

interface UsePaginationProps {
  contentPerPage: number;
  count: number;
}

interface UsePaginationReturn {
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  firstContentIndex: number;
  lastContentIndex: number;
  page: number;
}

const usePagination = ({
  contentPerPage,
  count,
}: UsePaginationProps): UsePaginationReturn => {
  const [page, setPage] = React.useState(1);

  const pageCount = Math.ceil(count / contentPerPage);

  const lastContentIndex = page * contentPerPage;

  const firstContentIndex = lastContentIndex - contentPerPage;

  const changePage = (direction: boolean) => {
    setPage((state) => {
      if (direction) {
        if (state === pageCount) {
          return state;
        }
        return state + 1;
      } else {
        if (state === 1) {
          return state;
        }
        return state - 1;
      }
    });
  };
  const setPageSAFE = (num: number) => {
    if (num > pageCount) {
      setPage(pageCount);
    } else if (num < 1) {
      setPage(1);
    } else {
      setPage(num);
    }
  };
  React.useEffect(() => {
    if (page > pageCount) {
      setPage(1);
    }
  }, [page, pageCount]);
  return {
    totalPages: pageCount === Infinity ? 0 : pageCount,
    nextPage: () => changePage(true),
    prevPage: () => changePage(false),
    setPage: setPageSAFE,
    firstContentIndex,
    lastContentIndex,
    page,
  };
};

export default usePagination;
