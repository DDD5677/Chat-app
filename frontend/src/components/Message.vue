<template>
	<div class="message flex items-center justify-start" :class="own ? ' flex-row-reverse' : ''">
		<Avatar class="w-[40px] h-[40px]" />
		<div class=" my-3 mx-2">
			<div class="p-3 rounded-xl " :class="own ? 'bg-slate-700' : 'bg-blue-600'">
				<p>{{ message.text }}</p>
			</div>
			<span class="text-xs text-slate-400">{{ format(message.createdAt) }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import Avatar from './UI/Avatar.vue';
import { format } from 'timeago.js';
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