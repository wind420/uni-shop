<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>

		<!-- 购物车商品列表标题 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 右侧文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 商品列表滑动删除用 uni-swipe-action -->
		<uni-swipe-action>
			<!-- 商品列表（用封装的组件 my-goods） -->
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>

		<!-- 结算组件 -->
		<my-settle></my-settle>
	</view>

	<!-- 空白购物车页面 -->
	<view class="empty-cart" v-else>
		<image src="/static//cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	// 动态为 tabBar 页面设置数字徽标(从商品详情页的购物车到  tabbar 购物车页面)（封装在mixins/tababr-badge.js)

	import badgeMix from '@/mixins/tabbar-badge.js'
	// 1. 按需导入 mapState 这个辅助函数
	import { mapState, mapMutations } from 'vuex'
	export default {
		mixins: [badgeMix],
		// 2. 将 m_cart 模块中的 cart 数组映射到当前页面中使用
		computed: {
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				// 滑动删除模块的配置
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}]
			};
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			// 商品勾选状态变化
			radioChangeHandler(e) {
				console.log(e)
				this.updateGoodsState(e)
			},
			// 商品数量发生变化
			numberChangeHandler(e) {
				console.log(e)
				this.updateGoodsCount(e)
			},
			// 滑动点击删除商品
			swipeItemClickHandler(goods) {
				console.log(goods)
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
	.cart-container {
		padding-bottom: 50px;
	}

	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
			font-size: 14px;
		}
	}

	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;

		.empty-img {
			width: 90px;
			height: 90px;
		}

		.tip-text {
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>