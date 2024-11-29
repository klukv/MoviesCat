import React, { PropsWithChildren, useContext } from "react";
import { ModalContextTypes, TypeModal } from "../../../types/global";
import "./styles.css";
import {
  createMovie,
  deleteMovie,
  editMovie,
} from "../../../services/movieService";
import { ModalObjectInfoContext } from "../../../pages/Admin/page";
import { IMovie } from "../../../types/movie";

interface IProps {
  type: TypeModal;
  isOpen: boolean;
  closeModal: () => void;
  movies?: IMovie[];
}

const ModalWrapper: React.FC<PropsWithChildren<IProps>> = ({
  children,
  type,
  isOpen,
  closeModal,
  movies
}) => {
  const [message, setMessage] = React.useState<string | null>(null);

  const determineButtonText = () => {
    switch (type) {
      case "create":
        return ["Создать", "Создание фильма/сериала"];
      case "update":
        return ["Обновить", "Обновление фильма/сериала"];
      case "delete":
        return ["Удалить", "Удаление фильма/сериала"];
    }
  };

  const modalContext = useContext(ModalObjectInfoContext);

  const handleResponse = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
      closeModal();
    }, 2000);
  };

  const handleFetchingData = async () => {
    switch (modalContext?.type) {
      case ModalContextTypes.CREATE: {
          const data = await createMovie(modalContext.objectData);
          if (data) handleResponse(data.message);
        }
        break;
      case ModalContextTypes.EDIT: {
          const selectMovie = movies!.find(
            (movie) =>
              movie.id === modalContext.movieEditOption!.movieId
          );
          const newMovie = {
            ...selectMovie!,
            [modalContext.movieEditOption!.changingField]:
              modalContext.movieEditOption!.value,
          };

          const data = await editMovie(newMovie);
          if (data) handleResponse(data.message);
        }
        break;
      case ModalContextTypes.DELETE: {
          const data = await deleteMovie(modalContext.selectRemovingId);
          if (data) handleResponse(data.message);
        }
        break;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <form className="modal-form" onClick={(e) => e.stopPropagation()}>
            {!message ? (
              <>
                <h1 className="modal-title">{determineButtonText()[1]}</h1>
                <div className="modal-content">{children}</div>
                <button
                  type="button"
                  className="button-modal"
                  onClick={handleFetchingData}>
                  {determineButtonText()[0]}
                </button>
              </>
            ) : (
              <div className="response_message">{message}</div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default ModalWrapper;
