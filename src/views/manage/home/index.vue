<template>
  <div class="homeView">
    <div class="topCard">
      <div
        v-for="(item, index) in iconList"
        :key="index + 'iconList'"
        :span="24 / iconList.length"
        class="IconContent"
        :style="{
          'background-image': `url(${item.bg})`,
        }"
      >
        <div class="IconContent_item">
          <p class="IconContent_item_title elips">
            {{ item.title }}
          </p>
          <p class="tipNum elips">
            {{ overallStatisticsMap[item.value] }}
          </p>
        </div>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="contentBox">
          <div class="title">应收统计图</div>
          <jatEcharts class="jat-echart" :options="fwcsEchartJson"></jatEcharts>
        </div>
      </el-col>
      <el-col :span="10"
        ><div class="contentBox">
          <div class="title">公司新闻</div>
          <gdwsytjContent :data="mxxyList" /></div
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="14"
        ><div class="contentBox">
          <div class="title">毛利统计图</div>
          <jatEcharts
            class="jat-echart"
            :options="mlLineEchartJson"
          ></jatEcharts></div
      ></el-col>
      <el-col :span="10"
        ><div class="contentBox">
          <div class="title">当前应收交易TOP10</div>
          <gyhcksTopTenVue :data="topLists" :maxVal="maxValue" /></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import gyhcksTopTenVue from "./gyhcksTopTen";
import gdwsytjContent from "./gdwsytjContent";
import jatEcharts from "@/components/jatEcharts.vue";
import { getSyztzs, getKspjf, getMxxy, getFwcs, getTkfb } from "./api.js";
import { deepClone } from "@/utils/tools";
import { echartsJson } from "@/const/echarts/echarts";
export default {
  name: "homeIndex",
  components: {
    gyhcksTopTenVue,
    gdwsytjContent,
    jatEcharts,
  },
  data() {
    return {
      iconList: [
        {
          title: "待处理的订单",
          value: "ztks",
          bg: require("@/assets/home/blue.png"),
        },
        {
          title: "待报账订单",
          value: "ztms",
          bg: require("@/assets/home/green.png"),
        },
        {
          title: "计划应收",
          value: "zsjs",
          bg: require("@/assets/home/orange.png"),
        },
        {
          title: "已完成应收",
          value: "zkss",
          bg: require("@/assets/home/red.png"),
        },
        {
          title: "待处理的订单",
          value: "ztks",
          bg: require("@/assets/home/blue.png"),
        },
        {
          title: "待报账订单",
          value: "ztms",
          bg: require("@/assets/home/green.png"),
        },
        {
          title: "计划应收",
          value: "zsjs",
          bg: require("@/assets/home/orange.png"),
        },
        {
          title: "已完成应收",
          value: "zkss",
          bg: require("@/assets/home/red.png"),
        },
      ],
      overallStatisticsMap: {
        ztks: "",
        ztms: "",
        zsjs: "",
        zkss: "",
      },
      topLists: [],
      maxValue: 0,
      mxxyList: [],
      fwcsEchartJson: deepClone(echartsJson.barLabelRotation),
      tkfbEchartJson: deepClone(echartsJson.pie),
      mlLineEchartJson: deepClone(echartsJson.lineStack),
      pieColor: [
        { color1: "#1dcbff", color2: "#1272fd" },
        { color1: "#00b36f", color2: "#00c56c" },
        { color1: "#f56565", color2: "#e63030" },
        { color1: "#ffb023", color2: "#ff9e2d" },
        { color1: "#db5e31", color2: "#db5e31" },
        { color1: "#2066db", color2: "#2066db" },
      ],
    };
  },
  created() {
    // this.initfsjdChart();
    this.getSyztzs();
    this.getKspjf();
    this.getMxxy();
    this.getFwcs();
    this.getTkfb();
  },
  methods: {
    initfsjdChart() {
      this.fwcsEchartJson.series = [];
      this.fwcsEchartJson.grid.top = "30px";
      this.fwcsEchartJson.legend = false;
      this.fwcsEchartJson.xAxis = echartsJson.commonJSon.AxisCategory;
      this.fwcsEchartJson.tooltip.axisPointer = {
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
      this.fwcsEchartJson.yAxis.name = "单位：次";
      this.fwcsEchartJson.grid.bottom = "10px";
      this.fwcsEchartJson.series.push({
        data: [],
        type: "bar",
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

      this.fwcsEchartJson.series.push({
        name: "Forest",
        type: "bar",
        barGap: 0,
        label: {
          rotate: 90,
          align: "left",
          verticalAlign: "middle",
          position: "insideBottom",
          distance: 15,
          formatter: "{c}  {name|{a}}",
          fontSize: 16,
          rich: {
            name: {},
          },
        },
        emphasis: {
          focus: "series",
        },
        data: [320, 332, 301, 334, 390],
      });
    },
    getSyztzs() {
      getSyztzs().then((res) => {
        let { ztks, zsjs, zkss, ztms } = res.data;
        this.overallStatisticsMap = {
          ztks,
          zsjs,
          zkss,
          ztms,
        };
      });
    },
    getKspjf() {
      this.topLists = [
        {
          name: "耐克衣服",
          value: 3000,
        },
        {
          name: "冠军衣服",
          value: 2000,
        },
        {
          name: "衣服",
          value: 1000,
        },
      ];
      this.maxValue = Math.max.apply(
        Math,
        this.topLists.map((o) => {
          return o["value"];
        })
      );
      console.log("aaa");
      // getKspjf().then((res) => {
      //   this.topLists = res.data;
      //   this.maxValue = Math.max.apply(
      //     Math,
      //     this.topLists.map((o) => {
      //       return o["value"];
      //     })
      //   );
      // });
    },
    getMxxy() {
      getMxxy().then((res) => {
        this.mxxyList = res.data;
      });
    },
    getFwcs() {
      getFwcs().then((res) => {
        let data = res.data;
        this.fwcsEchartJson.xAxis.data = [];
        this.fwcsEchartJson.series[0].data = [];
        data.forEach((item) => {
          this.fwcsEchartJson.xAxis.data.push(item.name);
          this.fwcsEchartJson.series[0].data.push({
            value: item.value,
            sub: "次",
          });
        });
      });
    },
    getTkfb() {
      getTkfb().then((res) => {
        let data = res.data;
        this.tkfbEchartJson.series[0].data = [];
        data.forEach((item, index) => {
          this.tkfbEchartJson.series[0].data.push({
            ...item,
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.pieColor[index % 6].color1 },
                { offset: 1, color: this.pieColor[index % 6].color2 },
              ]),
            },
          });
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.homeView {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  .topCard {
    // height: 163px;
    padding: 20px;
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid #a9adb5;
    box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-shrink: 0;
    margin-bottom: 20px;
    .IconContent {
      // flex: 1;
      margin-right: 20px;
      margin-bottom: 20px;
      padding: 20px 30px 20px 20px;
      width: 14.9%;
      box-sizing: border-box;
      position: relative;
      border-radius: 4px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      font-size: 14px;
      color: #fff;
      &:last-child {
        margin-right: 0;
      }
      .IconContent_item {
        flex: 1;
        min-width: 100px;
        text-align: left;
        .IconContent_item_title {
          margin: 0;
          margin-bottom: 38px;
          font-size: 16px;
          letter-spacing: 0;
          line-height: 16px;
          font-weight: 600;
          color: #fff;
        }
        .tipNum {
          margin: 0;
          font-size: 24px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: right;
          line-height: 24px;
          font-weight: 900;
        }
        .elips {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .el-row {
    height: 472px;
    margin-bottom: 20px;
    .el-col {
      height: 100%;
      .contentBox {
        box-sizing: border-box;
        height: 100%;
        padding: 20px;
        background: #ffffff;
        border: 1px solid #a9adb5;
        box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
        border-radius: 4px;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #000000;
          letter-spacing: 0;
          line-height: 16px;
          font-weight: 600;
          position: relative;
          margin: 0 0 16px;
          &::before {
            position: relative;
            display: inline-block;
            content: "";
            height: 16px;
            margin-right: 6px;
            top: 2px;
            width: 2px;
            background-image: linear-gradient(180deg, #1c83fb 0%, #0054b7 100%);
          }
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .jat-echart {
    height: calc(100% - 40px);
    box-sizing: border-box !important;
  }
}
</style>
