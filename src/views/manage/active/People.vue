<template>
	<div id="sys_params">
		<main-head><i id="head" class="iconfont icontixian"></i>商家提现审核</main-head>

		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="报名时间">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()" clearable>
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>

			<el-table :data="list" stripe style="width: 100%" v-loading="load">
        <el-table-column prop="id" label="记录id" align="center"></el-table-column>
				<el-table-column prop="activityId" label="活动id" align="center"></el-table-column>
				<el-table-column prop="activityTitle" label="活动标题" align="center"></el-table-column>
				<el-table-column prop="nick" label="微信昵称" align="center"></el-table-column>
				<el-table-column prop="avatar" label="头像" align="center" width="200">
					<template slot-scope="scope">
						<el-image style="width: 70px; height: 70px; border-radius: 50%" :src="scope.row.avatar"
							:preview-src-list="scope.row.avatar.split(',')">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span v-html="getAuditStatus(scope.row.status)"></span>
					</template>
				</el-table-column>
				<el-table-column label="报名时间" align="center">
					<template slot-scope="scope">
						<span>{{
						  $moment(scope.row.createTime).format("Y-MM-DD HH:mm:ss")
						}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="120">
					<template slot-scope="scope">
						<el-button type="primary" @click="openDialog(scope.row.id)" size="mini">
							<i class="iconfont iconxiangqing-"></i>详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination class="page" background :layout="
          $store.state.isPhone
            ? 'total, prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        " :current-page.sync="params.pageNo" :page-size.sync="params.pageSize" :total="total" @size-change="search"
				@current-change="getList">
			</el-pagination>
		</main-content>
		
		<!-- 详情弹框 -->
		<el-dialog title="详情" :visible.sync="dialog" width="30%">
			<el-descriptions :column="1" border>

        <el-descriptions-item
            label="记录ID"
            v-if="!service.check.isNull(detail.recordId)"
        >
          {{detail.recordId}}
        </el-descriptions-item>

        <el-descriptions-item
            label="昵称"
            v-if="!service.check.isNull(detail.nick)"
        >
					{{detail.nick}}
				</el-descriptions-item>

				<el-descriptions-item
            label="头像"
            v-if="!service.check.isNull(detail.avatar)"
        >
					<el-image
              style="width: 50px; height: 50px; border-radius: 50%"
              :src="detail.avatar"
              v-if="detail.avatar"
          >
					</el-image>
				</el-descriptions-item>

        <el-descriptions-item
            label="报名时间"
            v-if="!service.check.isNull(detail.registrationTime)"
        >
          {{service.timeFormat.time7(detail.registrationTime)}}
        </el-descriptions-item>

        <el-descriptions-item
            label="活动ID"
            v-if="!service.check.isNull(detail.activityId)"
        >
          {{detail.activityId}}
        </el-descriptions-item>

        <el-descriptions-item
            label="报名费用"
            v-if="detail.hasCost === 1
            && !service.check.isNull(detail.cost)"
        >
          {{detail.cost}}
        </el-descriptions-item>

        <el-descriptions-item
            label="活动开启时间"
            v-if="!service.check.isNull(detail.openTime)"
        >
          {{service.timeFormat.time7(detail.openTime)}}
        </el-descriptions-item>

        <el-descriptions-item
            label="活动结束时间"
            v-if="!service.check.isNull(detail.overTime)"
        >
          {{service.timeFormat.time7(detail.overTime)}}
        </el-descriptions-item>

			</el-descriptions>
		</el-dialog>
	</div>
</template>

<script>
	import editor from '@/components/utils/CustomWangEditor';
	import upload from '@/components/utils/Upload';
  import msg from '@/utils/message'
  import service from "../../../utils/service";
	export default {
		components: {
			editor,
			upload
		},
		data() {
			return {
			  service: service,
				refusedDialog: false,
        detail: {},
				dialog: false,
				date: "",
				list: [],
				load: false,
				params: {
					name: "",
					pageSize: 10,
					pageNo: 1,
					isCount: true,
					startTime: "",
					endTime: "",
					id: "",
				},
				total: 0,
				rule: {
					refuseReason: {
						message: "请输入拒绝原因",
						required: true
					},
				}
			};
		},

		mounted() {
			this.search();
		},

		methods: {
			search() {
				this.params.pageNo = 1;
				this.params.isCount = true;
				this.getList();
			},

			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantActivity/registerPeopleList",
					params: this.params,
					success: (result) => {
            console.log(result)
						if (this.params.isCount) {
							this.total = result.total;
						}
						this.params.isCount = false;
						this.list = result.list;
					},
					finally: () => {
						this.load = false;
					},
				});
			},

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

			openDialog(id) {
			  let _t = this;
        // 报名记录详情
        this.$request.post({
          url: "merchant/merchantActivity/registerDetail",
          params: {
            id
          },
          success: (result) => {
            console.log(" merchant/merchantActivity/registerDetail : ", result)
            _t.detail = result;
            _t.dialog = true;
          },
          error: (res) => {
            msg.error(res.result)
          }
        });
			},
			getAuditStatus(status) {
				switch (status) {
					case 0:
						return "<font style='color: #a4b0be'>待支付</font>"
					case 1:
						return "<font style='color: #eccc68'>已报名</font>"
          case 2:
            return "<font style='color: #7bed9f'>已签到</font>"
					case -1:
						return "<font style='color: #ff6b81'>已取消</font>"
				}
			}
		},
	};
</script>

<style scoped>
	.page {
		text-align: right;
		margin-top: 20px;
	}

	#head {

		font-size: 30px;
	}

	.img {
		width: 20%;
		height: 15%;
		border-radius: 10%;
		margin-left: 10px;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, .5);
		-moz-box-shadow: 3px 3px 3px rgba(0, 0, 0, .5);
		-webkit-box-shadow: 3px 3px 3px rgba(81, 81, 81, 0.5);
	}

	.iconfont {
		font-size: 10px;
		margin-right: 3px;
	}
</style>
