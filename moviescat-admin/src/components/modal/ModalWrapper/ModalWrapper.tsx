import { PropsWithChildren } from "react";
import { TypeModal } from "../../../types/global";
import "./styles.css";

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

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <form className="modal-form" onClick={(e) => e.stopPropagation()}>
            <h1 className="modal-title">{determineButtonText()[1]}</h1>
            <div className="modal-content">{children}</div>
            <button className="button-modal">{determineButtonText()[0]}</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ModalWrapper;
