import axios from "./axios";
import type { User } from "@/types";
const AuthService = {
   register(user: User) {
      return axios.post("/auth/register", user);
   },
   login(user: object) {
      return axios.post("/auth/login", user, {
         withCredentials: true,
      });
   },
   logout() {
      return axios.post(
         "/auth/logout",
         {},
         {
            withCredentials: true,
         }
      );
   },
   getAuthorizedUser() {
      return axios.get("/auth/user");
   },
};

export default AuthService;
