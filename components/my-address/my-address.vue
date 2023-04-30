<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>

		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else>
			<!-- 第一行：收货人，电话 -->
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人：{{address.userName}}</view>
				</view>
				<view class="row1-right">
					<view class="phone">电话：{{address.telNumber}}</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<!-- 第二行：地址 -->
			<view class="row2">
				<view class="row2-left">收货地址：</view>
				<view class="row2-right">{{addstr}}</view>
			</view>
		</view>

		<!-- 底部边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	// 1. 按需导入 mapState 和 mapMutations 这两个辅助函数
	import { mapState, mapMutations, mapGetters } from 'vuex'

	export default {
		name: "my-address",
		data() {
			return {
				// 收货地址
				// 2.1 注释掉下面的 address 对象，使用 2.2 中的代码替代之
				// address: {},
			};
		},
		computed: {
			// 2.2 把 m_user 模块中的 address 对象映射当前组件中使用，代替 data 中 address 对象
			...mapState('m_user', ['address']),
			...mapGetters('m_user', ['addstr']),

		},
		methods: {
			// 3.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
			...mapMutations('m_user', ['updateAddress']),

			// 选择收货地址
			async chooseAddress() {
				// 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
				//    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
				const [err, succ] = await uni.chooseAddress().catch(err => err)

				// 2. 用户成功的选择了收货地址
				if (err === null && succ.errMsg === 'chooseAddress:ok') {
					// console.log(succ)
					// 3.2 把下面这行代码注释掉，使用 3.3 中的代码替代之
					// this.address = succ

					// 3.3 调用 Store 中提供的 updateAddress 方法，将 address 保存到 Store 里面
					this.updateAddress(succ)
				}
			}
		}
	}
</script>

<style lang="scss">
	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	.address-choose-box {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.address-info-box {
		font-size: 12px;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;

		.row1 {
			display: flex;
			justify-content: space-between;

			.row1-right {
				display: flex;
				justify-content: space-between;
			}
		}

		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;

			.row2-left {
				white-space: nowrap;
			}
		}
	}
</style>