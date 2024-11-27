import { API_URL_AUTH, login, signup } from "../const/const";
import { $host } from "./authService";

export const signin = async (username: string, password: string) => {
  const { data } = await $host.post(API_URL_AUTH + login, {
    username,
    password,
  });
  localStorage.setItem("token", data.token);
  return data;
};

export const register = async (
  username: string,
  email: string,
  password: string,
  roles: string[]
) => {
  const { data } = await $host.post(API_URL_AUTH + signup, {
    username,
    email,
    password,
    roles,
  });
  return data;
};

