<!-- 首页 -->
<template>
  <div class="middle-main">
    <div class="header_block_list">
      <div
        v-for="key in Object.keys(headerList)"
        :key="key"
        :class="key + '_box'"
        class="item"
      >
        <div class="icon_block"><svg-icon :icon-class="key"></svg-icon></div>
        <div class="right_info">
          <span>{{ dictList[key] }}</span>
          <span>{{ headerList[key] }}</span>
        </div>
      </div>
    </div>
    <div class="middle_box">
      <jat-echarts class="jat-echart" :options="tkfbEchartJson"></jat-echarts>
      <jat-echarts class="jat-echart" :options="tkfbEchartJson"></jat-echarts>
    </div>
  </div>
</template>

<script>
import JatEcharts from "../../components/jatEcharts.vue";
import { echartsJson } from "@/const/echarts/echarts";

export default {
  components: { JatEcharts },
  data() {
    return {
      tkfbEchartJson: echartsJson.bar,
      headerList: {
        dcldd: 4, //待处理的订单
        dbzdd: 7550, //待报账dingd
        jhys: 3442, //计划应收
        ywcys: 3433, //已收
        ws: 32, //未收
        jhml: 34, //计划毛利，
        ywcml: 34345,
        ddsl: 5435345,
      },
      dictList: {
        dcldd: "待处理的订单",
        dbzdd: "待报账订单",
        jhys: "计划应收",
        ywcys: "已收",
        ws: "未收",
        jhml: "计划毛利",
        ywcml: "已完成毛利",
        ddsl: "订单数量",
      },
    };
  },
  created() {
    this.initEchart();
  },

  mounted() {
    this.$pubsub.publish("addTabs", {
      parentLabel: "首页",
      path: "/index",
      label: "首页",
    });
    this.$pubsub.publish("breadcrumb", [
      {
        name: "首页",
      },
      {
        name: "首页",
      },
    ]);
  },

  methods: {
    initEchart() {
      this.tkfbEchartJson.series = [];
      this.tkfbEchartJson.grid.top = "30px";
      this.tkfbEchartJson.legend = false;
      this.tkfbEchartJson.xAxis = echartsJson.commonJSon.AxisCategory;
      this.tkfbEchartJson.tooltip.axisPointer = {
        type: "line",
        lineStyle: {
          type: "solid",
          width: 2,
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(5,232,178,0.00)" },
            { offset: 0.5, color: "#02CD7A" },
            { offset: 1, color: "rgba(5,232,178,0.00)" },
          ]),
        },
      };
      this.tkfbEchartJson.yAxis.name = "单位：次";
      this.tkfbEchartJson.grid.bottom = "10px";
      this.tkfbEchartJson.series.push({
        data: [],
        type: "line",
        name: "访问次数",
        showBackground: true,
        areaStyle: {
          color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#02CD7A" },
            { offset: 1, color: "rgba(5,232,178,0.00)" },
          ]),
        },
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: "#02CD7A",
          },
        },
        emphasis: {
          scale: 1.4,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.header_block_list {
  display: flex;
  flex-wrap: wrap;
  .item {
    background: #ccc;
    width: 15%;
    height: 100px;
    margin-right: 25px;
    margin-top: 25px;
    border-radius: 5px;
    &:last-child {
      margin-right: 0px;
    }
    display: flex;
	align-items: center;
	box-sizing: border-box;
	padding: 10px;
    .icon_block {
      width: 20%;
      font-size: 60px;
      color: #fff;
    }
	.right_info {
		padding-left: 20px;
		display: flex;
		flex-direction: column;
	}
  }
}
.middle_box {
	display: flex;
	justify-content: space-between;
  margin: 20px 0px;
  .jat-echart {
    width: 49%;
    height: 300px;
  }
}
</style>
