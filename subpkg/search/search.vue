<template>
	<view>
		<view class="search-box">
			<!-- 去uni-modules 文件夹修改 uni-search-bar.vue组件，把默认的白色背景修改 -->
			<uni-search-bar @confirm="search" @input="input()" :radius="100" cancelButton="none"></uni-search-bar>
		</view>

		<!-- 搜索结果列表 -->
		<!-- 搜索结果列表 和 搜索历史 按需要展示  -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods_name">{{item.goods_name}}</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索结果列表数据
				searchResults: [],
				// 搜索记录
				historyList: ['a', 'app', 'apple']
			};
		},
		onLoad() {
			// 加载本地存储中的搜索历史记录
			this.historyList = JSON.parse(uni.getStorageSync('kw' || '[]'))
		},
		methods: {
			// input事件处理函数
			input(e) {
				// console.log('ok')
				// console.log(e)

				// 输入框的防抖处理
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					// console.log(e)
					this.kw = e
					// 获取搜索结果列表
					this.getSearchList()
				}, 500)
			},
			// 获取搜索结果列表
			async getSearchList() {
				if (this.kw.length === 0) {
					this.searchResults = []
					return
				}

				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message

				// 保存搜索关键词作为历史记录
				this.saveSearchHistory()
			},
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			// 保存搜索关键词作为历史记录
			saveSearchHistory() {
				// this.historyList.push(this.kw)

				// 关键词重复，保留最新的
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)

				// 将搜索历史记录持久化存储到本地，在onload函数中加载本地存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 删除历史记录
			clean() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		computed: {
			// 历史记录列表逆序显示，最新记录显示在最前面  渲染页面的时候用histories
			histories() {
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;

			.goods_name {
				// 文字不换行用省略号
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			height: 40px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
				background-color: #efefef;
				color: black;
			}
		}
	}
</style>