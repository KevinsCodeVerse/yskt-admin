<template>
  <div class="gyhcksTopTen BIContent__Right__ajlx">
    <div
      class="progressItem"
      v-for="(item, index) in data"
      :key="item.name + index"
      :class="'progressItem' + (index + 1)"
    >
      <div class="hexagon" :class="'hexagon' + (index + 1)">
        TOP {{ index + 1 }}
      </div>
      <div class="progressName">
        <div class="progressName__Num">{{ item.value }}</div>
        <div class="progressName__Title">{{ item.name }}</div>
      </div>
      <el-progress
        :text-inside="false"
        :show-text="true"
        :stroke-width="10"
        :text-color="'#fff'"
        :format="
          () => {
            return ''
          }
        "
        :percentage="(item.value / maxVal) * 100"
      ></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    maxVal: {
      type: Number,
      default: 100
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.gyhcksTopTen {
  height: calc(100% - 40px) !important;

  .progressItem {
    position: relative;
    padding-left: 60px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .hexagon {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 30px;
    margin-right: 12px;
    overflow: hidden;
    line-height: 20px;
    color: #666;
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
    font-weight: 900;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-backface-visibility: hidden;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-backface-visibility: hidden;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -ms-backface-visibility: hidden;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    backface-visibility: hidden;
  }

  .hexagon1 {
    color: #d80921;
  }
  .hexagon2 {
    color: #ff6600;
  }

  .hexagon3 {
    color: #fb9c00;
  }

  /deep/.el-progress-bar {
    padding-right: 0;
    margin-right: 0;
  }

  .progressName {
    display: inline-block;
    width: 100%;
    min-width: 100%;

    .progressName__Title {
      overflow: hidden;
      font-size: 14px;
      color: #333;
      text-overflow: ellipsis;
      white-space: nowrap;
      transform: translateZ(0);
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-backface-visibility: hidden;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -moz-backface-visibility: hidden;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -ms-backface-visibility: hidden;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      backface-visibility: hidden;
    }

    .progressName__Num {
      float: right;
      min-width: 20px;
      margin-left: 10px;
      overflow: hidden;
      color: #333333;
      letter-spacing: 0;
      line-height: 14px;
      font-weight: 600;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-backface-visibility: hidden;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -moz-backface-visibility: hidden;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -ms-backface-visibility: hidden;
      /* stylelint-disable-next-line property-no-vendor-prefix */
      backface-visibility: hidden;
    }
  }

  /deep/.el-progress-bar__outer {
    background: #eff3f9 !important;
  }

  /deep/.el-progress-bar__outer,
  /deep/.el-progress-bar__inner {
    border-radius: 5px !important;
  }

  .el-progress-bar__inner {
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 100%;
      content: "";
    }
  }
  .progressItem {
    /deep/.el-progress-bar__inner {
      z-index: 999;
      height: 10px;
      background-image: linear-gradient(270deg, #6bd1ff 0%, #1c7dff 100%);
    }
  }
  .progressItem1 {
    /deep/.el-progress-bar__inner {
      z-index: 999;
      height: 10px;
      background-image: linear-gradient(270deg, #ff2b3e 0%, #d80921 100%);
    }
  }

  .progressItem2 {
    /deep/.el-progress-bar__inner {
      z-index: 999;
      display: inline-block;
      height: 10px;
      background-image: linear-gradient(270deg, #ffb455 0%, #ff6600 100%);
      content: "";
    }
  }
  .progressItem3 {
    /deep/.el-progress-bar__inner {
      z-index: 999;
      display: inline-block;
      height: 10px;
      background-image: linear-gradient(270deg, #fad961 0%, #fda700 100%);
      content: "";
    }
  }
}
</style>
