<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>外部接口配置
			<span slot="after" @click="$router.go(-1)" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
			<span slot="after" @click="$router.replace('/index')" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回首页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>
	</div>
</template>

<script>
</script>

<style>
</style>