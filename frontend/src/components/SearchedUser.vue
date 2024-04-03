<template>
	<div class="flex items-center gap-2 bg-slate-700 p-1 rounded-md">
		<Avatar class="w-[25px] h-[25px]" />
		<span class="text-sm">{{ user.name }}</span>
		<span @click="remove(user.id)"
			class="flex items-center justify-center bg-slate-800 rounded-full text-xs cursor-pointer w-[20px] h-[20px]"><i
				class="fa-solid fa-xmark"></i></span>
	</div>
</template>

<script setup lang="ts">
import Avatar from './UI/Avatar.vue';
const emit = defineEmits(['removeUser'])
const props = defineProps({
	user: {
		type: Object,
		required: true
	}
})
const remove = (id: number) => {
	emit('removeUser', id)
}
</script>

<style scoped></style>