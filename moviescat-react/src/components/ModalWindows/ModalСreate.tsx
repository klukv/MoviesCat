import React from "react";
import { Formik, Form } from "formik";
import { createMovie } from "../../services/contentService";
import debounce from "lodash.debounce";
import { initialData } from "./ModalUpdate";
import { IMovieData } from "../../types/movieType";
import { Idata } from "../../types/dataType";

interface Iprops {
  children?: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  genres: string;
}

const initialValues = {
  title: "",
  description: "",
  year: 0,
  country: "",
  genres: "",
  director: "",
  time: 0,
  budget: 0,
  imgUrl: "",
  type: "",
};

const Modal: React.FC<Iprops> = ({ children, isOpen, toggle, genres }) => {
  const [dataMessage, setDataMessage] = React.useState<Idata>(initialData);
  const clearDataMessage = React.useCallback(
    debounce(() => {
      setDataMessage((prevState) => {
        return {
          ...prevState,
          message: initialData.message,
          success: initialData.success,
        };
      });
    }, 3000),
    []
  );
  const handleSubmitMovie = (formValue: IMovieData) => {
    const {
      title,
      description,
      year,
      country,
      director,
      time,
      budget,
      imgUrl,
      type,
    } = formValue;
    createMovie({
      title,
      description,
      year,
      country,
      genres,
      director,
      time,
      budget,
      imgUrl,
      type,
    }).then(
      (data) => {
        setDataMessage((prevState) => {
          return {
            ...prevState,
            message: data.message,
            success: true,
          };
        });
        clearDataMessage();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setDataMessage((prevState) => {
          return {
            ...prevState,
            message: resMessage,
            success: false,
          };
        });
        clearDataMessage();
      }
    );
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={toggle}>
          <Formik initialValues={initialValues} onSubmit={handleSubmitMovie}>
            <Form className="modal-form" onClick={(e) => e.stopPropagation()}>
              {children}
              {dataMessage.message && (
                <div className="modal-group">
                  <div className="alert alert-danger" role="alert">
                    {dataMessage.message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      )}
    </>
  );
};

export default Modal;
