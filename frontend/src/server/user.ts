import axios from "./axios";
const UserService = {
   getUsers(payload: any) {
      return axios.get("/users", {
         params: {
            search: payload.search,
            userId: payload.userId,
         },
      });
   },
};

export default UserService;
