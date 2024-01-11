<!-- 详情 -->
<template>
  <div>
    <el-drawer :visible.sync="drawer" title="详情">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            收款单位
          </template>
          {{ info.vipName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            数量
          </template>
          {{ info.count }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
           
            收款方式
          </template>
          {{ info.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            应收金额
          </template>
          {{ info.receivablePrice }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            收款明细
          </template>
          {{ info.aa }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            收款备注
          </template>
          {{ info.remark }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      info: {
    
      }
    };
  },

  methods: {
    open(row) {
      this.info = row
      this.drawer = true;
    },
    close() {
      this.info = {}
      this.drawer = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
