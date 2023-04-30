/* 
	8.1 配置 vuex
	在项目根目录中创建 store 文件夹，专门用来存放 vuex 相关的模块
	在 store 目录上鼠标右键，选择 新建 -> js文件，新建 store.js 文件：
 */

// 在 store.js 中按照如下 4 个步骤初始化 Store 的实例对象：
// 1.导入 vue 和 vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 在 store/store.js 模块中，导入并挂载购物车的 vuex 模块
// ① 导入购物车的 vuex 模块
import moduleCart from '@/store/cart.js'
// 1’ 导入用户的 vuex 模块
import moduleUser from '@/store/user.js'

// 2.将 Vuex 安装为 Vue 的插件
Vue.use(Vuex)

// 3.创建 Store 实例对象
const store = new Vuex.Store({
	// TODO：挂载 store 模块
	modules: {
		// ② 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart
		m_cart: moduleCart,
		// 2’ 挂载用户的 vuex 模块，访问路径是 m_user
		m_user: moduleUser
	},
})

// 4.向外共享 Store 的实例对象
export default store

// 在 main.js 中导入 store 实例对象并挂载到 Vue 的实例上