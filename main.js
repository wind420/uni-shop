// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 在 main.js 中导入 store 实例对象并挂载到 Vue 的实例上
// @ 代表在根目录下
// 1. 导入 store 的实例对象
import store from '@/store/store.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

uni.$http = $http

// 配置请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求开始之前做一些事情(请求拦截器)
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中···'
	})
}

// 请求完成之后做一些事情(响应拦截器)
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装弹窗的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	// 2. 将 store 挂载到 Vue 实例上
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif