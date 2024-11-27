import ModalWrapper from "../ModalWrapper/ModalWrapper";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalDelete: React.FC<IProps> = ({ isOpen, closeModal }) => {
  return (
    <ModalWrapper type="delete" isOpen={isOpen} closeModal={closeModal}>
      <div className="modal-group">
        <label className="modal-label">Название фильма</label>
        <input
          name="deleteMovie"
          type="text"
          className="modal-input"
          required
        />
      </div>
    </ModalWrapper>
  );
};

export default ModalDelete;
