import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import { EmptySlider, MovieComponent } from "../components";
import useModal from "../components/hooks/useModal";
import Modal from "../components/ModalWindows/ModalСreate";
import { fetchLikeMovies } from "../redux/slices/moviesSlice";
import { fetchLikeSerials } from "../redux/slices/serialsSlice";
import "../scss/personalAccount.scss";
import ModalUpdate from "../components/ModalWindows/ModalUpdate";
import ModalDelete from "../components/ModalWindows/ModalDelete";
import { IDropdownSelectItem, movieType } from "../types/movieType";
import { logoutUser } from "../redux/slices/user";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { home, likeMovies, likeSerials } from "../const/const";
import Multiselect from "multiselect-react-dropdown";
import { serialType } from "../types/serialsType";
import { selectInfoPersonAcc, selectUser } from "../redux/selectors";
import { AppDispatch } from "../redux/store";
import { allVideos } from "../types/userType";

type TActiveList = {
  isShow: boolean;
  activeMovies: boolean;
  activeSerials: boolean;
};
type TpropsRVideos = {
  allRecentlyVideos: allVideos[]
}

const initialValues = {
  isShow: false,
  activeMovies: false,
  activeSerials: false,
};

const premiumRoles = ["ROLE_ADMIN", "ROLE_MODERATOR"];

const stateDropdown = {
  options: [
    { name: "драма", id: 0 },
    { name: "комедия", id: 1 },
    { name: "приключения", id: 2 },
    { name: "боевик", id: 3 },
    { name: "триллер", id: 4 },
  ],
};


const RecentlyListVideos: React.FC<TpropsRVideos> = React.memo(
  ({ allRecentlyVideos }) => {
    return (
      <div className="person__watched-slider">
        {allRecentlyVideos.length !== 0 ? (
          allRecentlyVideos.map(
            (video: movieType | serialType, index: number) => (
              <MovieComponent key={`${video.id}${index}`} {...video} />
            )
          )
        ) : (
          <EmptySlider />
        )}
      </div>
    );
  }
);

const PersonalAC: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [activeList, setActiveList] =
    React.useState<TActiveList>(initialValues);
  const [selectedGenres, setSelectedGenres] =
    React.useState<string>("не вышел");
  const {
    isOpen,
    toggle,
    isOpenUpdate,
    toggleUpdateModal,
    isOpenDelete,
    toggleDeleteModal,
  } = useModal();
  const { allRecentlyVideos, isAddedFMovie, isAddedFSerial } =
    useSelector(selectInfoPersonAcc); 
  const { user } = useSelector(selectUser);
  const isAdmin: boolean = user.roles.includes("ROLE_ADMIN");
  const isAdminOrMod =
    user.roles.find((role: string) => {
      return premiumRoles.includes(role);
    }) !== undefined
      ? true
      : false;

  const logoutAcc = async () => {
    await dispatch(logoutUser());
    navigate(home);
    window.location.reload();
  };

  const onSelect = (selectedList: IDropdownSelectItem[]) => {
    const ListToString = selectedList.map((genre) => genre.name).join(",");
    setSelectedGenres(ListToString);
  };

  const handleClickList = (value: boolean, type?: number) => {
    setActiveList((state) => {
      switch (type) {
        case 0:
          return {
            ...state,
            isShow: value,
            activeMovies: true,
            activeSerials: false,
          };
        case 1:
          return {
            ...state,
            isShow: value,
            activeMovies: false,
            activeSerials: true,
          };
        default:
          return {
            ...state,
            isShow: initialValues.isShow,
            activeMovies: initialValues.activeMovies,
            activeSerials: initialValues.activeSerials,
          };
      }
    });
  };

  React.useEffect(() => {
    if (isAddedFMovie) {
      dispatch(fetchLikeMovies(user.id));
    }

    if (isAddedFSerial) {
      dispatch(fetchLikeSerials(user.id));
    }
  }, [isAddedFMovie, isAddedFSerial, dispatch, user.id]);

  return (
    <div className="main main__person">
      <main>
        {isAdminOrMod && (
          <div className="admin">
            <div className="admin__inner">
              <h2 className="admin__title">Панель администратора</h2>
              <ul className="admin__menu">
                {isAdmin && (
                  <>
                    <li className="admin__menu-list">
                      <button className="admin__btn" onClick={toggle}>
                        Добавить фильм
                      </button>
                    </li>
                    <li className="admin__menu-list">
                      <button
                        className="admin__btn mod__btn"
                        onClick={toggleDeleteModal}
                      >
                        <span>Удалить фильм</span>
                      </button>
                    </li>
                  </>
                )}

                <li className="admin__menu-list">
                  <button
                    className="admin__btn mod__btn"
                    onClick={toggleUpdateModal}
                  >
                    <span>Редактировать фильм</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="person">
          <div className="container">
            <div className="person__inner">
              <div className="person__row">
                <div className="person__block-img"></div>
                <div className="person__info">
                  <div className="person__info-name avatar__title">
                    {user.username}
                  </div>
                  <a href="#1" className="person__info-mail">
                    {user.email}
                  </a>
                  <svg
                    onClick={logoutAcc}
                    className="person__info-logout"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M21 12L13 12"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                      <path
                        d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <div className="person__row-compilation">
                  <div className="person__row-inner">
                    <h2 className="person__row-title">Любимые</h2>
                    <ul className="person__row-menu">
                      <li className="person__row-point ">
                        <Link
                          to={likeMovies}
                          className={
                            activeList.activeMovies
                              ? "person__row-link link-movies active"
                              : "person__row-link link-movies"
                          }
                          onClick={() => handleClickList(true, 0)}
                        >
                          Фильмы
                        </Link>
                      </li>
                      <li className="person__row-point ">
                        <Link
                          to={likeSerials}
                          className={
                            activeList.activeSerials
                              ? "person__row-link link-serials active"
                              : "person__row-link link-serials"
                          }
                          onClick={() => handleClickList(true, 1)}
                        >
                          Сериалы
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="person__watched">
                <h2 className="person__watched-title avatar__title">
                  Недавно просмотренные
                </h2>
                <RecentlyListVideos
                  allRecentlyVideos={allRecentlyVideos}
                />
              </div>
              {activeList.isShow && (
                <div className="person__compilation">
                  <div className="person__compilation-header">
                    <h2 className="person__compilation-title avatar__title">
                      Любимые
                    </h2>
                    <svg
                      className="person__compilation-close"
                      width="97px"
                      height="97px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ffffff"
                      onClick={() => handleClickList(false)}
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <g id="SVGRepo_iconCarrier">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                          fill="#ffffff"
                        />
                      </g>
                    </svg>
                  </div>

                  <Outlet />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={isOpen} toggle={toggle} genres={selectedGenres}>
        <div className="modal__info">
          <div className="modal__one-block">
            <div className="modal-group">
              <Field
                name="title"
                type="text"
                className="modal-input"
                required
              />
              <label className="modal-label">Название фильма</label>
              <ErrorMessage
                name="title"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field
                name="description"
                type="text"
                className="modal-input"
                required
              />
              <label className="modal-label">Описание фильма</label>
              <ErrorMessage
                name="description"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field name="year" type="text" className="modal-input" required />
              <label className="modal-label">Год создания</label>
              <ErrorMessage
                name="year"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field
                name="country"
                type="text"
                className="modal-input"
                required
              />
              <label className="modal-label">Страна</label>
              <ErrorMessage
                name="country"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Multiselect
                options={stateDropdown.options}
                displayValue="name"
                placeholder="Введите жанр"
                onSelect={onSelect}
              />
            </div>
          </div>
          <div className="modal__second-block">
            <div className="modal-group">
              <Field
                name="director"
                type="text"
                className="modal-input"
                required
              />
              <label className="modal-label">Режиссёр</label>
              <ErrorMessage
                name="director"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field name="time" type="text" className="modal-input" required />
              <label className="modal-label">Время</label>
              <ErrorMessage
                name="time"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field
                name="budget"
                type="text"
                className="modal-input"
                required
              />
              <label className="modal-label">Бюджет</label>
              <ErrorMessage
                name="budget"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field
                name="imgUrl"
                type="text"
                className="modal-input"
                required
              />
              <label className="modal-label">Ссылка на постер</label>
              <ErrorMessage
                name="imgUrl"
                component="div"
                className="alert alert-danger"
              />
            </div>
            <div className="modal-group">
              <Field
                name="type"
                type="text"
                className="modal-input"
                as="select"
                required
              >
                <option value="default" disabled>
                  Тип
                </option>
                <option value="actual">Актуальное</option>
                <option value="popular">Популярное</option>
              </Field>
            </div>
          </div>
        </div>

        <div className="modal-group btn-modal">
          <button type="submit" className=" btn-primary button-modal ">
            <span>Добавить</span>
          </button>
        </div>
      </Modal>
      <ModalUpdate isOpen={isOpenUpdate} toggle={toggleUpdateModal} />
      <ModalDelete isOpen={isOpenDelete} toggle={toggleDeleteModal} />
    </div>
  );
};

export default PersonalAC;
