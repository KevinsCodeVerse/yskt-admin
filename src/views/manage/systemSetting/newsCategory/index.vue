<!-- 新闻分类 -->
<template>
  <div class="newCategory_page">
    <div class="header_box">
      <span @click="handleAddNewCategory">
        <HeaderBtn name="el-icon-plus">添加新闻分类</HeaderBtn>
      </span>
    </div>

    <div class="tree_box">
      <el-tree
        :data="newCategoryData"
        node-key="id"
        default-expand-all
        ref="newCategoryRef"
        highlight-current
        :props="defaultProps"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <div>
            <span @click.stop="handleAdd(data)" v-if="node.level === 1" class="edit_box"
              ><i
                class="el-icon-plus
"
              ></i
            ></span>
            <span  @click.stop="handleEdit(data)" class="edit_box"><i class="el-icon-edit"></i></span>
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
export default {
  components: { HeaderBtn, AddDialog },
  data() {
    return {
      newCategoryData: [],
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
        url: "/system/sysNewsCategory/listNoPage",
        params: {},
        success: (res) => {
          this.newCategoryData = this.listToTree(res);
        },
      });
    },
    listToTree(list) {
      let info = list.reduce(
        (map, node) => ((map[node.id] = node), (node.children = []), map),
        {}
      );
      return list.filter((node) => {
        info[node.parentId] && info[node.parentId].children.push(node);
        return node.parentId == -1;
      });
    },
    handleSuccess() {
      this.getTreeList();
    },
    handleAdd(data) {
      this.$refs.addDialog.open(data);
    },
    handleEdit(data) {
      this.$refs.addDialog.edit(data);
    },
    handleAddNewCategory() {
      this.$refs.addDialog.open();
    },
  },
};
</script>
<style lang="scss">
.newCategory_page {
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
}
</style>
