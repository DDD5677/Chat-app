<template>
	<div class="register flex items-center justify-center text-white">
		<form @submit.prevent="Register" action="" class="bg-slate-700 w-[600px] p-10 rounded-xl flex flex-col gap-4">
			<h1 class="title text-3xl text-center mb-4">Sign Up</h1>
			<input placeholder="Name" class="bg-slate-800 focus:outline-none py-3 px-4 pr-10 w-full rounded" type="text"
				v-model="name">
			<input placeholder="Username" class="bg-slate-800 focus:outline-none py-3 px-4 pr-10 w-full rounded"
				type="text" v-model="username">
			<input placeholder="Password" class="bg-slate-800 focus:outline-none py-3 px-4 pr-10 w-full rounded"
				type="password" v-model="password">
			<button type="submit" class="px-6 py-3 bg-slate-900 hover:bg-slate-950 rounded mt-5">Sign Up</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from "@/stores/auth.store"
import { useRouter } from 'vue-router';
const router = useRouter()
const username = ref('');
const name = ref('');
const password = ref('');
const authStore = useAuthStore()
const Register = () => {
	const data = {
		username: username.value,
		name: name.value,
		password: password.value
	}
	authStore.register(data).then((res) => {
		console.log(res)
		router.replace('/login')
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