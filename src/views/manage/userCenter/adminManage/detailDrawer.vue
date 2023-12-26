<!-- 详情 -->
<template>
  <div>
    <el-drawer :visible.sync="drawer" title="详情">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-unlock"></i>
            角色权限
          </template>
          {{ info.roles }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          {{ info.account }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            真实姓名
          </template>
          {{ info.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联系电话
          </template>
          {{ info.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg-icon icon-class="wechat"></svg-icon>
            微信
          </template>
          {{ info.qq }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            QQ
          </template>
          {{ info.wechat }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            性别
          </template>
          {{ info.gender }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            部门
          </template>
          {{ info.departmentId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            可查看部门
          </template>
          {{ info.departments }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            用户状态
          </template>
          <el-tag size="small">{{ info.status }}</el-tag>
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
        qq: "111",
        gender: 1,
        adStatus: 0,
        departmentId: 12,
        roles: "角色2,推广专员",
        wechat: "111",
        version: 0,
        canSeeDepartment: "[1,11,12,13]",
        score: 0,
        vipLevel: 0,
        tradeCount: 0,
        createTime: 1703572925000,
        phone: "111",
        name: "111",
        departments: "推广部,鹏飞课堂",
        id: 7,
        account: "pfk7642",
        status: 0,
      },
    };
  },

  methods: {
    open(data) {
      this.info = data;
      this.drawer = true;
    },
    close() {
      this.drawer = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
