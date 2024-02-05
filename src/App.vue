<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  created() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.updateHtml();
  },

  methods: {
    updateHtml() {
      let a = document.querySelector("div[data-title^=图片]");
      let img = document.querySelector("i[class=w-e-icon-image]");
      if (a != undefined && a != "" && img != undefined && img != "") {
        img.remove();
        var t = document.createTextNode("插入图片");
        a.appendChild(t);
      }
    },
    handleResize(event) {
      var fullWidth = document.documentElement.clientWidth;
      if (fullWidth > 768) {
        this.$store.state.isPhone = false;
        this.$store.state.navOpen = true;
      } else {
        this.$store.state.isPhone = true;
        this.$store.state.navOpen = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import url("./assets/css/pf-basic.css");
@import url("./assets/css/element-ui.css");
@import url("./assets/css/public.css");

@import url("./assets/fonts/icon.css");

* {
  padding: 0;
  margin: 0;
}

body {
  background: rgb(206, 213, 225);
  overflow: hidden;
  padding: 0 !important;
  box-sizing: border-box !important;
}

@media screen and (max-width: 768px) {
  .el-message-box {
    width: 80% !important;
  }

  .el-dialog {
    width: 90% !important;
  }

  .el-dialog .el-form-item__label {
    display: none !important;
  }

  .el-dialog .el-form-item__content {
    margin-left: 0 !important;
  }
}

// .theme-color:{
// 	// color: $color-primary;
// }
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
