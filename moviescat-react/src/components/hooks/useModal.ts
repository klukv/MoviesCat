import React from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = React.useState(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const toggleUpdateModal = () => {
    setIsOpenUpdate(!isOpenUpdate)
  }
  const toggleDeleteModal = () => {
    setIsOpenDelete(!isOpenDelete)
  }
  return {
    isOpen,
    toggle,
    isOpenUpdate,
    toggleUpdateModal,
    isOpenDelete,
    toggleDeleteModal
  };
};

export default useModal;
