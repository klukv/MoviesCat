import ModalWrapper from "../ModalWrapper/ModalWrapper";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalUpdate: React.FC<IProps> = ({ isOpen, closeModal }) => {
  return (
    <ModalWrapper type="update" isOpen={isOpen} closeModal={closeModal}>
      <div className="modal-group">
        <label className="modal-label">Название фильма</label>
        <input name="titleMovie" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Пункт, который хотите отредактировать</label>
        <select name="nameValue" className="modal-input" required>
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
        <input name="editValue" type="text" className="modal-input" required />
      </div>
    </ModalWrapper>
  );
};

export default ModalUpdate;
