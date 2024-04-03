import axios from "./axios";
const MessageService = {
   createMessage(data: any) {
      return axios.post("/messages", data);
   },
};

export default MessageService;
