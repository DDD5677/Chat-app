import { computed, ref } from "vue";
import { defineStore } from "pinia";
import AuthService from "@/server/auth";
import type { User } from "@/types";
import { removeItem, setItem } from "@/helpers/localStorage";
import { useSocketStore } from "./socket.store";

export const useAuthStore = defineStore("auth", () => {
   const isLoading = ref(true);
   const user = ref<any | null>(null);
   const errors = ref<any | null>(null);
   const isLogged = ref(false);

   const conversations = computed(() => {
      return user.value?.conversations.map((conver: any) => {
         return {
            id: conver.id,
            partner: conver.users?.find((u: any) => u.id !== user.value.id),
         };
      });
   });

   function register(userData: User) {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         user.value = null;
         errors.value = null;
         AuthService.register(userData)
            .then((response) => {
               isLoading.value = false;
               user.value = response.data;
               resolve(response);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
               reject(error.response.data);
            });
      });
   }
   function login(userData: object) {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         user.value = null;
         errors.value = null;
         isLogged.value = false;
         AuthService.login(userData)
            .then((response) => {
               setItem("token", response.data.token);
               isLoading.value = false;
               user.value = response.data.user;
               isLogged.value = true;
               resolve(response.data.user);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
               reject(error.response.data);
            });
      });
   }
   const logout = () => {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         errors.value = null;
         AuthService.logout()
            .then((response) => {
               removeItem("token");
               isLoading.value = false;
               user.value = null;
               isLogged.value = false;
               resolve(true);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
            });
      });
   };
   function getAuthorizedUser() {
      return new Promise((resolve, reject) => {
         isLoading.value = true;
         errors.value = null;
         isLogged.value = false;
         AuthService.getAuthorizedUser()
            .then((response) => {
               isLoading.value = false;
               user.value = response.data.user;
               isLogged.value = true;
               resolve(response.data.user);
            })
            .catch((error) => {
               isLoading.value = false;
               errors.value = error.response.data;
            });
      });
   }

   return {
      register,
      login,
      getAuthorizedUser,
      logout,
      user,
      isLoading,
      errors,
      isLogged,
      conversations,
   };
});
