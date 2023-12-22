<template>
  <div id="sys_params">
    <main-head>
      <span slot="after">
        <el-button
          plain
          size="medium"
          @click="openDialog"
          type="primary"
          icon="el-icon-plus"
          >添加分类</el-button
        >
      </span>
    </main-head>
    <main-content>
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateSearch()"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="params.type"
            clearable
            placeholder="按类型筛选分类"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search()">搜索</el-button>
      </el-form>
      <el-table :data="list" stripe style="width: 100%" v-loading="load">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="type" label="分类类型" align="center">
          <template slot-scope="scope">          
            <span v-if="scope.row.type == 1">商品分类</span>
            <span v-if="scope.row.type == 2">蔬菜瓜果</span>
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="上级分类" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.parentId == null">暂无上级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类名称"
          align="center"
        ></el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
          <template slot-scope="scope">
            {{ scope.row.remark == null ? "暂无" : scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status == 0 ? "正常" : "已冻结" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{
              $moment(scope.row.createTime).format("Y-MM-DD HH:mm")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="danger"
              plain
              size="small"
              @click="deleteItem(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              @click="openUpdateDialog(scope.row)"
              >修改分类</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="page"
        background
        :layout="
          $store.state.isPhone
            ? 'total, prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        "
        :current-page.sync="params.pageNo"
        :page-size.sync="params.pageSize"
        :total="total"
        @size-change="search"
        @current-change="getList"
      >
      </el-pagination>

      <!-- 添加dialog -->
      <el-dialog title="添加分类" :visible.sync="addDialog" width="30%">
        <el-form
          :model="addForm"
          :label-width="labelWidth"
          :rules="rule"
          ref="form"
        >
          <el-form-item label="分类类型：" prop="type">
            <el-select
              v-model="addForm.type"
              clearable
              placeholder="按类型筛选分类"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称：" prop="name	">
            <el-input
              placeholder="请输入分类名称"
              v-model="addForm.name"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              placeholder="请输入备注"
              v-model="addForm.remark"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="add()">添加</el-button>
        </div>
      </el-dialog>

      <!-- 添加dialog -->
      <el-dialog title="修改分类" :visible.sync="updateDialog" width="30%">
        <el-form
          :model="updateForm"
          :label-width="labelWidth"
          :rules="rule"
          ref="form"
        >
          <el-form-item label="分类类型：" prop="type">
            <el-select
              v-model="updateForm.type"
              clearable
              placeholder="按类型筛选分类"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称：" prop="name">
            <el-input
              placeholder="请输入分类名称"
              v-model="updateForm.name"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              placeholder="请输入备注"
              v-model="updateForm.remark"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="updateItem()">修改</el-button>
        </div>
      </el-dialog>
    </main-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      options: [
        {
          value: 1,
          label: "商品分类",
        },
        {
          value: 2,
          label: "蔬菜瓜果分类",
        },      
      ],
      //表单Label宽度
      labelWidth: "100px",
      addForm: {
        type: "",
      },
      updateForm: {
        type: "",
      },
      addDialog: false,
      updateDialog: false,
      date: "",
      list: [],
      load: false,
      params: {
        pageSize: 10,
        pageNo: 1,
        isCount: true,
        startTime: "",
        endTime: "",
        type: "",
      },
      total: 0,
      rule: {
        name: {
          message: "请输入分类名称",
          required: true,
        },
        type: {
          message: "请选择类型",
          required: true,
        },
      },
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
        url: "system/sysCategory/list",
        params: this.params,
        success: (result) => {
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
      this.params.startTime = this.$moment(this.date[0]).format(
        "Y-MM-DD HH:mm:ss"
      );
      this.params.endTime = this.$moment(this.date[1]).format(
        "Y-MM-DD HH:mm:ss"
      );
      this.search();
    },
    //修改状态
    update(id) {
      let usId = id;
      this.$request.post({
        url: "admin/adUsInfo/updateStatus",
        params: { usId },
        success: (result) => {
          this.search();
        },
      });
    },
    cleanDialog() {
      this.addForm = {};
      this.updateFor = {};
    },
    openDialog(row) {
      this.cleanDialog();
      this.addDialog = true;
      console.log(row);
      this.form = row;
    },
    //添加分类
    add() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        this.$request.post({
          url: "system/sysCategory/addOrUpdate",
          params: this.addForm,
          success: (result) => {
            this.$message.success("添加成功");
            this.addDialog = false;
            this.cleanDialog();
            this.search();
          },
        });
      });
    },
    //删除
    deleteItem(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$request.post({
          url: "system/sysCategory/delete",
          params: {id},
          success: (result) => {
            this.$message.success(result);
            this.updateDialog = false;
            this.cleanDialog();
            this.search();
          },
        });
      });
    },

    openUpdateDialog(row) {
      this.cleanDialog();
      this.updateDialog = true;
      //浅拷贝
      this.updateForm=JSON.parse(JSON.stringify(row));  
    },
    //修改分类
    updateItem() {
		delete(this.updateForm.updateTime)
		delete(this.updateForm.createTime)
      this.$request.post({
        url: "system/sysCategory/addOrUpdate",
        params: this.updateForm,
        success: (result) => {
          this.$message.success(result);
          this.updateDialog = false;
          this.cleanDialog();
          this.search();
        },
      });
    },
  },
};
</script>

<style>
</style>

<style scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>

