import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref } from "vue";
import { useConversationStore } from "./conversation.store";

export const useSocketStore = defineStore("socket", () => {
   const isConnected = ref(false);
   const arrivedMessage = ref<any>(null);
   const onlineUsers = ref<any>([]);
   const URL: string =
      process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
   const conversationStore = useConversationStore();
   const socket = io(URL);
   function addUser(id: number) {
      socket.emit("addUser", id);
   }
   function getOnlineUsers() {
      socket.on("getUsers", (users) => {
         console.log(users);
         onlineUsers.value = users.map((u: any) => u.userId);
      });
   }
   function sendMessage(data: any) {
      console.log("called sendMessage");
      socket.emit("sendMessage", data);
   }
   function getMessage() {
      console.log("called getMessage");
      socket.on("getMessage", (data) => {
         arrivedMessage.value = {
            text: data.text,
            sender: {
               id: data.senderId,
            },
            createdAt: Date.now(),
         };
         conversationStore.setMessage(arrivedMessage.value);
      });
   }
   // function connect() {
   //    socket.connect();
   // }
   return {
      isConnected,
      arrivedMessage,
      onlineUsers,
      addUser,
      getOnlineUsers,
      sendMessage,
      getMessage,
   };
});
