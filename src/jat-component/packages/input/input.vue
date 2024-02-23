<template>
  <div class="jat-input" :class="classSet" :style="{ width: width }">
    <el-input
      :class="readonly && 'readOnlyInput'"
      :disabled="disabled"
      :readonly="readonly"
      :type="type"
      :size="size"
      :validate-event="validateEvent"
      :clearable="clearable"
      :nodata="nodata"
      :tabindex="tabindex"
      :show-word-limit="showWordLimit"
      :maxlength="maxlength"
      :minlength="minlength"
      :autofocus="autofocus"
      :autosize="autosize"
      :rows="rows"
      :resize="resize"
      v-model="input"
      :name="name"
      @change="handleChange"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
      :placeholder="placeholder"
    >
      <template slot="append"><slot name="append"></slot></template>
    </el-input>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "jat-input",
  props: {
    value: [String, Number],
    /** 输入框尺寸，只在 type!="textarea" 时有效*/
    size: {
      type: String,
      default: "small",
      validator(value) {
        return ["medium", "small", "mini"].includes(value)
      }
    },
    placeholder: {
      type: [String, Number],
      default: "请输入"
    },
    /** 输入时是否触发表单的校验	 */
    validateEvent: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: "text"
    },
    /** 是否可清空 */
    clearable: {
      type: Boolean,
      default: false
    },
    /** 输入框的tabindex */
    tabindex: String,
    /** 是否显示输入字数统计，
     * 只在 type = "text" 或 type = "textarea" 时有效 */
    showWordLimit: {
      type: Boolean,
      default: false
    },
    /** 原生属性，最大输入长度 */
    maxlength: Number,
    /** 原生属性，最小输入长度 */
    minlength: Number,
    rows: Number,
    /** 原生属性，自动获取焦点 */
    autofocus: Boolean,
    /** 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 } */
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    width: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    /**控制是否能被用户缩放, none, both, horizontal, vertical */
    resize: {
      type: String,
      default: "none",
      validator(value) {
        return ["none", "both", "horizontal", "vertical"].includes(value)
      }
    },
    nodata: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      input: "",
      textareaScorllFlag: true
    }
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        this.input = newValue
      }
    }
  },
  model: {
    event: "input",
    prop: "value"
  },
  components: {},
  created() {
    this.input = this.value
  },
  mounted() {
    if (this.maxlength <= 100 && this.type == "textarea") {
      this.textareaScorllFlag = false
    } else {
      this.textareaScorllFlag = true
    }
  },
  methods: {
    handleChange(item) {
      this.$emit("change", item)
    },
    handleInput(item) {
      this.input = this.value
      this.$emit("input", item)
    },
    handleFocus(item) {
      this.$emit("focus", item)
    },
    handleBlur(item) {
      this.$emit("blur", item)
    },
    handleClear(item) {
      this.$emit("clear", item)
    }
  },
  computed: {
    // input框class
    classSet() {
      if (this.nodata) return "nodata"
      if (this.clearable) {
        return "clearable-input"
      } else {
        let className = []
        if (!this.textareaScorllFlag) {
          className.push("hideScorll")
        }
        return className.join(" ")
      }
    }
  }
}
</script>

<style lang="less">
@import url("../../commonCSS/varibles");

.jat-input {
  display: inline-block;
  width: 100%;
  .el-input {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-input__suffix {
    .el-input__suffix-inner {
      display: inline-block;
      line-height: 30px;

      .el-input__clear {
        line-height: 30px;
      }
    }
  }

  .el-input-group--append {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .el-input-group__append {
    display: inline-block;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f6f6f6 !important;
  }

  .el-input__inner {
    height: 30px;
    font-size: @fontSize;
    line-height: 30px;
    color: @fontColor;
    background: @bgInput;
    
    // border-color: @borderColor;
    border-color: #307afc;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box;

    &::-webkit-input-placeholder {
      color: @placeholder;
    }

    &:hover {
      border-color: @hoverColor;
    }

    &:focus {
      border-color: @inputFocusColor;
    }
  }

  .readOnlyInput .el-input__inner {
    background-color: @bgReadOnly;
  }

  .el-input--small {
    .el-input__inner {
      padding: 0 10px;
    }
  }

  .el-input--mini {
    .el-input__inner {
      padding: 0 8px;
    }
  }

  .el-input.is-disabled .el-input__inner {
    color: @disabled;
    cursor: not-allowed;
    background-color: @bgInput;
    border-color: @borderColor;
    &::-webkit-input-placeholder {
      color: @disabled;
    }
  }

  .el-textarea {
    font-size: @fontSize;

    &.is-disabled {
      .el-textarea__inner {
        &:hover {
          // border-color: rgb(255 255 255 / 10%);
          border-color: #d5d5d5;
        }
      }
    }

    .el-textarea__inner {
      padding: 4px 6px;
      font-family: initial;
      line-height: 14px;
      color: @fontColor;
      background: @bgInput;
      border: 2px solid @borderColor;
      border: 2px solid #307afc;
      border-radius: 4px;

      &:hover {
        border: 2px solid @hoverColor;
      }

      &:focus {
        border: 2px solid @inputFocusColor;
      }

      &::-webkit-input-placeholder {
        color: @placeholder;
      }

      /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
    }

    .el-input__count {
      right: 6px;
      bottom: 5px;
      line-height: 12px;
      color: @tipColor;
      background: transparent;
      opacity: 0.5;
    }
  }

  &.hideScorll {
    .el-textarea > textarea {
      &::-webkit-scrollbar {
        display: none;
        width: 0 !important;
      }
    }
  }

  &.nodata {
    .el-textarea__inner {
      border: 2px solid @error !important;

      &:hover {
        border-color: @errorHover !important;
      }
    }

    .el-input__inner {
      border: 2px solid @error !important;

      &:hover {
        border-color: @errorHover !important;
      }
    }
  }

  &.clearable-input {
    .el-input--small .el-input__inner,
    .el-input--mini .el-input__inner {
      padding-right: 30px;
    }
  }
}

/* 校验情况 */
.el-form-item.is-error .jat-input .el-input__inner,
.el-form-item.is-error .jat-input .el-input__inner:focus,
.el-form-item.is-error .jat-input .el-textarea__inner,
.el-form-item.is-error .jat-input .el-textarea__inner:focus,
.el-message-box__input input.invalid,
.el-message-box__input input.invalid:focus {
  color: @error;
  border-color: @error;

  &:hover {
    border-color: @errorHover;
  }
}
</style>
<style lang="less">
@import url("../../commonCSS/variable-dark.less");

html[theme-color="dark"] {
  .jat-input {
    .el-input__inner {
      color: @fontColorDark;
      background: @bgInputDarkOpacity;
      border: transparent;

      &::-webkit-input-placeholder {
        color: @placeholderDark;
      }
    }
  }
}
</style>
