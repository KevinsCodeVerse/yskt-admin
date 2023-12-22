<template>
  <div class="jat-pagination">
    <el-pagination
      :layout="layout"
      :background="background"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40, 50]"
      :current-page="currentPage"
      :pager-count="pagerCount"
      :popper-class="popperClass + ' ' + 'jat-select-popover'"
      :prev-text="prevText"
      :next-text="nextText"
      :disabled="disabled"
      :total="total"
      :hide-on-single-page="hideOnSinglePage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    >
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "jat-pagination",
  props: {
    layout: {
      type: String,
      default: "sizes, prev, pager, next, jumper, ->, total, slot"
    }, // 组件布局，子组件名用逗号分隔 sizes, prev, pager, next, jumper, ->, total, slot
    total: Number, // 总条目数
    pageSize: {
      type: Number,
      default: 10
    }, // 每页显示条目个数
    currentPage: Number,
    /** @description 页码按钮的数量，当总页数超过该值时会折叠 大于等于 5 且小于等于 21 的奇数 */
    pagerCount: {
      type: Number,
      default: 7
    },
    popperClass: String,
    prevText: String,
    nextText: String,
    disabled: Boolean,
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否为分页按钮添加背景色
     */
    background: Boolean
  },
  data() {
    return {}
  },
  components: {},
  mounted() {},
  methods: {
    handleSizeChange(item) {
      this.$emit("size-change", item) // pageSize 改变时会触发
    },
    handleCurrentChange(item) {
      this.$emit("update:currentPage", item)
      this.$emit("current-change", item) // currentPage 改变时会触发
    },
    handlePrevClick(item) {
      this.$emit("prev-click", item) // 用户点击上一页按钮改变当前页后触发
    },
    handleNextClick(item) {
      this.$emit("next-click", item) // 用户点击下一页按钮改变当前页后触发
    }
  }
}
</script>

<style lang="less">
@import url("../../commonCSS/varibles.less");

.jat-pagination {
  // width: 100%;
  margin: 0 16px;
  padding: 20px 5px;
  background: #fff;

  .el-pagination {
    padding: 0;
    float: right;
    .el-pagination__sizes {
      margin: 0 4px 0 0;
      font-weight: normal;
      color: var(--jat-pagination-fontColor);

      .el-select .el-input {
        width: 82px;
        height: 22px;
        margin: 0;

        .el-input__inner {
          height: 22px;
          line-height: 22px;
          border: 1px solid #d5d5d5;
          border-radius: 2px;
        }
      }
    }

    button,
    span:not([class*="suffix"]),
    .el-select__caret {
      height: 22px;
      line-height: 22px;
    }
  }

  .el-pager {
    padding: 0 2px;
    margin-top: 2px;

    li {
      height: 18px;
      min-width: 4px;
      padding: 0 5px;
      margin: 0 2px;
      font-size: @fontSize;
      line-height: 18px;
      color: var(--jat-pagination-fontColor);
      background-color: transparent;
      border-radius: 2px;

      &.active {
        color: #fff;
        background-color: @active;
      }
    }

    .more::before {
      line-height: 20px;
    }
  }

  .el-pagination__editor {
    height: 22px;

    &.el-input {
      width: 36px;
      min-width: 36px;

      .el-input__inner {
        height: 22px;
        line-height: 22px;
        border: 1px solid #d5d5d5;
        border-radius: 2px;

        &:hover {
          border-color: @focusColor;
        }

        &:focus {
          border-color: @focusColor;
        }
      }
    }
  }
  // 分页按钮
  .el-pagination .btn-next,
  .el-pagination .btn-prev {
    background-color: transparent;
    color: var(--jat-pagination-fontColor);
  }
  // 跳转文字
  .el-pagination__jump {
    color: var(--jat-pagination-fontColor);
  }
  // 总条数文字
  .el-pagination__total {
    color: var(--jat-pagination-fontColor);
  }
}
</style>
<style lang="less">
@import url("../../commonCSS/variable-dark.less");

html[theme-color="dark"] {
  .el-input__inner {
    color: @fontColorDark;
    background: @bgInputDarkOpacity;
    border: transparent;

    &::-webkit-input-placeholder {
      color: @placeholderDark;
    }
  }
}
</style>
