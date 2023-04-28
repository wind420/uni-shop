<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧列表区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<!-- 动态添加类名 -->
					<view :class="['left-scroll-view-item', i === active ? 'active' : '']" 
					@click="activeChange(i)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区域 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					
					<!-- 动态渲染三级列表 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 当前设备可用的高度（设备屏幕总高度 - 上面导航栏 - 底部tab栏）
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 当前选中项
				active: 0,
				// 右侧二级列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		onLoad() {
			// 同步获取系统信息
			const sysInfo = uni.getSystemInfoSync()
			// console.log(sysInfo)
			this.wh = sysInfo.windowHeight

			this.getCateList()
		},
		methods: {
			async getCateList() {
				const { data: res } = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				// console.log(res)
				// 为左侧目录列表赋值
				this.cateList = res.message
				
				// 为右侧二级列表赋初始值
				this.cateLevel2 = res.message[0].children
			},
			activeChange(i){
				this.active = i
				
				// 为二级分类列表重新赋值
				this.cateLevel2 = this.cateList[i].children
				
				// 切换分类列表时，右侧滚动条需要重置为0，但是和数据里面的默认值一样的话，就不会生效，所以在 0 和 1 之间变化，用户察觉不出
				this.scrollTop = this.scrollTop == 0 ? 1 : 0
			},
			// 三级列表跳转到商品列表页面
			gotoGoodsList(item3){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				background-color: #F7F7F7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;

				// 同时还有active这个类名的
				&.active {
					background-color: #FFFFFF;
					position: relative;

					// 在当前选中的active项前面加上伪元素
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #C00000;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}

		.cate-lv2-title {
			font-size: 12px;
			font-weight: bold;
			text-align: center;
			padding: 15px 0;
		}
		
		.cate-lv3-list{
			display: flex;
			flex-wrap: wrap;
			
			.cate-lv3-item {
				width: 33.33%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 10px;
				
				image {
					width: 60px;
					height: 60px;
				}
				
				text{
					font-size: 12px;
				}
			}
		}
	}
</style>