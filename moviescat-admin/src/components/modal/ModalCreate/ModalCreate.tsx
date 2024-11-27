import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { IDropdownSelectItem } from "../../../types/admin";
import { stateDropdown } from "../../../const/global";
import Multiselect from "multiselect-react-dropdown";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalCreate: React.FC<IProps> = ({ isOpen, closeModal }) => {
  const [selectedGenres, setSelectedGenres] =
    React.useState<string>("не вышел");

  const onSelect = (selectedList: IDropdownSelectItem[]) => {
    const ListToString = selectedList.map((genre) => genre.name).join(",");
    setSelectedGenres(ListToString);
  };

  return (
    <ModalWrapper type="create" isOpen={isOpen} closeModal={closeModal}>
      <div className="modal-group">
        <label className="modal-label">Название фильма</label>
        <input name="title" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Описание фильма</label>
        <input
          name="description"
          type="text"
          className="modal-input"
          required
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Год создания</label>
        <input name="year" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Страна</label>
        <input name="country" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Жанр</label>
        <Multiselect
          options={stateDropdown.options}
          displayValue="name"
          placeholder="Введите жанр"
          onSelect={onSelect}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Режиссёр</label>
        <input name="director" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Время</label>
        <input name="time" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Бюджет</label>
        <input name="budget" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Ссылка на постер</label>
        <input name="imgUrl" type="text" className="modal-input" required />
      </div>
      <div className="modal-group">
        <label className="modal-label">Тип</label>
        <select name="type" className="modal-input" required>
          <option value="default" disabled>
            Тип
          </option>
          <option value="actual">Актуальное</option>
          <option value="popular">Популярное</option>
        </select>
      </div>
    </ModalWrapper>
  );
};

export default ModalCreate;
