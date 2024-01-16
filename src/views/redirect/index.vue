<!-- 跳转页面 -->
<template>
  <div></div>
</template>

<script>
export default {
  name: "redirectPage",
  data() {
    return {};
  },

  created() {
    const { params, query } = this.$route;
    const { path } = params;
    this.$router.replace({ path: "/" + path, query });
  },
  render: function(h) {
    return h();
  },

  methods: {},
};
</script>
<style lang="scss" scoped></style>
