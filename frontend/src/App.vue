<template>
	<component :is="layout">
		<RouterView />
	</component>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import mainLayout from "./layouts/mainLayout.vue"
import emptyLayout from "./layouts/emptyLayout.vue"
import { useAuthStore } from './stores/auth.store';
import { getItem } from './helpers/localStorage';
import { useSocketStore } from './stores/socket.store';
export default defineComponent({
	components: {
		mainLayout,
		emptyLayout
	},
	setup() {
		const route = useRoute()
		const router = useRouter()
		const authStore = useAuthStore()
		const token = getItem('token')
		const layout = computed(() => {
			return route.meta.layout + 'Layout'
		})


		onMounted(() => {
			if (token) {
				authStore.getAuthorizedUser().then((user: any) => {
					console.log(user)
				})
			} else {
				router.replace('/login')
			}

		})
		return { layout }
	}
})
</script>

<style lang="scss" scoped></style>
