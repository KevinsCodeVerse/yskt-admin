<!-- 新闻分类 -->
<template>
  <div class="department_page">
    <div class="header_box">
      <span @click="handleAdddepartment">
        <HeaderBtn v-permission="'admin/adDepartment/add'" name="el-icon-plus">添加部门</HeaderBtn>
      </span>
    </div>

    <div class="tree_box">
      <el-tree
        :data="departmentData"
        node-key="id"
        default-expand-all
        ref="departmentRef"
        highlight-current
        :props="defaultProps"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <div>
            <span v-permission="'admin/adDepartment/add'" @click.stop="handleAdd(data)" class="edit_box"
              ><i
                class="el-icon-plus
"
              ></i
            ></span>
            <span v-permission="'admin/adDepartment/edit'"   @click.stop="handleEdit(data)" class="edit_box"><i class="el-icon-edit"></i></span>
            <span v-permission="'admin/adDepartment/remove'"  @click.stop="handleDelete(data)" class="edit_box del_box"><i class="el-icon-delete"></i></span>
          </div>
        </div>
      </el-tree>
    </div>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
  </div>
</template>

<script>
import HeaderBtn from "@/components/HeaderBtn/index.vue";
import request from "@/utils/request";
import AddDialog from "./addDialog.vue";
import { deepClone, listToTree } from "../../../../utils/tools";
export default {
  components: { HeaderBtn, AddDialog },
  data() {
    return {
      departmentData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },

  created() {
    this.getTreeList();
  },

  methods: {
    getTreeList() {
      request.post({
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          id: sessionStorage.getItem("id")
        },
        success: (res) => {
          this.departmentData = listToTree(res);
          
        },
      });
    },
    handleSuccess() {
      this.getTreeList();
    },
    handleAdd(data) {
      console.log(data);
      this.$refs.addDialog.open(this.departmentData, data);
    },
    handleEdit(data) {
      this.$refs.addDialog.edit(data, this.departmentData);
    },
    handleAdddepartment() {
      this.$refs.addDialog.open(this.departmentData);
    },
    handleDelete(row) {
      this.$confirm("此操作将会删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adDepartment/remove",
            params: {
              id: row.id,
            },
            success: (res) => {
              this.$message.success(res);
              this.getTreeList();
            },
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="scss">
.department_page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  transition: 0.3s;
  border: 1px solid #a9adb5;
  box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
  border-radius: 4px;
  .header_box {
    text-align: right;
    margin: 10px 0px;
  }

  .tree_box {
    padding-right: 60px;
    padding-left: 20px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
  .el-tree-node__content {
    margin-top: 10px;;
  }
  .edit_box {
    padding-right: 20px;
    &:hover {
      color: #167cf3;
    }
  }
  .del_box:hover {
    color: red;
  }
}
</style>
