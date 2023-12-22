<!-- 表头上的按钮 -->
<template>
  <div
    class="headerBtn"
    :style="{ background: bgColor }"
    :class="name + '-btn'"
  >
    <template v-if="name.includes('el-icon')">
      <i :class="name"></i><slot />
    </template>
    <template v-else>
      <svg-icon :icon-class="name"></svg-icon><slot />
    </template>
  </div>
</template>

<script>
export default {
  name: "HeaderBtn",
  props: {
    name: String,
    bgColor: String
  },
  data() {
    return {}
  },

  methods: {}
}
</script>
<style lang="scss" scoped>
.headerBtn {
  display: inline-block;
  margin: 5px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  i {
    margin-right: 6px;
  }
  letter-spacing: 0;
  line-height: 14px;
  font-weight: 400;
  padding: 9px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn,
.input-btn,
.headerBtn {
  background: #167cf3;
}
.batch-import-btn,
.upload-btn,
.import-btn {
  background: #ff6600;
}
.download-btn,
.relational-btn {
  background: #0fba80;
}
.batch_delete-btn {
  background: #fd5858;
}
</style>
