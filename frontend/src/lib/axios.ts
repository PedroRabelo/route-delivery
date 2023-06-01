import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9090",
  //baseURL: "http://54.225.112.74:9090",
});
