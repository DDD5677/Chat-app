<template>
	<div class="home relative bg-slate-900 flex flex-col justify-between">
		<div class="header fixed w-full right-0 top-0 p-4 border-b-2 border-slate-700 flex justify-between items-center">
			<div class="flex">
				<div class="p-3 font-bold text-lg">
					To:
				</div>
				<div class="flex items-center gap-2 bg-slate-800 p-2 rounded-md relative">

					<SearchedUser v-for="user in selectedUsers" :key="user.id" :user="user"
						@removeUser="handleRemovedUserId" />
					<div class="relative ">
						<input placeholder="Search contacts..." class="bg-transparent focus:outline-none p-3 pr-10"
							type="text" v-model="search">
						<button v-if="selectedUsers.length > 0" @click="removeAllSelectedUsers"
							class="absolute right-0 top-0 p-3"><i class="fa-solid fa-xmark"></i></button>

					</div>
					<div v-if="conversationStore.searchedUsers?.length > 0"
						class="searchedUsers mt-3 border-y-2 border-y-slate-600 py-3 w-[200px] absolute bg-slate-800 rounded-md">
						<div v-for="user in conversationStore.searchedUsers" :key="user.id" @click="addSelectedUser(user)"
							class="flex items-center gap-3 p-3 cursor-pointer">
							<Avatar class="w-[30px] h-[30px]" />
							<div>
								<div class="fullname">{{ user.name }}</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
		<div class="chat flex-grow">

		</div>
		<MessageForm :receivers="selectedUsersId" />
	</div>
</template>

<script setup lang="ts">
import SearchedUser from '@/components/SearchedUser.vue'
import MessageForm from '@/components/MessageForm.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useConversationStore } from '@/stores/conversation.store';
import Avatar from '@/components/UI/Avatar.vue';
import { useSocketStore } from '@/stores/socket.store';
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore()
const conversationStore = useConversationStore()
const search = ref('')
const selectedUsers = ref<any>([])
const selectedUsersId = computed(() => {
	return selectedUsers.value.map((user: any) => {
		return user.id
	})
})
const searchUsers = () => {
	const data = {
		search: search.value,
		userId: authStore.user.id
	}
	conversationStore.getUsers(data)
}
watch(search, () => {
	if (!search.value) {
		conversationStore.resetSearchedUsers()
	} else {
		searchUsers()

	}
})
const addSelectedUser = (user: any) => {
	const exist = selectedUsers.value.find((u: any) => u.id === user.id)
	if (!exist) {
		selectedUsers.value.push(user)
	}
	search.value = ''
}
const handleRemovedUserId = (id: number) => {
	selectedUsers.value = selectedUsers.value.filter((u: any) => u.id !== id)
}
const removeAllSelectedUsers = () => {
	selectedUsers.value = []
}

//socet.io

</script>

<style lang="scss" scoped>
.home {
	min-height: 100vh;
	color: white;

	.header {
		padding-left: 400px;
		z-index: 1;

		.searchedUsers {
			top: 100%;
			left: 0;
		}
	}


}
</style>
