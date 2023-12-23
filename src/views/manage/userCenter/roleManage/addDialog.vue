<!-- 添加角色谈款 -->
<template>
  <div>
    <el-dialog
      title="添加角色"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="60%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="roleRule"
        ref="roleRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <jat-input
            v-model="addData.roleName"
            placeholder="请输入您要添加的角色名称"
          ></jat-input>
        </el-form-item>
      </el-form>
      <div class="dialog_content">
        <el-tree
          class="tree_box"
          :data="menuList"
          show-checkbox
          node-key="id"
          default-expand-all
          ref="tree"
          @node-expand="handleExpand"
          :props="defaultProps"
        >
          <p
            class="custom-tree-node"
            slot-scope="{ node }"
            :class="{ foo: node.level == 3 }"
          >
            <span>{{ node.label }}</span>
            <span
              @click.stop="handleAddInterface(node)"
              v-if="node.level == 2"
              class="add_box"
            >
              <i class="el-icon-circle-plus-outline"></i>
            </span>
          </p>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <jat-button plain @click="close">取 消</jat-button>
        <jat-button @click="handleSubmitRoles">确 定</jat-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加接口"
      :close-on-click-modal="false"
      :visible.sync="addInterfaceVisible"
      width="30%"
      @close="closeInterface"
    >
      <el-form
        label-position="right"
        label-width="100px"
        ref="intefaceRef"
        :rules="interfaceRules"
        :model="interfaceData"
      >
        <el-form-item label="接口名称:" prop="menuName">
          <jat-input v-model="interfaceData.menuName"></jat-input>
        </el-form-item>
        <el-form-item label="接口路径:" prop="requestUrl">
          <jat-input v-model="interfaceData.requestUrl"></jat-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <jat-button plain @click="closeInterface">取 消</jat-button>
        <jat-button @click="handleSubmitInterface">确 定</jat-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../../utils/request";

export default {
  data() {
    return {
      addModifyVisible: false,
      addInterfaceVisible: false,
      addData: {
        roleName: "",
        id: "",
      },
      roleRule: {
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      interfaceRules: {
        menuName: [
          { required: true, message: "请输入接口名称", trigger: "blur" },
        ],
        requestUrl: [
          { required: true, message: "请输入接口路径", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      menuList: [],
      interfaceData: {
        parentId: "",
        menuName: "",
        requestUrl: "",
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.addData.roleName = "";
      this.addModifyVisible = true;
      this.getRoleTree();
    },
    edit(id) {
      this.getRoleTree();
      this.addModifyVisible = true;
      this.getRoleInfo(id);
    },
    close() {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
      }
      this.$refs.roleRef && this.$refs.roleRef.clearValidate()
      this.addModifyVisible = false;
    },
    closeInterface() {
      this.interfaceData = {
        parentId: "",
        menuName: "",
        requestUrl: "",
      };
      this.$refs.intefaceRef && this.$refs.intefaceRef.clearValidate()
      this.addInterfaceVisible = false;
    },
    getRoleTree() {
      request.post({
        url: "/admin/adInfoRole/getAllMenuPre",
        params: {},
        success: (res) => {
          this.menuList = res;
          this.handleExpand();
        },
      });
    },
    getRoleInfo(id) {
      this.addData.id = id;
      request.post({
        url: "/admin/adRole/detail",
        params: {
          id,
        },
        success: (res) => {
          this.$refs.tree.setCheckedKeys(res.adRoleMenuList);
          this.addData.roleName = res.role.roleName;
        },
      });
    },
    handleExpand() {
      //节点被展开时触发的事件
      //因为该函数执行在renderContent函数之前，所以得加定时
      setTimeout(() => {
        this.changeCss();
      }, 10);
    },
    changeCss() {
      var levelName = document.querySelectorAll(".foo"); // levelname是上面的最底层节点的名字
      for (var i = 0; i < levelName.length; i++) {
        // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
        levelName[i].parentNode.style.cssFloat = "left"; // 最底层的节点，包括多选框和名字都让他左浮动
        levelName[i].parentNode.style.styleFloat = "left";
        levelName[i].parentNode.onmouseover = function() {
          this.style.backgroundColor = "#fff";
        };
      }
    },
    handleAddInterface(node) {
        console.log(node);
      this.addInterfaceVisible = true;
      this.interfaceData.parentId = node.data.id;
    },
    handleSubmitInterface() {
      this.$refs.intefaceRef.validate((valid) => {
        if (valid) {
          request.post({
            url: "/admin/adMenu/public/addInterface",
            params: this.interfaceData,
            success: (res) => {
              this.$message.success(res);
              this.closeInterface();
              this.getRoleTree();
            },
          });
        }
      });
    },
    handleSubmitRoles() {
      this.$refs.roleRef.validate((valid) => {
        if (valid) {
          const menus = this.$refs.tree.getCheckedKeys();
          const halfMenus = this.$refs.tree.getHalfCheckedKeys();
          let flag = true;
          if (this.addData.id) {
            flag = false;
            request.post({
              url: "/admin/adRole/roleChangeMenuPre",
              params: {
                menuIds: JSON.stringify([...menus, ...halfMenus]),
                id: this.addData.id,
              },
              success: (res) => {
                flag = true;
              },
            });
          }
          if (flag) {
            request.post({
              url: "/admin/adRole/add",
              params: {
                menuIds: this.addData.id
                  ? undefined
                  : JSON.stringify([...menus, ...halfMenus]),
                name: this.addData.roleName,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog_content {
  height: 500px;
  overflow: auto;
}
</style>
<style>
/* 控制树形节点横向显示 */
.tree_box {
  /* margin-top: 20px; */
}
.add_box {
  font-size: 16px;
  padding-left: 10px;
  cursor: pointer;
  color: #167cf3;
}
</style>
