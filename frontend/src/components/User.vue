<template>
	<div class="user">
		<Router-link class="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-slate-700"
			:to="{ name: 'chat', params: { chatId: conv?.id } }">
			<Avatar class="w-[50px] h-[50px]" :online="online" />
			<div>
				<div class="fullname">{{ props.conv.partner.name }}</div>
				<p class="msg">Lorem ipsum dolor sit amet.</p>

			</div>
			<div class="time">55 minutes</div>
		</Router-link>
	</div>
</template>

<script setup lang="ts">
import Avatar from '@/components/UI/Avatar.vue'
const props = defineProps({
	conv: {
		type: Object,
		required: true
	},
	online: {
		type: Boolean,
		default: false
	}
})
</script>

<style lang="scss" scoped>
.user {
	.router-link-active {
		background-color: #334155;
	}

	a {
		transition: all 0.3s ease;
	}
}
</style>