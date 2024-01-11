<!-- 应收款管理 -->
<template>
  <div class="middle-container">
    <div class="header-box">
      <div class="BasicInfo_title" v-if="headerTab.length > 0">
        <span
          v-for="tab in headerTab"
          :key="tab.id"
          :class="{ is_active: tab.isChecked }"
          @click="handleTabSelect(tab)"
          >{{ tab.name }}</span
        >
      </div>
    </div>
    <component :is="currentComponet"></component>
  </div>
</template>

<script>
import Canceled from "./canceled.vue";
import OutstandingCharges from "./outstandingCharges.vue";
import receivable from "./receivable.vue";
import payoutDetail from "./payoutDetail.vue";


export default {
  name: "receivablesManagerPage",
  components: { payoutDetail, OutstandingCharges, Canceled, receivable },
  data() {
    return {
      currentComponet: receivable,
      headerTab: [
        {
          id: 1,
          name: "应收款",
          component: receivable,
          isChecked: true,
        },
        {
          id: 2,
          name: "收款明细",
          component: payoutDetail,
          isChecked: false,
        },
        {
          id: 3,
          name: "未结清收款",
          component: OutstandingCharges,
          isChecked: false,
        },
        {
          id: 4,
          name: "已取消",
          component: Canceled,
          isChecked: false,
        },
      ],
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    handleTabSelect(tab, flag) {
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
      if (this.$route.query.type) {
      const id = this.$route.query.type;
      const item = this.headerTab.find((item) => item.id == id);
      if (item) {
        this.handleTabSelect(item, true);
      }
    } else {
      this.$router.replace({
        path: this.$router.path,
        query: { type: 1 },
      });
    }
    }
  },
  watch:{
  	//监听路由
  	//监听路由的categoryId属性的数据变化
    '$route.query.orderNum': function(val){
    	if(val) {
        this.init()
      }
    }
  }
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
  margin: 10px 13px;
  // margin-top: 0px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: hwb(0 40% 60%);
  display: inline-block;
  background: #eceff3;
  border-radius: 4px;

  span {
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
