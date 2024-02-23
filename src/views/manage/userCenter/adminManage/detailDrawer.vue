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
            <svg-icon icon-class="qq"></svg-icon>
            QQ
          </template>
          {{ info.wechat }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg-icon icon-class="gender"></svg-icon>
            性别
          </template>
          {{ info.gender }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <svg-icon icon-class="department"></svg-icon>
            部门
          </template>
          {{ info.departments }}
        </el-descriptions-item>
<!--        <el-descriptions-item>-->
<!--          <template slot="label">-->
<!--            <svg-icon icon-class="department"></svg-icon>-->
<!--            可查看部门-->
<!--          </template>-->
<!--          {{ info.departments }}-->
<!--        </el-descriptions-item>-->

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            用户状态
          </template>
          <el-tag :type="statusDic[info.status].type" size="small">{{ statusDic[info.status].label }}</el-tag>
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
      statusDic: {
        "0": { label: "正常", type: "success" },
        "-1": { label: "冻结", type: "warning" },
        "-2": { label: "禁用", type: "danger" },
        "-3": { label: "未审核", type: "info" },
      },
    };
  },

  methods: {
    open(data, deparmentList) {
      const { departmentId, gender, status, ...rest } = data;
      const department = deparmentList.find((item) => item.id === departmentId);
      console.log(department);
      this.info = {
        departmentId: department ? department.name : "",
        gender: gender == 1 ? "男" : "女",
        status,
        ...rest,
      };
      this.drawer = true;
    },
    close() {
      this.drawer = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
