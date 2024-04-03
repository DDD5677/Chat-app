import axios from "./axios";
const ConversationService = {
   getOneConversation(id: string) {
      return axios.get(`/conversations/${id}`);
   },
   createConversation(data: any) {
      return axios.post("/conversations", data);
   },
};

export default ConversationService;
