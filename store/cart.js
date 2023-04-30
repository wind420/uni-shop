/* 
	8.2 创建购物车的 store 模块
	在 store 目录上鼠标右键，选择 新建 -> js文件，创建购物车的 store 模块，命名为 cart.js
 */

// 在 cart.js 中，初始化如下的 vuex 模块
export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		// cart: [],
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	// 模块的 mutations 方法
	mutations: {
		// 将商品信息加入购物车
		addToCart(state, goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			// 未找到
			if (!findResult) {
				state.cart.push(goods)
			} else {
				// 找到了，商品数量加一
				findResult.goods_count++
			}

			// console.log(state.cart)

			// // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			// 找到了  就更新商品的勾选状态
			if (findResult) {
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新购物车中商品的数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 找到了
			if (findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 根据 id 从购物车中删除对应商品信息
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		// 更新购物车中所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			// 循环更新购物车中每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},

	// 模块的 getters 方法
	getters: {
		// 统计购物车中商品的总数量
		total(state) {
			// let c = 0
			// // 循环统计商品的数量，累加到变量 c 中
			// state.cart.forEach(goods => c += goods.goods_count)
			// return c

			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		// 勾选商品的总数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		// 勾选商品的总价
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state)
							 .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
							 .toFixed(2)
		}
	},
}

// 在 store/store.js 模块中，导入并挂载购物车的 vuex 模块