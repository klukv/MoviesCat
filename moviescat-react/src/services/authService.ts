import axios, { AxiosRequestConfig } from "axios"
import { API_URL } from "../const/const"

const token = localStorage.getItem("token");

const $host = axios.create({
  baseURL: API_URL
})

const $authHost = axios.create({
  baseURL: API_URL
})

const authInterceptor = (config:AxiosRequestConfig) => {
  if(config.headers){
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
}

$authHost.interceptors.request.use(authInterceptor);

export {
  $host,
  $authHost
}