import { useContext } from "react";
import { ModalObjectInfoContext } from "../../../pages/Admin/page";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { ModalContextTypes, MovieEditOptions } from "../../../types/global";
import { IMovie } from "../../../types/movie";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  movies: IMovie[];
}

const ModalUpdate: React.FC<IProps> = ({ isOpen, closeModal, movies }) => {
  const modalContext = useContext(ModalObjectInfoContext);
  const handleChangeField = (name: string, value: string | number) => {
    if (modalContext?.type === ModalContextTypes.EDIT) {
      modalContext.setMovieEditOption({
        ...modalContext.movieEditOption,
        [name]: value,
      } as MovieEditOptions);
    }
  };

  return (
    <ModalWrapper
      type="update"
      isOpen={isOpen}
      closeModal={closeModal}
      movies={movies}>
      <div className="modal-group">
        <label className="modal-label">Название фильма</label>
        <select
          name="titleMovie"
          className="modal-input"
          required
          onChange={(e) =>
            handleChangeField("movieId", Number(e.target.value))
          }>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>
      <div className="modal-group">
        <label className="modal-label">
          Пункт, который хотите отредактировать
        </label>
        <select
          name="changingField"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("changingField", e.target.value)}>
          <option value="default">Выберите пункт</option>
          <option value="title">Название фильма</option>
          <option value="description">Описание фильма</option>
          <option value="year">Год создания</option>
          <option value="country">Страна</option>
          <option value="genre">Жанр</option>
          <option value="director">Режиссёр</option>
          <option value="time">Время</option>
          <option value="budget">Бюджет</option>
          <option value="imgUrl">Ссылка на постер</option>
          <option value="type">Тип фильма</option>
        </select>
      </div>
      <div className="modal-group">
        <label className="modal-label">Введите изменения</label>
        <input
          name="editValue"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("value", e.target.value)}
        />
      </div>
    </ModalWrapper>
  );
};

export default ModalUpdate;
