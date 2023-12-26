<template>
    <div id="left">
        <div v-if="$store.state.isPhone && $store.state.navOpen" @click="$store.state.navOpen = !$store.state.navOpen" class="mask"></div>
        <div id="nav" :style="getWidth()">
			<el-menu :default-active="active" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect"
			:background-color="nBackground" :text-color="nColor" :active-text-color="nActiveColor" :collapse="!$store.state.navOpen" router
			:default-openeds="openeds">
				<el-menu-item index="-1" disabled>
					<img src="@/assets/svg/pfunText.png" alt="" height="20px" style="margin-right: 10px;">
					<span slot="title">鹏飞智能后台管理系统</span>
				</el-menu-item>
				<el-scrollbar style="height: 100%; width: 100%;">
					<el-submenu :index='index.toString()' v-for="(item, index) in menuList" :key="index" :class="!$store.state.navOpen ? 'isCollapse':''">
						<template slot="title">
							{{conslo(index.toString())}}
							<i :class="item.menuIcon"></i>
							<span slot="title" v-if="$store.state.navOpen">{{item.label}}</span>
						</template>
						<el-menu-item :index="item2.requestUrl" v-for="(item2, index) in item.children" :key="index" >
							{{item2.label}}
						</el-menu-item>
					</el-submenu>
				</el-scrollbar>
			</el-menu>
        </div>
    </div>
</template>

<script>
import {nBackground,nColor,nActiveColor} from '@/config//appConfig'
export default {
    data() {
        return {
            isCollapse: false,
            active: '',
            openeds: ['12'],
            menuList: [],
            nBackground: nBackground,
            nColor: nColor,
            nActiveColor: nActiveColor
        };
    },

    watch: {
        router(value) {
            this.active = this.$route.path
            this.setByRoute()
        }
    },

    computed: {
        router() {
            return this.$route.path
        }
    },

    created() {
        this.defaultActiveIndex = this.$route.fullPath

        var item = JSON.parse(sessionStorage.getItem('menuList'));
        // 获取所有根节点
        var parents = [];
        item.filter(item => {
            return item.parentId == -1
        }).forEach(item => {
            parents.push({
                id: item.id,
                label: item.menuName,
                requestUrl: item.requestUrl,
                menuIcon: item.menuIcon,
				sort:item.sort,
            })
        })
        // 获取所有子节点
        var childrens = [];
        item.filter(item => {
            return item.parentId != -1 && item.flag == 2
        }).forEach(item => {
            childrens.push({
                id: item.id,
                label: item.menuName,
                parentId: item.parentId,
                requestUrl: item.requestUrl,
                menuIcon: item.menuIcon,
				sort:item.sort,
            })
        })

        // 生成菜单树
        this.menuList = this.$common.translator(parents, childrens, current => {
            // 定义树的数据结构
            return {
                id: current.id,
                label: current.label,
                parentId: current.parentId,
                requestUrl: current.requestUrl,
                menuIcon: current.menuIcon,
				sort:current.sort
            }
        });
		
		// 按照最外层的 sort 属性进行排序
		this.menuList.sort((a, b) => a.sort - b.sort);
		
		// 对每个菜单项的子菜单按照 sort 属性进行排序
		this.menuList.forEach(item => {
		  if (item.children) {
		    item.children.sort((a, b) => a.sort - b.sort);
		  }
		});


		
    },

    mounted() {
		
        this.$pubsub.subscribe('collapse', (msg, value) => {
            this.isCollapse = value
        })

        this.active = this.$route.path

        setTimeout(() => {
            this.setByRoute()
        }, 200)

    },

    methods: {
		conslo(index){
			
		},
        handleOpen(key, keyPath) {},

        handleClose(key, keyPath) {},

        handleSelect(index, path) {
            if(this.$store.state.isPhone) {
                this.$store.state.navOpen = false;
            }
            if (!this.menuList[Number(path[0])]) {
                return;
            }
            var children = this.menuList[Number(path[0])].children[
                this.menuList[Number(path[0])].children.findIndex(item => {
                    return item.requestUrl == path[1]
                })
                ]

            var menuItem = this.menuList[Number(path[0])]

            this.$pubsub.publish('breadcrumb', [{
                name: menuItem.label
            }, {
                name: children.label
            }])
            this.$pubsub.publish('addTabs', {
                parentLabel: menuItem.label,
                path: children.requestUrl,
                label: children.label
            })
        },

        setByRoute() {
            var i = -1
            var j = -1
            this.menuList.forEach((item, index) => {
                if (item.children) {
                    item.children.forEach((item2, index2) => {
                        if (item2.requestUrl == this.active) {
                            i = index
                            j = index2
                        }
                    })
                }
            })
            this.handleSelect(this.active, [i.toString(), this.active])
        },
        selectNav(index) {
            if(this.$store.state.isPhone) {
                this.$store.state.navOpen = false;
            }
        },
        getWidth() {
            var widthStr;
            if(this.$store.state.isPhone) {
                widthStr = this.$store.state.navOpen?'width: 240px;':'width:0px;';
            } else {
                widthStr = this.$store.state.navOpen?'width: 240px;':'width:64px;';
            }
            return widthStr;
        }
    }

}
</script>

<style>
.el-menu{
    border-right: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 210px;
    box-sizing: border-box;
}

.el-menu-vertical-demo.el-menu {
    height: 100vh;
    border-right: 0px !important;
}

/* .el-menu--inline .el-menu-item {
    background-color: #343840 !important;
}

.el-menu--inline .el-menu-item:hover {
    background-color: #00A2E9 !important;
} */

.el-menu-item.is-disabled {
    opacity: 1 !important;
    cursor: default;
    background: transparent !important;
}

.el-submenu__title {
    display: flex;
    align-items: center;
}

.el-submenu__title i {
    color: white;
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
}

.el-menu .el-scrollbar__wrap {
    overflow-x: hidden;
}

.el-submenu__title {
    height: 48px !important;
    line-height: 48px !important;
}

.el-submenu .el-menu-item{
    height: 43px !important;
    line-height: 43px !important;
    padding-left: 48px !important;
    opacity: 0.9;
}

.isCollapse .el-submenu__icon-arrow.el-icon-arrow-right{
    display: none;
}

.el-menu .el-scrollbar__view{
    padding-bottom: 55px;
}

.el-menu-item.is-active{
    background: var(--nav-active-color) !important;
}
</style>

<style lang="scss" scoped>
#left {
    .mask {
        background: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }
    #nav {
        position: fixed;
        height: 100vh;
        max-width: 200px;
        width: 200px;
        left: 0;
        top: 0;
        background: #545C64;
        overflow: hidden;
        transition: width 0.3s;
        z-index: 1001;
    }
    .nav_icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
}
</style>
