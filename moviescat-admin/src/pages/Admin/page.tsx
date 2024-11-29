import React, { createContext, useEffect, useState } from "react";
import { ModalCreate, ModalDelete, ModalUpdate } from "../../components/modal";
import {
  IModalContext,
  ModalContextTypes,
  MovieEditOptions,
  TypeModal,
} from "../../types/global";
import "./styles.css";
import { IMovie, IMovieWithoutId } from "../../types/movie";
import { fetchAllMovies } from "../../services/movieService";

export const ModalObjectInfoContext = createContext<IModalContext | null>(null);

const AdminPage: React.FC = () => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);

  const [objectData, setObjectData] = React.useState<IMovieWithoutId | null>(
    null
  );
  const [movieEditOption, setMovieEditOption] =
    useState<MovieEditOptions | null>(null);
  const [selectRemovingId, setSelectRemovingId] = useState<number | null>(null);
  const [movies, setMovies] = useState<IMovie[]>([]);

  const changeStateModal = (type: TypeModal, state: true | false) => {
    switch (type) {
      case "create":
        setIsOpenModalCreate(state);
        break;
      case "update":
        setIsOpenModalUpdate(state);
        break;
      case "delete":
        setIsOpenModalDelete(state);
        break;
    }
  };

  useEffect(() => {
    if (movies.length === 0)
      fetchAllMovies().then((res) => setMovies(res));
  }, []);

  return (
    <>
      <div className="admin">
        <div className="admin__inner">
          <h2 className="admin__title">Панель администратора</h2>
          <ul className="admin__menu">
            <li className="admin__menu-list">
              <button
                className="admin__btn"
                onClick={() => changeStateModal("create", true)}>
                <span>Добавить фильм</span>
              </button>
            </li>
            <li className="admin__menu-list">
              <button
                className="admin__btn mod__btn"
                onClick={() => changeStateModal("update", true)}>
                <span>Редактировать фильм</span>
              </button>
            </li>
            <li className="admin__menu-list">
              <button
                className="admin__btn mod__btn"
                onClick={() => changeStateModal("delete", true)}>
                <span>Удалить фильм</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <ModalObjectInfoContext.Provider
        value={{ type: ModalContextTypes.CREATE, objectData, setObjectData }}>
        <ModalCreate
          isOpen={isOpenModalCreate}
          closeModal={() => changeStateModal("create", false)}
        />
      </ModalObjectInfoContext.Provider>
      <ModalObjectInfoContext.Provider
        value={{
          type: ModalContextTypes.EDIT,
          movieEditOption,
          setMovieEditOption,
        }}>
        <ModalUpdate
          isOpen={isOpenModalUpdate}
          closeModal={() => changeStateModal("update", false)}
          movies={movies}
        />
      </ModalObjectInfoContext.Provider>
      <ModalObjectInfoContext.Provider
        value={{
          type: ModalContextTypes.DELETE,
          selectRemovingId,
          setSelectRemovingId,
        }}>
        <ModalDelete
          movies={movies}
          isOpen={isOpenModalDelete}
          closeModal={() => changeStateModal("delete", false)}
        />
      </ModalObjectInfoContext.Provider>
    </>
  );
};

export default AdminPage;
