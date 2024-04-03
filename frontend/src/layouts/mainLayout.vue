<template>
	<div class="bg-slate-700">
		<Sidebar />
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { useSocketStore } from "@/stores/socket.store";
import Sidebar from "../components/Sidebar.vue"
import { onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const socketStore = useSocketStore()
const authStore = useAuthStore()
watch(authStore, () => {
	socketStore.addUser(authStore.user?.id)
	socketStore.getOnlineUsers()
})
</script>

<style scoped></style>