<template>
  <div :class="FilterCollapse && 'FilterCollapse'" class="FilterContent">
    <div class="BasicInfo_title" v-if="header_tab.length > 0">
      <span
        v-for="tab in header_tab"
        :key="tab.id"
        :class="{ is_active: tab.isChecked }"
        @click="handleTabSelect(tab)"
        >{{ tab.name }}</span
      >
    </div>
    <div v-if="!FilterCollapse">
      <div
        class="display-inline-block text-align-center margin-bottom-20"
        :style="{ width: 100 / 5 + '%' }"
        v-for="opt in option.column"
        :class="{
          'position-relative': opt.type === 'time',
          'text-align-left': opt.align === 'left'
        }"
        :key="opt.value"
      >
        <slot :name="opt.value" :label-name="opt.label">
          <!-- input -->
          <jat-input
            v-if="opt.type === 'input' || !opt.type"
            v-model.trim="FilterData[opt.value]"
            :placeholder="opt.label"
            :width="inputWidth"
          ></jat-input>
          <!-- select -->
          <jat-select
            v-else-if="opt.type === 'select'"
            v-model="FilterData[opt.value]"
            :placeholder="opt.label"
            clearable
            :width="inputWidth"
            @change="changeSelect(FilterData[opt.value], opt)"
          >
            <el-option
              v-for="item in opt.options"
              :key="opt.valueKey ? item[opt.valueKey] : item.value"
              :label="opt.labelKey ? item[opt.labelKey] : item.label"
              :value="opt.valueKey ? item[opt.valueKey] : item.value"
            >
            </el-option>
          </jat-select>
          <!-- 时间：开始时间、结束时间时 -->
          <div v-else-if="opt.type === 'time'">
            <el-date-picker
              v-if="opt.subType === 'ksTime'"
              :width="inputWidth"
              clearable
              type="date"
              :placeholder="opt.label"
              size="small"
              v-model="FilterData[opt.value]"
              :picker-options="kssjPickerOptions"
              @change="handleKSSJChange"
            ></el-date-picker>
            <el-date-picker
              v-else-if="opt.subType === 'jsTime'"
              size="small"
              :width="inputWidth"
              clearable
              type="date"
              :placeholder="opt.label"
              v-model="FilterData[opt.value]"
              :picker-options="jssjPickerOptions"
            ></el-date-picker>
            <span class="FilterContent__date-separator" v-show="opt.isShowTip"
              >至</span
            >
          </div>
          <!-- 时间：开始时间、结束时间时 -->
          <div v-else-if="opt.type === 'timeAll'">
            <el-date-picker
              v-model="FilterData[opt.value]"
              type="daterange"
              size="small"
              :range-separator="opt.range"
              :start-placeholder="opt.label[0]"
              :value-format="opt.valueFormat || 'yyyy-MM-dd'"
              :end-placeholder="opt.label[1]"
              clearable
              :picker-options="PickerOptions"
            >
            </el-date-picker>
          </div>
          <!-- 最小值，最大值 -->
          <div v-else-if="opt.type === 'min_max'">
            <div
              class="min_maxBox"
              v-for="(item, index) in opt.options"
              :key="index + 'options'"
            >
              <jat-input
                v-model.trim="FilterData[item.value]"
                :placeholder="item.label"
                width="84%"
              ></jat-input>
            </div>
          </div>
        </slot>
      </div>
      <!-- <div
        class="Width-Twenty-Percent display-inline-block text-align-center margin-bottom-20"
      ></div> -->
      <div
        class="display-inline-block text-align-right borderbox serachBtn"
        :style="{ width: (5 - (option.column.length % 5)) * 20 + '%' }"
      >
        <span class="searchBtn" @click="searchFilter">查询</span>
        <span class="resetBtn" @click="clearFilter" type="info">重置</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "jat-fillter",
  data() {
    return {
      FilterData: {},
      sqlxList: [],
      fkztList: [],
      inputWidth: "85%",
      kssjPickerOptions: {
        // 开始时间 时间选择器配置
        disabledDate: (date) =>
          date > new Date() ||
          (this.FilterData.jssj &&
            date.getTime() > new Date(this.FilterData.jssj).getTime())
      },
      jssjPickerOptions: {
        // 结束时间 时间选择器配置
        disabledDate: (date) =>
          date > new Date() ||
          (this.FilterData.kssj &&
            date.getTime() <
              new Date(this.FilterData.kssj).getTime() - 86400000)
      },
      PickerOptions: {
        // 开始时间 时间选择器配置
        disabledDate: (date) => date > new Date()
      },
      FilterCollapse: false // 筛选条件是否收缩
    }
  },
  props: {
    option: {
      type: Object,
      default: () => new Object()
    },
    value: {
      type: Object,
      default: () => new Object()
    },
    header_tab: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.FilterData = this.value
  },
  methods: {
    // 下拉框改变
    changeSelect(val, item) {
      if (item.changeFunc) {
        this.$emit("changeFilter", val)
      }
    },
    /**
     * @description 开始时间 改变
     */
    handleKSSJChange(date) {
      let jssj = this.FilterData.jssj
      if (jssj && new Date(jssj) < date) {
        this.FilterData.jssj = ""
      }
    },
    searchFilter() {
      this.$emit("searchFilter")
    },
    /**
     * @description 清空筛选项
     */
    clearFilter() {
      if (!(this.option.isClearAll === false)) {
        this.FilterData = {}
      }
      this.$emit("clearFilter")
    },
    /**
     * @description 根据筛选项筛选数据
     */
    getTableByFilterData() {
      this.$emit("getTableByFilterData", { ...this.FilterData })
    },

    handleTabSelect(tab) {
      this.header_tab.forEach((item) => {
        item.isChecked = item.id === tab.id
      })
      this.$emit("tabChecked", tab)
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.FilterData = newValue
        this.$emit("input", newValue)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.searchBtn {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 500;
  margin: 5px 10px;
  display: inline-block;
  padding: 3px 28px;
  background-image: linear-gradient(110deg, #1b77ff 0%, #003ce6 100%);
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 5px 0px 0px rgba(0, 38, 148, 0.9);
  // background-image: linear-gradient(180deg, #002694 0%, #003CE6 100%);
}
.resetBtn {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 500;
  margin: 5px 10px;
  display: inline-block;
  padding: 3px 28px;
  background-image: linear-gradient(115deg, #00d151 0%, #048536 100%);
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 5px 0px 0px #006c2a;
  // background-image: linear-gradient(180deg, #002694 0%, #003CE6 100%);
}
// 通用样式 flex 页面右侧主体区域
.position-relative {
  position: relative;
}
.Width-Twenty-Percent {
  width: 16.6%;
}
.display-inline-block {
  display: inline-block;
}

.text-align-center {
  text-align: center;
}
.text-align-left {
  text-align: left;
}
.text-align-right {
  text-align: right;
}

.margin-bottom-20 {
  margin-bottom: 20px;
}
.margin-bottom-16 {
  margin-bottom: 16px;
}
.position-relative {
  position: relative;
}
.BasicInfo_Container_flex {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

.BasicInfo_title {
  margin-left: 24px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666;
  margin-bottom: 14px;
  display: inline-block;
  background: #eceff3;
  border-radius: 4px;

  span {
    display: inline-block;
    margin: 3px 3px;
    padding: 1px 9px;
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
.BasicInfo_padding {
  padding: 20px;
}

.BasicLine_title {
  &::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 16px;
    margin-right: 6px;
    vertical-align: middle;
    background-image: linear-gradient(180deg, #1c83fb 0%, #0054b7 100%);
  }
}
.FilterContent {
  flex-shrink: 0;
  height: auto;
  max-height: 300px;
  padding: 20px 0 0;
  margin-bottom: 16px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  transition: 0.3s;
  border: 1px solid rgba(169, 173, 181, 1);
  box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
  border-radius: 4px;
  .BasicLine_title {
    padding-left: 20px;
  }
  &.FilterCollapse {
    // height: 0;
    // padding-top: 0;
    margin-top: 0;
  }

  .FilterContent__date-separator {
    position: absolute;
    top: 8px;
    right: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0;
    color: var(--color--primary);
    transform: translateX(50%);
  }

  .FilterContent__CollapseBtn-separator {
    position: absolute;
    width: 60px;
    height: 14px;
    text-align: center;
    right: 20px;
    top: 0;
    .FilterContent__CollapseBtn__arrow {
      display: inline-block;
      width: 40px;
      height: 14px;
      line-height: 14px;
      cursor: pointer;
      background-color: #ccc;
      border-radius: 0 0 4px 4px;
      .jat-filter-Icon {
        width: 16px;
        height: 16px;
        color: #167cf3;
        position: relative;
        // animation: arrow-animation 0.8s ease-out 0 backwards;
        // animation-iteration-count: infinite;
        // transition: 0.3s;
      }
      &.arrowRotate {
        .jat-filter-Icon {
          transform: rotate(180deg);
          // animation: arrow-animation-rotate 0.8s ease-out 0 backwards;
          // animation-iteration-count: infinite;
        }
      }
    }
  }
  .min_maxBox {
    display: inline-block;
    width: 45%;
  }
  .min_maxBox:first-child {
    &::after {
      content: "≤";
      display: inline-block;
      margin-left: 6%;
    }
  }
}

@keyframes arrow-animation {
  0% {
    top: 0;
  }

  100% {
    top: -3px;
  }
}

@keyframes arrow-animation-rotate {
  0% {
    top: 0;
  }

  100% {
    top: 3px;
  }
}
</style>
