<template>
	<view>
		<!-- 搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<!-- 动态绑定图片的src属性 -->
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 每一个楼层的 item 项 -->
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层的标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>

				<!-- 楼层的图片 -->
				<view class="floor-img-box">
					<!-- 左侧大图片 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>

					<!-- 右侧四个小图片 -->
					<view class="right-img-box">
						<navigator class="rigth-img-item" v-for="(item2,i2) in item.product_list" :key="i2"
							v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				// 轮播图的数据列表
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				// 楼层数据列表
				floorList: [],
			}
		},
		onLoad() {
			// 调用方法，获取轮播图的数据
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		methods: {
			// 获取轮播图方法
			async getSwiperList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
				// console.log(res)
				if (res.meta.status !== 200) return uni.$showMsg()
				this.swiperList = res.message
				uni.$showMsg('数据请求成功！')
			},
			// 获取导航栏方法
			async getNavList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
				// console.log(res)
				if (res.meta.status !== 200) return uni.$showMsg()
				this.navList = res.message
				// uni.$showMsg('数据请求成功！')
			},
			// nav-item 点击事件处理函数
			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 获取楼层图片方法
			async getFloorList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg()

				// 双层 forEach 循环，处理 URL地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})

				this.floorList = res.message
			},
			// 搜索页面跳转
			gotoSearch() {
				// console.log('ok')
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		width: 100%;
		height: 60rpx;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}
	
	// 让搜索框吸顶
	.search-box {
		// 设置定位为吸顶
		position: sticky;
		// 吸顶的位置
		top: 0;
		// 提高层级，不被覆盖
		z-index: 999;
	}
</style>