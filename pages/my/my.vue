<template>
	<view>
		<!-- 登录界面 -->
		<my-login v-if="!token"></my-login>
		<!-- 用户信息界面 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import { mapState } from 'vuex'

	export default {
		mixins: [badgeMix],
		computed: {
			...mapState('m_user', ['token']),
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">

</style>