import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialData } from "./ModalUpdate";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { RootState } from "../../redux/store";
import { deleteFilm } from "../../services/contentService";
import { setStateFMovies } from "../../redux/slices/moviesSlice";
import { movieType } from "../../types/movieType";
import { Idata } from "../../types/dataType";
import { selectUserIdArrayVideos } from "../../redux/selectors";

interface IModal {
  isOpen: boolean;
  toggle: () => void;
}
const initialValues = {
  deleteMovie: "",
};

const ModalDelete: React.FC<IModal> = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const [dataMessage, setDataMessage] = React.useState<Idata>(initialData);
  const { arrayMovies } = useSelector(selectUserIdArrayVideos);

  const handleDeleteMovie = (formValue: { deleteMovie: string }) => {
    const { deleteMovie } = formValue;

    const idDeleteMovie = arrayMovies.find((movie: movieType) => {
      return movie.title === deleteMovie;
    })?.id;

    if (idDeleteMovie) {
      deleteFilm(idDeleteMovie).then(
        (data) => {
          setDataMessage((prevState) => {
            return {
              ...prevState,
              message: data.message,
              success: true,
            };
          });
          dispatch(setStateFMovies(true))
        },
        ({response}) => {
          const resMessage =
            (response &&
              response.data &&
              response.data.message) ||
            response.message ||
            response.toString();
  
          setDataMessage((prevState) => {
            return {
              ...prevState,
              message: resMessage,
              success: false,
            };
          });
        }
      );
      
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={toggle}>
          <Formik initialValues={initialValues} onSubmit={handleDeleteMovie}>
            <Form className="modal-form modal-delete" onClick={(e) => e.stopPropagation()}>
              {!dataMessage.success && (
                <>
                  <div className="modal-group">
                    <Field
                      name="deleteMovie"
                      type="text"
                      className="modal-input"
                      required
                    />
                    <label className="modal-label">Название фильма</label>
                    <ErrorMessage
                      name="deleteMovie"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="modal-group">
                    <button
                      type="submit"
                      className="btn-primary btn-block button-modal"
                    >
                      <span>Удалить бедолагу</span>
                    </button>
                  </div>
                </>
              )}

              {dataMessage.message && (
                <div className="modal-group">
                  <div className="alert alert-danger" role="alert">
                    {dataMessage.message}
                  </div>
                </div>
              )}
              {dataMessage.success && (
                    <button className="btn_success admin__btn" onClick={toggle}>
                      Закрыть
                    </button>
                  )}
            </Form>
          </Formik>
        </div>
      )}
    </>
  );
};

export default ModalDelete;
