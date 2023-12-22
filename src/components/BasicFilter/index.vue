<template>
  <div :class="FilterCollapse && 'FilterCollapse'" class="FilterContent">
    <div class="BasicInfo_title BasicLine_title position-relative">
      <span>查询</span>
      <div
        class="FilterContent__CollapseBtn-separator"
        v-if="option.searchToggleShow || true"
      >
        <el-tooltip
          class="item"
          :content="FilterCollapse ? '点击可展开' : '点击可收起'"
          placement="bottom"
        >
          <span
            :class="FilterCollapse && 'arrowRotate'"
            @click="FilterCollapse = !FilterCollapse"
            class="FilterContent__CollapseBtn__arrow"
          >
            <jat-icon name="filterzkIcon" class="jat-filter-Icon" />
          </span>
        </el-tooltip>
      </div>
    </div>
    <template v-if="!FilterCollapse">
      <div
        class="Width-Twenty-Percent display-inline-block text-align-center margin-bottom-20"
        v-for="(opt, i) in option.column"
        :class="{
          'position-relative': opt.type === 'time',
          'text-align-left': opt.align === 'left'
        }"
        :key="i + 'filterDataForm'"
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
            <jat-date-picker
              v-if="opt.subType === 'ksTime'"
              :width="inputWidth"
              clearable
              type="date"
              :placeholder="opt.label"
              v-model="FilterData[opt.value]"
              :picker-options="kssjPickerOptions"
              @change="handleKSSJChange"
            ></jat-date-picker>
            <jat-date-picker
              v-else-if="opt.subType === 'jsTime'"
              :width="inputWidth"
              clearable
              type="date"
              :placeholder="opt.label"
              v-model="FilterData[opt.value]"
              :picker-options="jssjPickerOptions"
            ></jat-date-picker>
            <span class="FilterContent__date-separator" v-show="opt.isShowTip"
              >至</span
            >
          </div>
          <!-- 时间：开始时间、结束时间时 -->
          <div v-else-if="opt.type === 'timeAll'">
            <jat-date-picker
              v-model="FilterData[opt.value]"
              type="daterange"
              :range-separator="opt.range"
              :start-placeholder="opt.label[0]"
              :value-format="opt.valueFormat || 'yyyy-MM-dd'"
              :end-placeholder="opt.label[1]"
              clearable
              :picker-options="PickerOptions"
            >
            </jat-date-picker>
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
      <div
        class="Width-Twenty-Percent display-inline-block text-align-center margin-bottom-20"
      ></div>
      <div
        class="Width-Twenty-Percent display-inline-block text-align-right borderbox serachBtn"
      >
        <jat-button @click="searchFilter">查询</jat-button>
        <jat-button @click="clearFilter" type="info" style="margin-right: 7.5%"
          >重置</jat-button
        >
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "BasicFilter",
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
    }
  },
  watch: {
    FilterData: {
      handler(newValue) {
        this.$emit("input", newValue)
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.FilterContent {
  // flex-shrink: 0;
  height: auto;
  max-height: 300px;
  padding: 20px 0 0;
  margin-bottom: 16px;
  overflow: hidden;
  background: var(--bg--primary);
  border-radius: 4px;
  transition: 0.3s;
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
      background-color: var(--bg--primary);
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
