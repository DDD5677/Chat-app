<template>
	<div class="sidebar bg-slate-800 border-r-2 border-slate-700">
		<div class="top">
			<div class="profile">
				<div v-if="!authStore.isLoading" class="flex items-center gap-3 flex-grow">
					<Avatar class="w-[50px] h-[50px]" />
					<RouterLink :to="{ name: 'home' }" class="fullname flex-grow">{{ authStore.user?.name }}</RouterLink>

				</div>
				<div class="btns flex items-center gap-2">
					<button class="rounded-full hover:bg-slate-700"><i class="fa-solid fa-chevron-left"></i></button>
					<button class="rounded-full hover:bg-slate-700"><i class="fa-solid fa-user-plus"></i></button>

				</div>
			</div>
			<div class=" relative">
				<button class="search-btn p-3"><i class="fa-solid fa-magnifying-glass"></i></button>
				<input placeholder="Search contacts..." class="w-full rounded-md bg-slate-700 p-3 pl-10" type="text">

			</div>
		</div>
		<div v-if="!authStore.isLoading" class="main flex-grow">
			<User v-for="conv in authStore.conversations" :key="conv?.id" :conv="conv"
				:online="checkOnline(conv.partner.id)" />
		</div>
		<div class="footer p-3">
			<button type="submit" @click="logout" class="bg-slate-900 py-3 px-5 rounded-md">Log out</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import Avatar from '@/components/UI/Avatar.vue'
import User from './User.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useConversationStore } from '@/stores/conversation.store';
import { computed, ref, watch } from 'vue';
import { useSocketStore } from '@/stores/socket.store';
import { useRouter } from 'vue-router';
const conversationStore = useConversationStore()
const authStore = useAuthStore()
const router = useRouter()
const socketStore = useSocketStore()
const checkOnline = (id: number) => {
	return socketStore.onlineUsers.includes(id)
}

const logout = () => {
	authStore.logout().then(res => {
		router.replace('/login')
	})
}
</script>

<style lang="scss" scoped>
.sidebar {
	padding: 15px 0;
	position: fixed;
	min-height: 100vh;
	min-width: 400px;
	left: 0;
	top: 0;
	color: white;
	z-index: 99;
	display: flex;
	flex-direction: column;

	.top {
		padding: 0 15px;
		margin-bottom: 15px;

		.profile {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			gap: 10px;

			.fullname {
				font-size: 20px;
			}

			button {
				width: 40px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s ease;
			}
		}

		.search-btn {
			position: absolute;
			left: 0;
			bottom: 0;
			top: 0;
		}

	}

	.main {
		overflow-y: auto;
	}
}
</style>