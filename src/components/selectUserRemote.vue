<!-- 模糊搜索用户 -->
<template>
  <div class="user-search" style="width: 100%;">
    <el-select
      :style="'width:' + width "
      ref="selectFilter"
      size="small"
      clearable
      v-model="userId"
      filterable
      @change="handleChange"
      remote
      :remote-method="remoteMethod"
      :loading="remoteLoading"
      @hook:mounted="cancalReadOnly"
      @visible-change="cancalReadOnly"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-option
        v-for="item in userOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import request from "../utils/request";

export default {
  model: {
    prop: "id",
    event: "update:id",
  },
  props: {
    id: {
      type: [Number, String],
    },
    type: [Number, String],
    width: {
      type: String,
      default: "85%"
    },
  },
  data() {
    return {
      userId: "",
      remoteLoading: false,
      userOptions: [],
    };
  },

  created() {
    this.userId = this.id;
    this.getCurrentUser;
  },

  mounted() {
    this.cancalReadOnly()
  },

  methods: {
    remoteMethod(search) {
      if (!search) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
          type: this.type,
        },
        success: (res) => {
          this.remoteLoading = false;
          this.userOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
    handleChange(val) {
      this.$emit("update:id", val);
    },
    cancalReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const { selectFilter } = this.$refs;
          const input = selectFilter.$el.querySelector(".el-input__inner");
          input.removeAttribute("readonly");
        }
      });
    },
  },
  watch: {
    id(val) {
      this.userId = val;
    },
  },
};
</script>
<style lang="less">
@import url("@/jat-component/commonCSS/varibles");
.user-search .el-input__inner {
  height: 30px;
  font-size: @fontSize;
  line-height: 30px;
  color: @fontColor;
  background: @bgInput;
  border-color: @borderColor;
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
</style>
