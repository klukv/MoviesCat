import { useContext } from "react";
import { ModalContextTypes } from "../../../types/global";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { ModalObjectInfoContext } from "../../../pages/Admin/page";
import { IMovie } from "../../../types/movie";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  movies: IMovie[];
}

const ModalDelete: React.FC<IProps> = ({ isOpen, closeModal, movies }) => {
  const modalContext = useContext(ModalObjectInfoContext);

  const handleChangeField = (removeId: number) => {
    if (modalContext?.type === ModalContextTypes.DELETE)
      modalContext.setSelectRemovingId(removeId);
  };

  return (
    <ModalWrapper type="delete" isOpen={isOpen} closeModal={closeModal}>
      <div className="modal-group">
        <label className="modal-label">Название фильма</label>
        <select
          name="deleteMovie"
          className="modal-input"
          required
          onChange={(e) => handleChangeField(Number(e.target.value))}>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>
    </ModalWrapper>
  );
};

export default ModalDelete;
