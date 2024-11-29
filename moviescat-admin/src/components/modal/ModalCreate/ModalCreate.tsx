import React, { useContext } from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { IDropdownSelectItem } from "../../../types/admin";
import { stateDropdown } from "../../../const/global";
import Multiselect from "multiselect-react-dropdown";
import { ModalObjectInfoContext } from "../../../pages/Admin/page";
import { ModalContextTypes } from "../../../types/global";
import { IMovieWithoutId } from "../../../types/movie";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ModalCreate: React.FC<IProps> = ({ isOpen, closeModal }) => {
  const modalContext = useContext(ModalObjectInfoContext);

  const onSelect = (selectedList: IDropdownSelectItem[]) => {
    const ListToString = selectedList.map((genre) => genre.name).join(",");
    handleChangeField("genre", ListToString);
  };

  const handleChangeField = (name: string, value: number | string) => {
    if (modalContext?.type === ModalContextTypes.CREATE)
      modalContext.setObjectData({
        ...modalContext.objectData,
        [name]: value,
      } as IMovieWithoutId);
  };

  return (
    <ModalWrapper type="create" isOpen={isOpen} closeModal={closeModal}>
      <div className="modal-group">
        <label className="modal-label">Название фильма</label>
        <input
          name="title"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("title", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Описание фильма</label>
        <input
          name="description"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("description", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Год создания</label>
        <input
          name="year"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("year", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Страна</label>
        <input
          name="country"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("country", e.target.value)}
        />
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
        <input
          name="director"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("director", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Время</label>
        <input
          name="time"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("time", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Бюджет</label>
        <input
          name="budget"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("budget", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Ссылка на постер</label>
        <input
          name="imgUrl"
          type="text"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("imgUrl", e.target.value)}
        />
      </div>
      <div className="modal-group">
        <label className="modal-label">Тип</label>
        <select
          name="type"
          className="modal-input"
          required
          onChange={(e) => handleChangeField("type", e.target.value)}>
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
