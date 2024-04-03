import { getItem, setItem } from "@/helpers/localStorage";
import axios from "axios";
import router from "@/router";
axios.defaults.baseURL = "http://localhost:3000/api/v1";

axios.interceptors.request.use((config) => {
   config.headers.Authorization = "Bearer " + getItem("token");
   return config;
});
let refresh = false;
axios.interceptors.response.use(
   (resp) => resp,
   async (error) => {
      if (error.response.status === 401 && !refresh) {
         refresh = true;
         await axios
            .post(
               "auth/refresh",
               {},
               {
                  withCredentials: true,
               }
            )
            .then((res) => {
               if (res.status === 200) {
                  setItem("token", res.data.token);
               }
            })
            .catch((err) => {
               if (err.response.status === 401) {
                  router.push("/login");
               }
            });
      }
      refresh = false;
      return Promise.reject(error);
   }
);
// axios.interceptors.response.use(null,error=>{
// 	let path = '/error';
// 	switch (error.response.status) {
// 		case 401: path = '/login'; break;
// 	 }
// 	 if(path ==='/login')router.push(path);
// 	 return Promise.reject(error);
// })
export default axios;
