import React, { PropsWithChildren, useContext } from "react";
import { TypeModal } from "../../../types/global";
import "./styles.css";
import { createMovie } from "../../../services/movieService";
import { ModalObjectInfoContext } from "../../../pages/Admin/page";

interface IProps {
  type: TypeModal;
  isOpen: boolean;
  closeModal: () => void;
}

const ModalWrapper: React.FC<PropsWithChildren<IProps>> = ({
  children,
  type,
  isOpen,
  closeModal,
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

  const handleFetchingData = async () => {
    const data = await createMovie(modalContext.objectData);
    if (data) {
      setMessage(data.message)
      setTimeout(() => {
        setMessage(null);
        closeModal();
      }, 2000)
    };
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
