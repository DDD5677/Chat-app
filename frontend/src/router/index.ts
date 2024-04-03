import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import ChatView from "@/views/ChatView.vue";

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: "/",
         name: "home",
         meta: { layout: "main" },
         component: HomeView,
      },
      {
         path: "/chat/:chatId",
         name: "chat",
         meta: { layout: "main" },
         component: ChatView,
      },
      {
         path: "/register",
         name: "register",
         meta: { layout: "empty" },
         component: RegisterView,
      },
      {
         path: "/login",
         name: "login",
         meta: { layout: "empty" },
         component: LoginView,
      },
   ],
});

export default router;
