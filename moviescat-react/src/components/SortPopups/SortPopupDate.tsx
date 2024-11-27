import React, {  useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setOtherSort } from "../../redux/slices/filter";
import { setLoaded } from "../../redux/slices/moviesSlice";
import useClickOutside from "../hooks/useClickOutside";

interface OtherParametrsType {
  items: {
    name: string;
    typeParams: string;
    order: string;
  }[];
  activeObj: {
    name: string;
    typeParams: string;
    order: string;
  };
}

const SortPopupDate: React.FC<OtherParametrsType> = ({ items, activeObj }) => {
  const dispatch = useDispatch();
  const refDateMenu = useRef<HTMLDivElement>(null);
  const [menuDateActive, setMenuDateActive] = useState(false);

  useClickOutside(refDateMenu, setMenuDateActive, menuDateActive);

  const onClickSortItem = (name: string, typeParams: string, order: string) => {
    dispatch(setLoaded(false));
    dispatch(setOtherSort({ name, typeParams, order }));
    setMenuDateActive(false);
  };

  return (
    <div className="movies__date" ref={refDateMenu}>
      <div
        className="movies__date-btn sort"
        onClick={() => setMenuDateActive(!menuDateActive)}
      >
        {activeObj.name}
      </div>
      <div className="sort__popup date-menu">
        {menuDateActive && (
          <ul className="movies__list">
            {items.map((obj, index) => (
              <li key={`key__${index}`} className="movies__list-link">
                <span
                  onClick={() =>
                    onClickSortItem(obj.name, obj.typeParams, obj.order)
                  }
                >
                  {obj.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SortPopupDate;
