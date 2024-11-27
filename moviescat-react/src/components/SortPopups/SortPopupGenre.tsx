import React, {  useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setGenreSort } from "../../redux/slices/filter";
import { setLoaded } from "../../redux/slices/moviesSlice";
import useClickOutside from "../hooks/useClickOutside";

interface genreType {
  items: {
    genre: string;
    type: string;
    order: string;
  }[];
  activeObj: {
    genre: string;
    type: string;
    order: string;
  };
}
const SortPopupGenre: React.FC<genreType> = ({ items, activeObj }) => {
  const dispatch = useDispatch();
  const refGenreMenu = useRef<HTMLDivElement>(null);
  const [menuGenreActive, setMenuGenreActive] = useState(false);

  useClickOutside(refGenreMenu, setMenuGenreActive, menuGenreActive);

  const onClickSortItem = (type: string, genre: string, order: string) => {
    dispatch(setLoaded(false));
    dispatch(setGenreSort({ type, genre, order }));
    setMenuGenreActive(false);
  };

  return (
    <div className="movies__genre" ref={refGenreMenu}>
      <div
        className="movies__genre-btn sort"
        onClick={() => setMenuGenreActive(!menuGenreActive)}
      >
        {activeObj.genre}
      </div>
      <div className="sort__popup">
        {menuGenreActive && (
          <ul className="movies__list">
            {items.map((obj, index) => (
              <li key={`key__${index}Genre`} className="movies__list-link">
                <span
                  onClick={() =>
                    onClickSortItem(obj.type, obj.genre, obj.order)
                  }
                >
                  {obj.genre}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SortPopupGenre;
