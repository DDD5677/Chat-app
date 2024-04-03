<template>
	<div v-if="!conversationStore.isLoading" class="home relative bg-slate-900 flex flex-col justify-between">
		<div
			class="header bg-slate-800 fixed w-full right-0 top-0 p-4 border-b-2 border-slate-700 flex justify-between items-center">
			<div class="flex items-center px-3">
				<Avatar class="w-[50px] h-[50px]" :online="checkOnline(conversationStore.chatWith.id)" />
				<div class="flex flex-col gap-1 px-3">
					<span class="text-xl">{{ conversationStore.chatWith.name }}</span>
					<span v-if="checkOnline(conversationStore.chatWith.id)" class="text-sm text-green-500">online</span>
					<span v-else class="text-sm text-gray-400">offline</span>
				</div>

			</div>
		</div>
		<div class="chat flex-grow" ref="chat">
			<Message v-for="(message, index) in conversationStore.messages" :key="index" :message="message"
				:own="message.sender.id === authStore.user.id" />
		</div>
		<MessageForm :receivers="[conversationStore.chatWith.id]" />
	</div>
</template>

<script setup lang="ts">
import Message from '@/components/Message.vue';
import MessageForm from '@/components/MessageForm.vue'
import Avatar from '@/components/UI/Avatar.vue';
import { useAuthStore } from '@/stores/auth.store';
import { useConversationStore } from '@/stores/conversation.store';
import { useSocketStore } from '@/stores/socket.store';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const conversationStore = useConversationStore()
const authStore = useAuthStore()
const route = useRoute()
const socketStore = useSocketStore()


const chat = ref<HTMLDivElement | null>(null);



const checkOnline = (id: number) => {
	return socketStore.onlineUsers.includes(id)
}

watch(route, () => {
	const conversationId = route.params.chatId as string;
	conversationStore.getOneConversation(conversationId)

})

watch(() => conversationStore.messages, async () => {
	console.log('croll')
	await nextTick();
	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
})

socketStore.getMessage()
onMounted(() => {
	const conversationId = route.params.chatId as string;
	conversationStore.getOneConversation(conversationId)

})
</script>

<style lang="scss" scoped>
.home {
	min-height: 100vh;
	color: white;

	.header {
		padding-left: 400px;
		z-index: 1;
	}

	.chat {
		padding: 100px 10px 100px 410px;
	}


}
</style>
