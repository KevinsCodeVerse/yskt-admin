<template>
    <div id="finance_profit">
        <main-head>

        </main-head>
        <main-content>
            <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
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
                <el-form-item>
                    <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="id" label="id" align="center"></el-table-column>
                <el-table-column label="收益金额" width="140" align="center">
                    <template slot-scope="scope">
                        <span>{{ $common.toThousands(scope.row.money, true) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="origin" label="收益来源" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page"
                background
                :layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
                :page-size.sync="params.pageSize"
                :current-page.sync="params.pageNo"
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
            list: [],
            params: {
                startTime: '',
                endTime: '',
                pageSize: 10,
                pageNo: 1
            },
            total: 0,
            load: false,
            date: [],
        };
    },

    created() {
        this.search()
    },

    methods: {
        // 获取列表
        getList() {
            if (this.load) {
                return;
            }
            if (this.date && this.date.length) {
                this.params.startTime = this.$moment(this.date[0]).format('Y-MM-DD HH:mm:ss')
                this.params.endTime = this.$moment(this.date[1]).format('Y-MM-DD HH:mm:ss')
            } else {
                this.date = [];
                this.params.startTime = ''
                this.params.endTime = ''
            }
            this.load = true
            this.$request.post({
                url: 'admin/adProfit/list',
                params: this.params,
                success: result => {
                    this.list = result.list
                    if (this.params.isCount) {
                        this.total = result.total
                    }
                },
                finally: () => {
                    this.load = false
                }
            })
        },

        search() {
            this.params.isCount = true
            this.params.pageNo = 1
            this.getList()
        }
    }
}

</script>

<style>
</style>
