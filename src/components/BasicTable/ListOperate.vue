<template>
  <div class="list-operate">
    <template v-for="o in operates">
      <span
        class="list-operate-btn"
        v-permission="o.permission"
        :class="o.disabled === true ? 'not-allowed-btn' : o.btnStyle + '-btn'"
        :key="o.key"
        v-if="o.show ? o.show(curRow) : true"
        @click="o.action(o, curRow)"
      >
        {{ o.title }}
      </span>
    </template>
  </div>
</template>

<script>
// import { MoreIcon } from "../SvgIcon"

export default {
  name: "ListOperate",
  components: {},
  props: {
    operates: {
      type: Array,
      default: () => []
    },
    curRow: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {}
}
</script>

<style lang="less">
.list-operate {
  color: #167cf3;
  .list-operate-btn {
    display: inline-block;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 14px;
    font-weight: 400;
    // background-color: #ccc;
    padding: 4px;
    margin: 5px;
    cursor: pointer;
    &.blue-btn {
      background-image: linear-gradient(180deg, #1668f3 0%, #2a16f3 100%);
      border-radius: 2px;
    }
    &.green-btn {
      background-image: linear-gradient(180deg, #11c23e 0%, #078f1d 100%);
      border-radius: 2px;
    }

    &.yellow-btn {
      background-image: linear-gradient(180deg, #f39416 0%, #f37016 100%);
      border-radius: 2px;
    }

    &.red-btn {
      background-image: linear-gradient(179deg, #ff6054 0%, #f32416 100%);
      border-radius: 2px;
    }
    &.not-allowed-btn {
      background-image: linear-gradient(179deg, #9e9897 0%, #928685 100%);
      border-radius: 2px;
      cursor: not-allowed;
    }
  }
}
</style>
