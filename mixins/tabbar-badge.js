/* 
 除了要在 cart.vue 页面中设置购物车的数字徽标，还需要在其它 3 个 tabBar 页面中，为购物车设置数字徽标。
 
 此时可以使用 Vue 提供的 mixins 特性，提高代码的可维护性。
 
 在项目根目录中新建 mixins 文件夹，并在 mixins 文件夹之下新建 tabbar-badge.js 文件，用来把
 设置 tabBar 徽标的代码封装为一个 mixin 文件
 */

import { mapGetters } from 'vuex'

// 导出一个 mixin 对象
export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	// 动态计算购物车徽标的数值
	// 问题说明：当修改购物车中商品的数量之后，tabBar 上的数字徽标不会自动更新。
	watch: {
		total() {
			this.setBadge()
		}
	},
	onShow() {
		// 在页面刚展示的时候，设置数字徽标
		this.setBadge()
	},
	// 在 methods 节点中，声明 setBadge 方法如下，通过 uni.setTabBarBadge() 为 tabBar 设置数字徽标
	methods: {
		setBadge() {
			uni.setTabBarBadge({
				index: 2, // tabBar 的哪一项，从左边开始，索引从0开始
				text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
			})
		}
	}
}

// 修改 home.vue，cate.vue，cart.vue，my.vue 这 4 个 tabBar 页面的源代码，分别导入 @/mixins/tabbar-badge.js 模块并进行使用