import React from "react";
import debounce from "lodash.debounce";
import { searchContext } from "../App";

const Search: React.FC = () => {
  const { setSearchValue } = React.useContext(searchContext);
  const [valueInput, setValueInput] = React.useState("");
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(event.target.value);
    updateChangeInput(event.target.value);
  };

  const updateChangeInput = React.useCallback(
    debounce((str) => {
      setSearchValue(str);
    }, 700),
    []
  );
  return (
    <div className="header__link search">
      {/* <img src={search} alt="search" /> */}
      <div className="container_search">
        <input
          value={valueInput}
          type="text"
          placeholder="Поиск..."
          onChange={(event) => onChangeInput(event)}
        />

        <div className="search-btn"></div>
      </div>
    </div>
  );
};

export default Search;
