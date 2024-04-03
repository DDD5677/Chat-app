<template>
	<div class="avatar">
		<a href="https://avatar.iran.liara.run/public/boy" target="_blank">
			<img src="https://avatar.iran.liara.run/public/boy" alt="avatar">
			<span v-if="online" class="dot"></span>
		</a>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	online: {
		type: Boolean,
		default: false
	}
})
</script>

<style lang="scss" scoped>
.avatar {
	border-radius: 50%;
	position: relative;

	.dot {
		top: 0;
		right: 0;
		position: absolute;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background-color: rgb(15, 199, 15);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}
</style>