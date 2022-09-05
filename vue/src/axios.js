import axios from "axios";
import store from "./store";

//Laravel's API
const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

//interceptors - specijalne funkcije koje koristimo pre nego napravimo zahtev ili pre nego response bude
//"uzet od nas"
//svaki request koji axios napravi mora proci autorizaciju tokena
axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.state.user.token}`;
  //console.log("NNNNNN:" + config.headers.Authorization);
  return config;
});

export default axiosClient;
