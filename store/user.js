// 将address信息存储到vuex中

export default {
	// 开启命名空间
	namespaced: true,

	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登录成功之后的 token 字符串
		// token: uni.getStorageSync('token') || '',
		// 自己写一个token字符串用于测试，接口拿不到token
		token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o',
		// 用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),

		// 重定向的 object 对象 { openType, from}, 在登录成功之后再回到之前的页面（购物车结算）
		redirectInfo: null
	}),

	// 方法
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		// 将地址持久化存储到本地
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		// 更新用户的基本信息
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 将用户信息持久化存储到本地
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		// 更新 token
		updateToken(state, token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		// 将 token 字符串持久化存储到本地
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向的信息对象
		updateRedirectInfo(state, info) {
			state.redirectInfo = info
			console.log(state.redirectInfo)
		}
	},

	// 数据包装器
	getters: {
		addstr(state) {
			if (!state.address.provinceName) return ''
			return state.address.provinceName + state.address.cityName + state.address.countyName +
				state.address.detailInfo
		}
	}
}