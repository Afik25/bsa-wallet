import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_SERVER_URL}:${process.env.REACT_APP_API_SERVER_PORT}/api/v1`;

export default axios.create({ baseURL: BASE_URL });
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
