let commonJSon = {
  color: ["#FFC737", "#E139A3", "#8453E9", "#24CCDD", "#4DEED7", "#3C6CFC"],
  title: {
    text: "",
    textStyle: {
      fontSize: 16,
      color: "#2E3239",
      fontWeight: 400
    },
    left: "center"
  },
  legend: {
    bottom: "20px",
    textStyle: {
      color: "#666"
    }
  },
  tooltip: {
    textStyle: {
      color: "rgba(0,0,0,.65)",
      fontSize: 12
    },
    backgroundColor: "#fff",
    borderColor: "#fff",
    axisPointer: {
      type: "none"
    },
    trigger: "axis",
    formatter: function (param) {
      var res = `<div class='toolTitle'>${param[0].name}</div>`
      var val = ""
      for (var i = 0, length = param.length; i < length; i++) {
        if (param.length > 1) {
          val = param[i].value
          res += `<div class="tooltipItem">${param[i].marker
            }<span class="tooltipTitle">${param[i].seriesName}(${param[i].data.sub ? param[i].data.sub : ""
            })</span>：<span style=color:${param[i].color
            } class="tooltipNum">${val}</span></div>`
        } else {
          val = param[i].value
          res += `<div class="tooltipItem"><span class="tooltipTitle">${param[i].seriesName
            }(${param[i].data.sub ? param[i].data.sub : ""
            })</span>：<span style=color:${param[i].color
            } class="tooltipNum">${val}</span></div>`
        }
      }
      return res
    }
  },
  // 坐标category轴数据
  AxisCategory: {
    type: "category",
    data: [],
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: "#D7E0EE"
      }
    },
    axisLabel: {
      color: "#999",
      fontSize: 12
    }
  },
  // 坐标value轴数据
  AxisVaule: {
    type: "value",
    nameTextStyle: {
      color: "#666",
      fontWeight: 400
    },
    min: 0,
    splitLine: {
      show: true,
      lineStyle: {
        color: "#D7E0EE",
        width: 1,
        type: "dashed"
      }
    },
    axisLabel: {
      color: "#999",
      fontSize: 12
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#D7E0EE",
        width: 1,
        type: "solid"
      }
    }
  }
}
const labelOption = {
  show: true,
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {}
  }
};
export const echartsJson = {

  commonJSon: commonJSon,
  // 柱图 // 条图  //折现
  bar: {
    grid: {
      left: "20px",
      right: "20px",
      bottom: "0px",
      top: "30px",
      containLabel: true
    },
    toolbox: { feature: {} },
    backgroundColor: "#fff",
    legend: commonJSon.legend,
    tooltip: commonJSon.tooltip,
    color: commonJSon.color,
    title: commonJSon.title,
    barWidth: "20px",
    yAxis: commonJSon.AxisVaule,
    xAxis: commonJSon.AxisCategory,
    series: [
      {
        data: [],
        type: "",
        name: ""
      }
    ]
  },
  // 饼图
  pie: {
    tooltip: {
      textStyle: {
        color: "rgba(0,0,0,.65)",
        fontSize: 12
      },
      axisPointer: {
        type: "none"
      },
      formatter: function (param) {
        var res = `<div class='toolTitle'>题库名称：${param.name}</div><div class="tooltipItem toolTitle">题目数量：<span style=color:${param.color.colorStops[0].color} class="tooltipNum">${param.value}</span></div>`

        return res
      }
    },
    legend: {
      orient: "vertical",
      right: "right",
      bottom: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: "#666",
        fontSize: 12
      }
    },
    series: [
      {
        name: "题库分布",
        type: "pie",
        radius: ["16%", "85%"],
        center: ["40%", "50%"],
        data: [].sort(function (a, b) {
          return b.value - a.value
        }),
        roseType: "radius",
        label: {
          normal: {
            show: false,
            textStyle: {
              color: "rgba(255, 255, 255, 1)"
            }
          }
        },
        labelLine: {
          normal: {
            show: false,
            lineStyle: {
              color: "rgba(255, 255, 255, 1)"
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          }
        }
      },
      {
        name: "内环",
        type: "pie",
        center: ["40%", "50%"],
        silent: true,
        clockWise: true,
        hoverAnimation: false,
        animationType: "scale",
        radius: "10%",
        label: {
          normal: {
            position: "center"
          }
        },
        data: [
          {
            value: 100,
            itemStyle: {
              normal: {
                color: "#ECF1F8"
              }
            }
          }
        ]
      }
    ]
  },

  barLabelRotation: {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Forest', 'Steppe', 'Desert', 'Wetland']
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['2012', '2013', '2014', '2015', '2016']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Forest',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390]
      },
      {
        name: 'Steppe',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290]
      },
      {
        name: 'Desert',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190]
      },
      {
        name: 'Wetland',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: [98, 77, 101, 99, 40]
      }
    ]
  },

  lineStack: {
    // title: {
    //   text: 'Stacked Line'
    // },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  }


}
