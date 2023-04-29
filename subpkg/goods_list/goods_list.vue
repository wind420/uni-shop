<template>
	<view>
		<view class="goods_list">
			<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				// 节流阀
				isloading: false,
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''

			this.getGoodsList()
		},
		methods: {
			// 获取商品列表的方法
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true

				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				console.log(res)
				// 关闭节流阀
				this.isloading = false

				// 只要数据请求完毕，就立即按需调用 cb 回调函数(如果传参有 cb 那么就调用 cb)
				cb && cb()

				if (res.meta.status !== 200) return uni.$showMsg()
				// this.goodsList = res.message.goods

				// 新旧数据拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]

				this.total = res.message.total
			},
			// 点击跳转到商品详情页面
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		// 下拉触底事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')

			// 如果正在请求数据，则不发起额外的请求
			if (this.isloading) return

			this.queryObj.pagenum += 1
			this.getGoodsList()
		},
		// 上拉刷新事件
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 0
			this.total = 0
			this.goodsList = []
			this.isloading = false

			// 2. 重新发起请求,并且携带一个回调函数cb
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>