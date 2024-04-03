<template>
	<div class="message flex items-center justify-start" :class="own ? ' flex-row-reverse' : ''">
		<Avatar class="w-[40px] h-[40px]" />
		<div class=" my-3 mx-2">
			<div class="relative p-3 pt-1 rounded-xl " :class="own ? 'bg-slate-700' : 'bg-blue-600'">
				<span class="text-sm font-bold top-0" :class="own ? 'text-purple-500' : 'text-slate-900'">{{
		message.sender.name || conversationStore.chatWith.name }}</span>
				<p>{{ message.text }}</p>
			</div>
			<span class="text-xs text-slate-400">{{ format(message.createdAt) }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useConversationStore } from '@/stores/conversation.store';
import Avatar from './UI/Avatar.vue';
import { format } from 'timeago.js';
const conversationStore = useConversationStore()
const props = defineProps({
	message: {
		type: Object,
		required: true
	},
	own: {
		type: Boolean,
		default: false
	}
})
</script>

<style scoped></style>