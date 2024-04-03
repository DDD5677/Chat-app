<template>
	<div class="register flex items-center justify-center text-white">
		<form @submit.prevent="Login" action="" class="bg-slate-700 w-[600px] p-10 rounded-xl flex flex-col gap-4">
			<h1 class="title text-3xl text-center mb-4">Sign In</h1>

			<input placeholder="Username" class="bg-slate-800 focus:outline-none py-3 px-4 pr-10 w-full rounded"
				type="text" v-model="username">
			<input placeholder="Password" class="bg-slate-800 focus:outline-none py-3 px-4 pr-10 w-full rounded"
				type="password" v-model="password">
			<button type="submit" class="px-6 py-3 bg-slate-900 hover:bg-slate-950 rounded mt-5">Sign In</button>
			<RouterLink :to="{ name: 'register' }" class="text-center hover:text-slate-300">If you don't have an accaunt
				please Register
			</RouterLink>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from "@/stores/auth.store"
import { useRouter } from 'vue-router';
const router = useRouter()
const username = ref('');
const password = ref('');
const authStore = useAuthStore()
const Login = () => {
	const data = {
		username: username.value,
		password: password.value
	}
	authStore.login(data).then((res: any) => {
		console.log(res)
		router.replace('/')
	})
}
</script>

<style lang="scss" scoped>
.register {
	min-height: 100vh;

	button {
		transition: all 0.3s ease;
	}
}
</style>