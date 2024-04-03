<template>
	<div class="form fixed bottom-0 w-full right-0 flex items-end bg-slate-800 p-3">
		<span class="hover:bg-slate-900 rounded-full"><i class="fa-regular fa-face-smile"></i></span>
		<textarea v-model="message" data-autoresize rows="1" class="flex-grow bg-transparent focus:outline-none p-2"
			placeholder="Type a message"></textarea>
		<span class="hover:bg-slate-900 rounded-full"><i class="fa-regular fa-image"></i></span>
		<span class="hover:bg-slate-900 rounded-full"><i class="fa-solid fa-paperclip"></i></span>
		<span v-if="!message" class="hover:bg-slate-900 rounded-full"><i class="fa-solid fa-microphone-lines"></i></span>
		<span @click="sendMessage" v-else class="hover:bg-slate-900 rounded-full"><i
				class="fa-solid fa-paper-plane"></i></span>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useConversationStore } from '@/stores/conversation.store';
import { useSocketStore } from '@/stores/socket.store';
import { onMounted, onUpdated, ref } from 'vue';
const authStore = useAuthStore()
const conversationStore = useConversationStore()
const socketStore = useSocketStore()
const message = ref('')
const props = defineProps({
	receivers: {
		type: Array,
		required: true
	}
})
const sendMessage = () => {
	const data = {
		senderId: authStore.user.id,
		receivers: props.receivers,
		text: message.value
	}

	console.log(data)
	conversationStore.sendMessage(data).then(res => {
		socketStore.sendMessage(data)
		conversationStore.setMessage({
			text: data.text,
			sender: { id: data.senderId, name: authStore.user.name },
			createdAt: Date.now(),
		})
	})
	message.value = ''
}


//add auto resize to textarea src:https://stephanwagner.me/auto-resizing-textarea-with-vanilla-javascript
function addAutoResize() {
	document.querySelectorAll('[data-autoresize]').forEach(function (element: any) {
		element.style.boxSizing = 'border-box';
		var offset = element.offsetHeight - element.clientHeight;
		element.addEventListener('input', function (event: any) {
			event.target.style.height = 'auto';
			event.target.style.height = event.target.scrollHeight + offset + 'px';
		});
		element.removeAttribute('data-autoresize');
	});
}
onMounted(() => {
	addAutoResize()
})
</script>

<style lang="scss" scoped>
.form {
	padding-left: 410px;
	z-index: 1;

	textarea {
		box-sizing: border-box;
		resize: none;
	}

	span {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		font-size: 18px;
		padding: 10px;
		cursor: pointer;
		transition: all 0.3s ease;
	}
}
</style>