<!-- 应收款管理 -->
<template>
  <div class="middle-container">
    <div class="header-box">
      <div class="BasicInfo_title" v-if="headerTab.length > 0">
        <div
          v-for="tab in headerTab"
          :key="tab.id"
          v-permission="tab.permission"
          class="item"
          :class="{ is_active: tab.isChecked }"
          @click="handleTabSelect(tab)"
        >
          <span :class="'tab_' + tab.id">{{ tab.name }}</span>
        </div>
      </div>
    </div>
    <component :is="currentComponet"></component>
  </div>
</template>

<script>
import courseWorkList from './courseWorkList.vue';
import submittedWork from './submittedWork.vue';


export default {
  name: "courseWork",
  components: { courseWorkList, submittedWork },
  data() {
    return {
      currentComponet: courseWorkList,
      headerTab: [
        {
          id: 1,
          name: "课程作业",
          component: courseWorkList,
          isChecked: true,
          permission: "admin/adCourseWork/list",
        },
        {
          id: 2,
          name: "作业提交列表",
          component: submittedWork,
          isChecked: false,
          permission: "admin/adCourseWorkSubmit/list",
        },
       
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleTabSelect(tab, flag) {
      // if() {}
      if (tab.id == this.$route.query.type && tab.isChecked) {
        return;
      }
      this.headerTab.forEach((item) => {
        item.isChecked = item.id == tab.id;
      });
      if (!flag) {
        this.$router.replace({
          path: this.$router.path,
          query: { type: tab.id },
        });
      }
      this.currentComponet = tab.component;
    },
    init() {
      const type = this.$route.query.type;
      if (type) {
        const dom = document.querySelector(".tab_" + type);
        if (!dom) {
          const currentTab = this.headerTab.find((item) => item.isChecked);
          this.$router.replace({
            path: this.$router.path,
            query: { type: currentTab.id },
          });
          return;
        }
        const item = this.headerTab.find((item) => item.id == type);
        if (item) {
          this.handleTabSelect(item, true);
        }
      } else {
        this.$router.replace({
          path: this.$router.path,
          query: { type: 1 },
        });
      }
    },
  },
  watch: {
    //监听路由
    //监听路由的orderNum属性的数据变化
    "$route.query.orderNum": function(val) {
      if (val) {
        this.init();
      }
    },
    "$route.query.type": function(val) {
      if (val) {
        this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-box {
  background: #fff;
  display: flex;
  align-items: center;
  border: 1px solid #a9adb5;
  border-bottom: 1px solid #cbced2;
  box-shadow: 0px 0px 8px 0px rgba(116, 136, 161, 0.5);
}
/deep/.FilterContent {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  // box-shadow: none;
  border-top: 1px;
  box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
  padding-top: 15px;
}
.BasicInfo_title {
  // display: inline-block;
  margin: 10px 13px;
  // margin-top: 0px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: hwb(0 40% 60%);
  display: inline-block;
  background: #eceff3;
  border-radius: 4px;

  div {
    display: inline-block;
    margin: 3px 3px;

    padding: 6px 12px;
    cursor: pointer;
    &.is_active {
      background: #167cf3;
      border-radius: 2px;
      font-size: 14px;
      color: #fff;
      border-radius: 2;
    }
  }
}
</style>
