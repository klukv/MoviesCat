import React, { useState } from "react";
import { ModalCreate, ModalDelete, ModalUpdate } from "../../components/modal";
import { TypeModal } from "../../types/global";
import "./styles.css";

const AdminPage: React.FC = () => {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);

  const changeStateModal = (type: TypeModal, state: true | false) => {
    switch (type) {
      case "create":
        setIsOpenModalCreate(state);
        break;
      case "update":
        setIsOpenModalUpdate(state);
        break;
      case "delete":
        setIsOpenModalDelete(state);
        break;
    }
  };

  return (
    <>
      <div className="admin">
        <div className="admin__inner">
          <h2 className="admin__title">Панель администратора</h2>
          <ul className="admin__menu">
            <li className="admin__menu-list">
              <button
                className="admin__btn"
                onClick={() => changeStateModal("create", true)}>
                <span>Добавить фильм</span>
              </button>
            </li>
            <li className="admin__menu-list">
              <button
                className="admin__btn mod__btn"
                onClick={() => changeStateModal("update", true)}>
                <span>Редактировать фильм</span>
              </button>
            </li>
            <li className="admin__menu-list">
              <button
                className="admin__btn mod__btn"
                onClick={() => changeStateModal("delete", true)}>
                <span>Удалить фильм</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <ModalCreate
        isOpen={isOpenModalCreate}
        closeModal={() => changeStateModal("create", false)}
      />
      <ModalUpdate
        isOpen={isOpenModalUpdate}
        closeModal={() => changeStateModal("update", false)}
      />
      <ModalDelete
        isOpen={isOpenModalDelete}
        closeModal={() => changeStateModal("delete", false)}
      />
    </>
  );
};

export default AdminPage;
