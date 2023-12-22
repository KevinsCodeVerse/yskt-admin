<template>
  <div
    class="scroll-outer"
    ref="outer"
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
  >
    <div class="scroll-inner-box" ref="scrollBox">
      <div class="scroll-item-box" ref="scrollItemBox">
        <slot></slot>
      </div>
      <div v-if="showSecond" class="scroll-item-box second">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "my-auto-scroll",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    speed: {
      type: Number,
      default: 0.1
    },
    //滚动作单步运动时的单纯运动距离
    singleHeight: {
      type: Number,
      default: 0
    },
    //单步运动的时间间隔
    waitTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rafId: null,
      y: 0,
      showSecond: false,
      controleHeight: 0
    }
  },
  watch: {
    list: {
      handler(newVal) {
        var that = this
        this.$nextTick(() => {
          if (newVal && newVal.length > 0) {
            let scrollBox = that.$refs.scrollBox
            let outer = that.$refs.outer
            if (this.myReq) {
              cancelAnimationFrame(this.myReq)
            }
            // 开启动画
            if (this.canRun()) this.reqAnimationFrame()
            // 手动滚动到底部时滚动条重置到最上边,同时滚动盒子重置为top:0
            outer.addEventListener("scroll", function () {
              if (
                outer.scrollTop + outer.clientHeight + 4 >=
                outer.scrollHeight
              ) {
                outer.scrollTop = 0
                that.y = 0
                scrollBox.style.top = 0
              } else {
                that.y = outer.scrollTop
              }
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    window.addEventListener("resize", this.listenResizeFn)
  },
  methods: {
    listenResizeFn() {
      cancelAnimationFrame(this.myReq)
      if (this.canRun()) this.reqAnimationFrame()
    },
    onMouseover() {
      clearTimeout(this.timer)
      cancelAnimationFrame(this.myReq)
    },
    onMouseleave() {
      if (this.canRun()) this.reqAnimationFrame()
    },
    canRun() {
      let scrollItemBox = this.$refs.scrollItemBox
      let scrollBox = this.$refs.scrollBox
      let outer = this.$refs.outer
      // 开启动画条件：滚动盒子(scrollBox)高度高于外层容器(outer)高度
      if (outer.offsetHeight >= scrollItemBox.offsetHeight) {
        this.showSecond = false
        outer.scrollTop = 0
        this.y = 0
        scrollBox.style.top = 0
        return false
      } else {
        this.showSecond = true
        return true
      }
    },
    //获取dom元素的高度：content+padding+margin+border
    getComputedHeight(dom) {
      let computedStyle = getComputedStyle(dom)

      let computedHeight =
        dom.offsetHeight +
        parseFloat(computedStyle.marginTop) +
        parseFloat(computedStyle.marginBottom)
      return computedHeight
    },
    reqAnimationFrame() {
      //外层容器
      let outer = this.$refs.outer
      // 滚动盒子
      // let scrollBox = this.$refs.scrollBox
      //滚动盒子下边的第一个scroll-item-box，
      let scrollItemBox = this.$refs.scrollItemBox
      //滚动速度
      let speed = this.speed > 1 ? 1 : this.speed < 0 ? 0.1 : this.speed
      //取第一个scrollItemBox高度
      let definedHeight = this.getComputedHeight(scrollItemBox)
      //持续滚动
      this.y = this.y + speed
      // scrollBox.style.top = -this.y + "px"
      outer.scrollTop = this.y
      //====添加滚动间隔控制====开始
      if (this.singleHeight >= 20 && this.waitTime > 500) {
        if (this.controleHeight >= this.singleHeight) {
          cancelAnimationFrame(this.myReq)
          this.controleHeight = 0
          this.timer = setTimeout(() => {
            if (this.canRun) this.reqAnimationFrame()
          }, this.waitTime)
          return
        } else {
          // 一次移动高度未达到指定距离继续执行动画
          this.controleHeight += speed
        }
      }
      //====添加滚动间隔控制====结束
      //当滚动到第一个scroll-item-box高度时scrollBox重置为top:0,视觉上是无缝滚动
      if (this.y >= definedHeight) {
        this.y = 0
      }
      this.myReq = window.requestAnimationFrame(this.reqAnimationFrame)
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.listenResizeFn)
    cancelAnimationFrame(this.myReq)
    if (this.timer) clearTimeout(this.timer)
  }
}
</script>
<style lang="less">
.scroll-outer {
  position: relative;
  height: 100%;
  overflow-x: hidden;
}

.scroll-inner-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
}
</style>
