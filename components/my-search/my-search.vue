<template>
	<view class="my-search-container" :style="{'background-color': bgcolor}" @click="searchboxHandler">
		<!-- 使用 view 组件模拟 input 输入框的样式 -->
		<view class="my-search-box" :style="{'border-radius': radius + 'px'}">
			<!-- uni-ui组件的使用查看官网：https://uniapp.dcloud.net.cn/component/uniui/uni-icons.html -->
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-search",
		// 为了让使用者可以自定义背景颜色和圆角尺寸
		props: {
			// 背景颜色
			bgcolor: {
				type: String,
				default: '#C00000'
			},
			// 圆角尺寸
			radius: {
				type: Number,
				default: 18 // px
			}
		},
		data() {
			return {

			};
		},
		methods: {
			searchboxHandler() {
				// console.log('-----')
				// 在组件的处理函数里面与页面的click事件进行关联
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		height: 50px;
		// background-color: #C00000;
		display: flex;
		align-items: center;
		padding: 0 10px;

		.my-search-box {
			height: 36px;
			background-color: #FFFFFF;
			// border-radius: 18px;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.placeholder {
				font-size: 15px;
				margin-left: 5px;
			}
		}
	}
</style>