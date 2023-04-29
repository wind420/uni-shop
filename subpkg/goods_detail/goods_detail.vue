<template>
	<!-- 解决商品价格闪烁的问题 -->
	<!-- 解决方案：判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏 -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>

		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 商品信息主体 -->
			<view class="goods-info-body">
				<!-- 商品名字 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="20" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>

		<!-- 商品详细信息 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>

		<!-- 底部商品导航区：基于 uni-ui 提供的 GoodsNav 组件来实现 -->
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				// 底部商品导航区左侧配置
				options: [{
					icon: 'shop',
					text: '店铺',
					infoBackgroundColor: '#007aff',
					infoColor: "red"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 2
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
				// 底部商品导航区右侧配置


			};
		},
		onLoad(options) {
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
		},
		methods: {
			// 请求商品详情数据的方法
			async getGoodsDetail(goods_id) {
				const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
				// console.log(res)
				if (res.meta.status !== 200) return uni.$showMsg()

				// 解决图片底部空白间隙的问题,还有解决 .webp 格式图片在 ios 设备上无法正常显示的问题
				res.message.goods_introduce = res.message.goods_introduce
					.replace(/<img /g, '<img style="display:block;"')
					.replace(/webp/g, 'jpg')

				this.goods_info = res.message
			},
			// 实现轮播图的预览效果
			preview(i) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current: i,
					// 所有图片 url 地址的数组
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			onClick(e) {
				// console.log(e)
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				margin-right: 10px;
			}

			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
		}

		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}

	.goods-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.goods-detail-container {
		padding-bottom: 50px;
	}
</style>