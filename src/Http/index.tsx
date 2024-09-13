import axios from "axios";

const http = axios.create({
  baseURL: "https://localhost:7077/api/",
});

export default http;
