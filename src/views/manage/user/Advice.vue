<!-- 用户反馈 -->
<template>
    <div id="user_advice">
        <main-head>          
        </main-head>

        <main-content>
            <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
                <div :style="formStyle">
                    <el-form-item>
                        <el-input v-model="params.usId" placeholder="用户id"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="search"
                        >
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div :style="$store.state.isPhone?'display:block':'display:inline'">
                    <el-form-item>
                        <el-button type="text" style="margin-right:10px;" @click="formOpen = !formOpen">{{formOpen?'收起':'展开'}}</el-button>
                        <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="id" label="id" width="90" align="center"></el-table-column>
                <el-table-column prop="usId" label="用户id" width="120" align="center"></el-table-column>
                <el-table-column prop="content" label="反馈内容" align="center"></el-table-column>    
               <!-- 
                <el-table-column prop="isRead" label="已读?" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isRead == 0 && scope.row.status == 0" class="error">未读</span>
                        <span v-else class="gray">已读</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="status" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0" class="error">未回复</span>
                        <span v-if="scope.row.status == 1" class="success">已回复</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="120" align="center">                  
                </el-table-column>
                <el-table-column label="创建时间" width="150" align="center">
                    <template slot-scope="scope">
                        <span>{{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="reply(scope.row.id)" v-if="scope.row.status == 0">
                            回复
                        </el-button>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                class="page"
                background
                :layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                :current-page.sync="params.pageNo"
                :page-size.sync="params.pageSize"
                :total="total"
                @size-change="search"
                @current-change="getList"
            >
            </el-pagination>
        </main-content>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formOpen: false,
            list: [],
            params: {
                pageNo: 1,
                pageSize: 10,
                usId: '',
                startTime: '',
                endTime: '',
            },
            total: 0,
            load: false,
            date: [],
            dialogVisible: false
        };
    },

    mounted() {
        this.search()
    },

    computed: {
        formStyle() {
            var style = this.$store.state.isPhone?'display:block;':'display:inline;'
            style += this.$store.state.isPhone && !this.formOpen?'max-height:116px;overflow:hidden;':''
            return style;
        },
    },

    methods: {
        search(){
            this.params.pageNo = 1
            this.getList()
        },

        // 获取列表
        getList() {
            if (this.date && this.date.length) {
                this.params.startTime = this.$moment(this.date[0]).format('Y-MM-DD HH:mm:ss')
                this.params.endTime = this.$moment(this.date[1]).format('Y-MM-DD HH:mm:ss')
            } else {
                this.date = [];
                this.params.startTime = ''
                this.params.endTime = ''
            }
            this.load = true
            this.params.type = 1
            this.$request.post({
                url: 'admin/adUsAdvice/list',
                params: this.params,
                success: result => {
                    this.list = result.list
                    this.total = result.total
                },
                finally: () => {
                    this.load = false
                }
            })
        },
       

        // 回复
        reply(id) {
            var index = this.list.findIndex(item => {
                return item.id = id
            })
            this.$prompt('输入回复信息', '回复', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S/,
                inputErrorMessage: '请输入回复内容'
            }).then(({value}) => {
                this.load = true
                this.$request.post({
                    url: 'admin/adUsAdvice/reply',
                    params: {
                        id,
                        content: value
                    },
                    success: result => {
                        this.$message.success('回复成功')
                        this.list[index].status = 1
                        this.list[index].reply = value
                    },
                    finally: () => {
                        this.load = false
                    }
                })
            })
        }


    }

}
</script>

<style>

</style>

<style scoped>

</style>
