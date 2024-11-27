import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { register } from "../services/userService";

import "../scss/loginORsignup.scss";
import { Link } from "react-router-dom";
import { login } from "../const/const";

interface State {
  username: string;
  email: string;
  password: string;
  roles: string[];
  successful: boolean;
  message: string;
}

const initialValues = {
  username: "",
  email: "",
  password: "",
  roles: [],
  successful: false,
  message: "",
};



const Signup: React.FC = () => {
  const [user, setUser] = React.useState<State>(initialValues);
  const handleRegister = async (formValue: {
    username: string;
    email: string;
    password: string;
    roles: string[];
  }) => {
    const { username, email, password, roles } = formValue;

    setUser((prevState) => {
      return {
        ...prevState,
        message: "",
        successful: false,
      };
    });

    register(username, email, password, roles).then(
      (data) => {
        setUser((prevState) => {
          return {
            ...prevState,
            message: data.message,
            successful: true,
          };
        });
      },
      ({ response }) => {
        const resMessage =
          (response && response.data && response.data.message) ||
          response.message ||
          response.toString();
        console.log(response);

        setUser((prevState) => {
          return {
            ...prevState,
            message: resMessage,
            successful: false,
          };
        });
      }
    );
  };

  return (
    <div className="main auth">
      <div className="col-md-12">
        <div className="card card-container auth__container">
          <Formik initialValues={initialValues} onSubmit={handleRegister}>
            <Form className="auth__form">
              <h1 className="auth__title">Регистрация</h1>
              {!user.successful && (
                <>
                  <div className="form-group group">
                    <Field
                      name="username"
                      type="text"
                      className="form-control auth__values"
                      required
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className="auth__name"> Имя пользователя </label>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group group">
                    <Field
                      name="email"
                      type="email"
                      className="form-control auth__values"
                      required
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className="auth__name"> Электронная почта </label>
                  </div>

                  <div className="form-group group">
                    <Field
                      name="password"
                      type="password"
                      className="form-control auth__values"
                      required
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className="auth__name"> Пароль </label>
                  </div>
                  <div id="checkbox-group title-check" className="title-check">
                    Роль
                  </div>
                  <div
                    role="group"
                    aria-labelledby="checkbox-group"
                    className="reg__role-group"
                  >
                    <label>
                      <Field
                        type="checkbox"
                        name="roles"
                        value="user"
                        className="reg__role"
                      />
                      Пользователь
                    </label>
                    <label>
                      <Field
                        type="checkbox"
                        name="roles"
                        value="mod"
                        className="reg__role"
                      />
                      Модератор
                    </label>
                    <label>
                      <Field
                        type="checkbox"
                        name="roles"
                        value="admin"
                        className="reg__role last-child"
                      />
                      Администратор
                    </label>
                  </div>

                  <div className="form-group button-reg">
                    <button type="submit" className="btn btn-primary btn-block">
                      Зарегистрироваться
                    </button>
                  </div>
                </>
              )}

              {user.message && (
                <div className="form-group">
                  <div
                    className={
                      user.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {user.message}
                  </div>
                  {user.successful && (
                    <div className="success__link">
                      <Link className="btn" to={login}>
                        Авторизироваться
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default Signup;
