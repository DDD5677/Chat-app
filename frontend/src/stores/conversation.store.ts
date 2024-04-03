import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ConversationService from "@/server/conversation";
import { useAuthStore } from "./auth.store";
import MessageService from "@/server/message";
import UserService from "@/server/user";

export const useConversationStore = defineStore("conversation", () => {
   const conversation = ref<any>([]);
   const messages = ref<any>([]);
   const isLoading = ref(true);
   const searchedUsers = ref<any | null>(null);
   const errors = ref<any | null>(null);
   const authStore = useAuthStore();

   const chatWith = computed(() =>
      conversation.value?.users.find(
         (user: any) => user.id !== authStore.user.id
      )
   );
   const resetSearchedUsers = () => {
      searchedUsers.value = [];
      console.log("reset");
   };

   const setMessage = (message: any) => {
      console.log(message);
      messages.value = [...messages.value, message];
      console.log(messages.value);
   };

   function getOneConversation(id: string) {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         conversation.value = null;
         messages.value = null;
         errors.value = null;
         ConversationService.getOneConversation(id)
            .then((response) => {
               isLoading.value = false;
               conversation.value = response.data;
               messages.value = response.data.messages;
               resolve(response.data);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
            });
      });
   }
   function createConversation(data: any) {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         conversation.value = null;
         errors.value = null;
         ConversationService.createConversation(data)
            .then((response) => {
               isLoading.value = false;
               conversation.value = response.data;
               resolve(response.data);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
            });
      });
   }
   function sendMessage(data: any) {
      return new Promise((resolve, reject) => {
         //isLoading.value = true;
         errors.value = null;
         MessageService.createMessage(data)
            .then((response) => {
               //isLoading.value = false;
               resolve(response.data);
            })
            .catch((error) => {
               //isLoading.value = false;
               errors.value = error.response.data;
            });
      });
   }
   function getUsers(data: any) {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         errors.value = null;
         UserService.getUsers(data)
            .then((response) => {
               isLoading.value = false;
               searchedUsers.value = response.data;
               resolve(response.data);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
            });
      });
   }
   return {
      isLoading,
      conversation,
      messages,
      getOneConversation,
      chatWith,
      sendMessage,
      getUsers,
      searchedUsers,
      resetSearchedUsers,
      createConversation,
      setMessage,
   };
});
