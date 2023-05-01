<template>
	<!-- 登录组件 -->
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
		<!-- 登录按钮 -->
		<!-- 固定写法：open-type="getUserInfo"  @getuserinfo="getUserInfo"  -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- <button type="primary" class="btn-login" open-type="getUserInfo" @click="getUserProfile">一键登录</button> -->
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'

	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo']),
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

			// 获取微信用户的基本信息
			async getUserInfo(e) {
				// console.log(e)
				// 判断是否获取用户信息成功
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权')

				// 获取用户信息成功
				console.log(e.detail.userInfo)
				this.updateUserInfo(e.detail.userInfo)
				this.getToken(e.detail)

				// const [err, succ] = await uni.getUserProfile({ desc: '登录支付' }).catch(err => err)
				// console.log(err)
				// console.log(succ)
				// console.log(succ.userInfo)
				// this.updateUserInfo(succ.userInfo)
				// // 获取用户登录成功后的 token 字符串
				// this.getToken(succ)
			},
			// 调取登录接口
			async getToken(info) {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				console.log(res)
				if (res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}

				// 换取 token (这个接口获取不到 token ，会报错，API只能给一部分学员使用，所以直接自己写一个token字符串测试)
				const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				console.log(loginResult)
				if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				uni.$showMsg('登录成功！')

				// 把token保存到 vuex 中
				this.updateToken(loginResult.message.token)

				// 判断 vuex 中的 redirectInfo 是否为 null
				// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
				this.navigateBack()
			},
			// 返回登录之前的页面
			navigateBack() {
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: white;
	}

	.login-container {
		height: 750rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #F8F8F8;
		position: relative;
		overflow: hidden;

		// 椭圆形交界效果
		&::after {
			content: ' ';
			display: block;
			width: 100%;
			height: 40px;
			background-color: white;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>