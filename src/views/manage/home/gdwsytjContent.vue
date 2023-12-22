<template>
  <div class="gdwsytjContent" :class="{ BIClass: source === 'BI' }">
    <div class="gdwsytjContent__Title">
      <span class="gdwsytjContent__Title__Item">标题</span>
      <span class="gdwsytjContent__Title__Item">日期</span>
    </div>
    <autoScrollTable
      style="height: calc(100% - 44px)"
      :list="data"
      :speed="0.8"
      :waitTime="300"
      :singleHeight="44"
    >
      <div
        class="gdwsytjContent-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <span class="tvalue" :title="item.name">{{ item.pm }}</span>
        <span class="tvalue">{{ item.xm }}</span>
        <span class="tvalue">{{ item.jh }}</span>
        <span class="tvalue">{{ item.dw }}</span>
        <span class="tvalue">{{ item.fs }}</span>
      </div>
    </autoScrollTable>
    <div v-if="false" style="width: 100%; height: 100%; overflow-y: auto">
      <div
        class="gdwsytjContent-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <span class="tvalue" :title="item.name">{{ item.name }}</span>
        <span class="tvalue">{{ item.xm }}</span>       
      </div>
    </div>
  </div>
</template>
<script>
import autoScrollTable from "@/views/component/autoScrollTable.vue"
export default {
  name: "gdwsytjContent",
  data() {
    return {}
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    source: {
      type: String,
      default: ""
    }
  },
  components: {
    autoScrollTable
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.gdwsytjContent {
  display: flex;
  flex-direction: column;
  height: calc(100% - 32px);
  padding-bottom: 10px;
  box-sizing: border-box;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 400;
  .gdwsytjContent__Title {
    width: 100%;
    height: 44px;
    background: #f6f9fd;
    .gdwsytjContent__Title__Item {
      display: inline-block;
      height: 44px;
      padding-left: 10px;
      font-size: 14px;
      font-weight: 600;
      line-height: 44px;
      box-sizing: border-box;
      width: 20%;
      &:nth-child(1) {
        width: 80%;
      }
      &:nth-child(2) {
        width: 20%;
      }
    }
  }

  .gdwsytjContent-item {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 44px;
    line-height: 44px;
    border: 1px solid transparent;
    transform-origin: center top;
    backface-visibility: hidden;

    &:nth-child(2n) {
      background: #f6f9fd;
    }

    .tvalue {
      display: inline-block;
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      width: 20%;
      &:nth-child(1) {
        width: 10%;
      }
      &:nth-child(4) {
        width: 30%;
      }
    }
  }
}
.BIClass {
  color: #e8f4ff;
  margin-top: 10px;
  .gdwsytjContent__Title {
    height: 36px;
    background: rgba(37, 128, 206, 0.2);
    margin-bottom: 10px;
    padding-left: 28px;
    .gdwsytjContent__Title__Item {
      height: 36px;
      font-weight: 600;
      line-height: 36px;
    }
  }

  .gdwsytjContent-item {
    height: 36px;
    line-height: 36px;
    margin-bottom: 10px;
    background: rgba(37, 128, 206, 0.2);
    position: relative;
    padding-left: 28px;
    &:nth-child(2n) {
      background: rgba(37, 128, 206, 0.2);
    }
    &:nth-child(1) {
      background: rgba(215, 131, 55, 0.4);
      &::before {
        display: inline-block;
        width: 27px;
        height: 27px;
        background: url("../../../assets/BI/mxxyTop1.png") no-repeat;
        position: absolute;
        left: 8px;
        top: 6px;
        content: "";
      }
    }
    &:nth-child(2) {
      background: rgba(215, 75, 55, 0.4);
      &::before {
        display: inline-block;
        width: 27px;
        height: 27px;
        background: url("../../../assets/BI/mxxyTop2.png") no-repeat;
        position: absolute;
        left: 8px;
        top: 6px;
        content: "";
      }
    }
    &:nth-child(3) {
      background: rgba(55, 124, 215, 0.4);
      &::before {
        display: inline-block;
        width: 27px;
        height: 27px;
        background: url("../../../assets/BI/mxxyTop3.png") no-repeat;
        position: absolute;
        left: 8px;
        top: 6px;
        content: "";
      }
    }
  }
}
</style>
