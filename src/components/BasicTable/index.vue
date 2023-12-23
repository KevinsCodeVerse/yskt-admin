<template>
  <div
    class="app-main-container"
    :class="{ 'main-container-no-card': hasCard === false }"
  >
    <!-- 顶部操作，描述 -->
    <div class="table-header" v-if="isShowTableHead">
      <div class="table-header-title">{{ tableTitle }}</div>
      <div class="table-header-operate">
        <HeaderOperate :operates="headerOperates" />
      </div>
    </div>
    <div class="data-content">
      <jat-table
        ref="basicTable"
        class="basicTable"
        :class="{ absolute: isTableAbsolute }"
        :data="data"
        :highlightCurrentRow="true"
        :headerCellStyle="{
          background: '#EBEFF4',
          fontWeight: '600',
          color: '#333333'
        }"
        :loading="loading"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <el-table-column
          v-if="selectType === 'single'"
          width="60px"
          label="选择"
          fixed="left"
          :key="new Date().getTime()"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="curRow"
              :label="scope.row[singleKey]"
              @change="onSingleSelectionChange(scope.row)"
            >
              {{ "" }}
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-if="selectType === 'multi'"
          type="selection"
          :selectable="selectable"
          width="60px"
          fixed="left"
        />
        <template v-if="hasPage">
          <el-table-column
            v-if="hasSort"
            type="index"
            label="序号"
            fixed="left"
            align="center"
          >
            <template slot-scope="scope">
              {{
                ($attrs.currentPage - 1) * $attrs.pageSize + (scope.$index + 1)
              }}
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            v-if="hasSort"
            type="index"
            label="序号"
            fixed="left"
          />
        </template>
        <el-table-column
          v-if="operates"
          label="操作"
          :width="operateWidth"
          fixed="left"
        >
          <template slot-scope="scope">
            <ListOperate :operates="showOperates(scope)" :curRow="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          v-for="c in columns"
          :key="c.id"
          :prop="c.prop"
          :label="c.label"
          :width="c.width"
          :min-width="c.minWidth || ''"
          :align="c.align || 'left'"
          :show-overflow-tooltip="true"
          :sortable="c.sortable || false"
          :formatter="
            (row, column, cellValue, index) => {
              return c.render
                ? c.render(row, column, cellValue, index)
                : cellValue
            }
          "
        >
          <template slot-scope="{ row, column, $index }">
            <slot v-if="c.renderName" :name="c.renderName" :row="row" />
            <span v-else-if="c.type === 'date'">
              {{ formdatetime(row[c.prop]) }}
            </span>
            <span v-else>
              {{
                c.render
                  ? c.render(row, column, row[c.prop], $index)
                  : row[c.prop]
              }}
            </span>
          </template>
        </el-table-column>
      </jat-table>
    </div>

    <jat-pagination
      v-if="hasPage"
      style="margin-top: 10px"
      layout="total,sizes, ->,  prev, pager, next, jumper"
      :total="total"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { getDate } from "@/utils/tools"
import HeaderOperate from "./HeaderOperate.vue"
import ListOperate from "./ListOperate.vue"
export default {
  name: "TaskTable",
  components: {
    ListOperate,
    HeaderOperate
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    selectable: {
      type: Function,
      default: () => {
        return true
      }
    },
    operates: {
      type: [Array, Function],
      default: null
    },
    headerOperates: {
      type: Array,
      default: () => []
    },
    tableTitle: {
      type: String,
      default: "列表"
    },
    selectType: {
      type: String,
      default: "none"
    },
    singleKey: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasPage: {
      default: true
    },
    isTableAbsolute: {
      default: false
    },
    operateWidth: {
      default: "200px"
    },
    isShowTableHead: {
      type: Boolean,
      default: true
    },
    hasCard: {
      type: Boolean,
      default: true
    },
    hasSort: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      curRow: ""
    }
  },
  methods: {
    formdatetime(data) {
      if (typeof data !== "undefined" && data !== null) {
        if (data.time) {
          return getDate(data.time)
        }  else if(data && typeof data === "number" ) {
          return getDate(data)
        }
        else if (JSON.stringify(data) === "{}") {
          return "--"
        }
        return data
      } else {
        return "--"
      }
    },
    onCurrentChange(curPage) {
      this.$emit("current-page-change", curPage)
    },
    onSizeChange(curSize) {
      this.$emit("size-page-change", curSize)
    },
    onSelectionChange(selection) {
      this.$emit("selection-change", selection)
    },
    onSingleSelectionChange(selection) {
      if (selection) {
        this.curRow = selection[this.singleKey]
        this.$emit("single-selection-change", selection)
      }
    },
    clearSingleSelection() {
      this.curRow = ""
    },
    showOperates: function (val) {
      if (Array.isArray(this.operates)) {
        return this.operates
      }
      return this.operates(val)
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.table-header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .table-header-title {
    margin-left: 15px;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    line-height: 28px;
    font-weight: bold;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 5px;
      height: 100%;
      left: -10px;
      // bottom: -3px;
      background: #167cf3;
      // background: url("@/assets/img/title_bg.png") no-repeat center;
    }
  }
}
.data-content {
  flex: 1;
  height: 0px;
  position: relative;
  // .jat_table {
  //   display: none;
  // }
}
.basicTable {
  // width: 100%;
  height: 100%;
}
.main-container-no-card {
  border: none;
  box-shadow: none;
}
</style>
