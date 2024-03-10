<!-- 详情 -->
<template>
  <div>
    <el-drawer :visible.sync="drawer" title="详情">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            课程名称
          </template>
          {{ info.courseName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            作业名称
          </template>
          {{ info.workName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            作业标题
          </template>
          {{ info.subWorkName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            讲师
          </template>
          {{ info.teacherName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            作业案例图
          </template>
          <el-image
            :src="info.caseUrl"
            style="width: 100px;"
            fit="contain"
            :preview-src-list="[info.caseUrl]"
            :lazy="true"
          ></el-image>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            提交人
          </template>
          {{ info.vipName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            提交的作业
          </template>
          <div  style="display:flex;gap: 20px">
          <el-image
              v-for="(item, index) in info.workUrl" :key="index"
            :src="item"
            style="width: 100px;"
            fit="contain"
            :preview-src-list="[info.workUrl]"
            :lazy="true"
          ></el-image>
          </div>
        </el-descriptions-item>

        <el-descriptions-item v-if="info.comment">
          <template slot="label">
            点评
          </template>
          {{ info.comment }}
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
      info: {},
    };
  },

  methods: {
    open(row) {
      this.info = row;
      console.log(this.info);
      this.drawer = true;
    },
    close() {
      this.drawer = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
