<template>
    <div >
        <main-head></main-head>

        <main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()">
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
				<el-form-item label="">
					<span style="color: #3c86ef;margin: 0px 20px 0px 20px;;">我的收益占比(股份):{{detail.shares*100}}%</span>
					<span style="color: red;margin: 0px 20px 0px 20px;">总余额:{{detail.totalBalance}}元</span>
					<span style="color: green;margin: 0px 20px 0px 20px;">提现中:{{detail.applyIng}}元</span>
					<span style="color: #3c86ef;margin: 0px 20px 0px 20px;;">共提现:{{detail.successApply}}元</span>
				</el-form-item>
			</el-form>
            <el-table :data="list" stripe style="width: 100%" v-loading="load">
                <el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="bankCardId" label="银行卡id" align="center"></el-table-column>
                <el-table-column prop="cardNum" label="银行卡号" align="center"></el-table-column>
				<el-table-column prop="cardName" label="持卡人" align="center"></el-table-column>
                <el-table-column prop="money" label="提现金额" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span v-html="getAuditStatus(scope.row.status)"></span>
						</template>
				</el-table-column>
                <el-table-column label="申请时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="openDialog(scope.row.id)">查看详情</el-button>
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
			
			<!-- 审核弹框 -->
			<el-dialog title="提现详情" :visible.sync="dialog" width="30%" v-if="form.apply">
				<el-descriptions :column="1" border >					
					<el-descriptions-item label="申请提现金额">
						<span v-if="form.apply">{{form.apply.money}}元</span>
					</el-descriptions-item>				
					<el-descriptions-item label="开户行">
						<span v-if="form.card">{{form.card.bankName}}</span>
					</el-descriptions-item>
					<el-descriptions-item label="持卡人姓名">
						<span v-if="form.card">{{form.card.cardName}}</span>
					</el-descriptions-item>
					<el-descriptions-item label="卡号">
						<span v-if="form.card">{{form.card.cardNum}}</span>
					</el-descriptions-item>
					<el-descriptions-item label="审核状态" v-if="form.apply.status">
						<span v-if="form.apply" v-html="getAuditStatus(form.apply.status)"></span>
					</el-descriptions-item>
					<el-descriptions-item label="拒绝原因" v-if="form.apply.status==-1">
						<span v-if="form.apply" style="color: red;">{{form.apply.refuseReason}}</span>
					</el-descriptions-item>
					<el-descriptions-item label="审核时间">
						<span v-if="form.apply">{{ $moment(form.apply.auditTime).format("Y-MM-DD HH:mm")}}</span>
					</el-descriptions-item>
				</el-descriptions>
				</el-dialog>
        </main-content>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            load: false,
            params: {
                pageSize: 10,
                pageNo: 1,
                isCount: true,
				startTime: "",
				endTime: "",
            },
            total: 0,
			date: "",
			detail:{},
			form:{},
			dialog:false
        };
    },

    mounted() {
		let url = this.$route.fullPath;
		if (url.indexOf("?") != -1) {
			this.params.id = url.substr(url.indexOf("=") + 1);			
		}
        this.search()
		this.withdrawalDetail()
    },

    methods: {
		//时间改变
		dateSearch() {
			if (this.date != null) {
				this.params.startTime = this.$moment(this.date[0]).format(
					"Y-MM-DD " + "23:59:59"
				);
				this.params.endTime = this.$moment(this.date[1]).format(
					"Y-MM-DD " + "23:59:59"
				);
			} else {
				this.params.startTime = ""
				this.params.endTime = ""
			}
			this.search();
		},		
        search(){
            this.params.pageNo = 1
            this.params.isCount = true
            this.getList()
        },

        getList() {
            this.load = true
            this.$request.post({
                url: 'merchant/merchantApply/list',
                params: this.params,
                success: result => {
                    if (this.params.isCount) {
                        this.total = result.total
                    }
                    this.params.isCount = false
                    this.list = result.list
                },
                finally: () => {
                    this.load = false
                }
            })
        },

        getAuditStatus(status) {
        	switch (status) {
        		case 0:
        			return "<font style='color: #3c86ef'>审核中</font>"
        		case 1:
        			return "<font style='color: #76c379'>已通过</font>"
        		case -1:
        			return "<font style='color: red'>已拒绝</font>"
        	}
        },
		withdrawalDetail() {
			this.$request.post({
				url: "merchant/merchantBankCard/withdrawalDetail",
				success: (result) => {
					this.detail = result
				},
			});
		},
		openDialog(id){
			this.form={}
			this.$request.post({
			    url: 'merchant/merchantApply/detail',
			    params: {id},
			    success: result => {
			       this.form=result
				   this.dialog=true
			    },
			    finally: () => {
			        this.load = false
			    }
			})
		}
    }

}
</script>

<style>

</style>

<style scoped>
.page {
    text-align: right;
    margin-top: 20px;
}
</style>
