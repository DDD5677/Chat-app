<template>
	<section class="empty">
		<div class="content bg-slate-900">
			<slot></slot>
		</div>
	</section>
</template>

<script setup lang="ts">


</script>

<style lang="scss" scoped>
.empty {
	.content {
		min-height: 100vh;
	}


}
</style>