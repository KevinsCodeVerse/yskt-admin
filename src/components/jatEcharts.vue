<template>
  <div class="chart" ref="chart"></div>
</template>
<script>
export default {
  name: "XEcharts",
  data() {
    return {
      myChart: null
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    height: {
      type: String,
      default: ""
    }
  },
  watch: {
    options: {
      handler(newValue) {
        // eslint-disable-next-line vue/no-mutating-props
        this.options = newValue
        this.resetChartData() //监听到了，重新定义数据，即重绘
      },
      deep: true
    }
  },
  methods: {
    drawMyChart() {
      if (this.height) {
        this.myChart.resize({ height: this.height })
      }
      this.myChart.setOption(this.options, true)
    },
    resetChartData() {
      this.myChart.clear()
      if (this.height) {
        this.myChart.resize({ height: this.height })
      }
      this.myChart.setOption(this.options, true)
    },
    resizefun() {
      this.$echarts.init(this.$refs.chart).resize() //多个echarts则在此处添加
    }
  },
  mounted() {
    const resizeObserver = new ResizeObserver(() => {
      if (this.resizefun) {
        this.resizefun()
      }
    })
    const test = document.querySelector(".chart")
    if (test) {
      resizeObserver.observe(test)
    }
    this.myChart = this.$echarts.init(this.$refs.chart)
    this.drawMyChart()
    window.onresize = () => this.resizefun
    window.addEventListener("resize", this.resizefun)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizefun)
    this.resizefun = null
  }
}
</script>
<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
