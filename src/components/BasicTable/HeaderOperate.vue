<template>
  <div class="header-btn">
    <span
      v-for="o in operates"
      :key="o.key"
      :disabled="o.disabled"
      @click="o.action(o)"
    >
      <HeaderBtn :name="o.key" :bgColor="o.bgColor">{{ o.name }}</HeaderBtn>
    </span>
  </div>
</template>

<script>
/* eslint-disable */
import HeaderBtn from "@/components/HeaderBtn/index.vue"
export default {
  name: "HeaderOperate",
  components: { HeaderBtn },
  props: {
    operates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.header-btn {
}
</style>
