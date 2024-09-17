<template>
  <div
    class="app-main-container"
    :class="{ 'main-container-no-card': hasCard === false }"
  >
    <!-- :headerCellStyle="{
          background: '#EBEFF4',
          fontWeight: '600',
          color: '#333333',
        }" -->
    <!-- 顶部操作，描述 -->
    <div class="table-header" v-if="isShowTableHead">
      <div class="table-header-title">{{ tableTitle }}</div>
      <span style="color: red;font-size: 15px;position: absolute;left: 100px;bottom: 15px">{{tableRemark}}</span>
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
        :border="false"
        stripe
        :highlightCurrentRow="true"
        :headerCellStyle="{
          background: '#0579df',
          fontWeight: '600',
          color: '#fff',
        }"
        :loading="loading"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <el-table-column
          v-if="selectType === 'single'"
          width="60px"
          label="选择"
          :fixed="getWidth > 479 ? 'left' : false"
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
          :reserve-selection="reserveSelection"
          width="60px"
          :fixed="getWidth > 479 ? 'left' : false"
        />
        <template v-if="hasPage">
          <el-table-column
            v-if="hasSort"
            type="index"
            label="序号"
            :fixed="getWidth > 479 ? 'left' : false"
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
            :fixed="getWidth > 479 ? 'left' : false"
          />
        </template>

        <el-table-column
          v-for="c in columns"
          :key="c.id"
          :prop="c.prop"
          :label="c.label"
          :min-width="c.width || '150px'"
          :align="c.align || 'center'"
          :show-overflow-tooltip="
            c.showOverflowTooltip === false ? false : true
          "
          :sortable="c.sortable || false"
          :formatter="
            (row, column, cellValue, index) => {
              return c.render
                ? c.render(row, column, cellValue, index)
                : cellValue;
            }
          "
        >
          <template slot-scope="{ row, column, $index }">
            <slot v-if="c.renderName" :name="c.renderName" :row="row" />
            <span v-else-if="c.type === 'date'">
              {{ formdatetime(row[c.prop], c.formate) }}
            </span>
            <div v-else-if="c.type === 'dateRed'" v-html="getRed(row[c.prop])">

            </div>
            <span v-else-if="c.type === 'image'">
              <el-image
                v-if="row[c.prop]"
                style="width: 50px"
                :src="row[c.prop]"
                :preview-src-list="[row[c.prop]]"
              >
              </el-image>
              <span v-else></span>
            </span>
            <span v-else-if="c.type === 'video'">

              <video v-if="row[c.prop]" :src="row[c.prop]"
                     :poster="row.image" controls
                     preload="none"
                     width="200">
                <source :data-src="row[c.prop]" type="video/mp4" />
              </video>

            </span>
            <span
              v-else
              :style="{ color: c.colorRener ? c.colorRener(row) : undefined }"
            >
              <el-tag v-if="c.statusType" :type="c.statusType(row)">
                {{
                  c.render
                    ? c.render(row, column, row[c.prop], $index)
                    : row[c.prop]
                }}
              </el-tag>
              <span v-else>
                {{
                  c.render
                    ? c.render(row, column, row[c.prop], $index)
                    : row[c.prop]
                }}
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="operates"
          label="操作"
          :min-width="operateWidth"
          :fixed="getWidth > 479 ? 'right' : false"
        >
          <template slot-scope="scope">
            <ListOperate :operates="showOperates(scope)" :curRow="scope.row" />
          </template>
        </el-table-column>
      </jat-table>
    </div>
    <!--    layout="total,sizes, ->,  prev, pager, next, jumper"-->
    <jat-pagination
      v-if="hasPage"
      style="margin-top: 10px;"
      :layout="getWidth <= 479
    ? 'total, prev, next, jumper'
    : 'total, sizes, ->, prev, pager, next, jumper'"
      :total="total"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { getDate } from "@/utils/tools";
import HeaderOperate from "./HeaderOperate.vue";
import ListOperate from "./ListOperate.vue";

export default {
  name: "TaskTable",
  components: {
    ListOperate,
    HeaderOperate,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    selectable: {
      type: Function,
      default: () => {
        return true;
      },
    },
    operates: {
      type: [Array, Function],
      default: null,
    },
    headerOperates: {
      type: Array,
      default: () => [],
    },
    tableTitle: {
      type: String,
      default: "列表",
    },
    tableRemark: {
      type: String,
      default: "",
    },
    selectType: {
      type: String,
      default: "none",
    },
    singleKey: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasPage: {
      default: true,
    },
    isTableAbsolute: {
      default: false,
    },
    operateWidth: {
      default: "200px",
    },
    isShowTableHead: {
      type: Boolean,
      default: true,
    },
    hasCard: {
      type: Boolean,
      default: true,
    },
    hasSort: {
      type: Boolean,
      default: true,
    },
    reserveSelection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      curRow: "",
    };
  },
  computed: {
    getWidth() {
      return window.innerWidth;
    },
  },
  methods: {
    getRed(data) {
      const date = new Date(data);
      const today = new Date();
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return `<font style='color: red'>${this.formdatetime(data, "")}<font/>`;
      } else {
        return this.formdatetime(data, "");
      }
    },
    formdatetime(data, formate) {
      if (typeof data !== "undefined" && data !== null) {
        if (data.time) {
          return getDate(data.time, formate ? formate : "");
        } else if (data && typeof data === "number") {
          return getDate(data, formate ? formate : "");
        } else if (JSON.stringify(data) === "{}") {
          return "--";
        }
        return data;
      } else {
        return "--";
      }
    },
    lazyLoadVideo(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.dataset.src;
          observer.unobserve(video);
        }
      });
    },
    initLazyLoad() {
      const observer = new IntersectionObserver(this.lazyLoadVideo);
      this.$nextTick(() => {
        const videos = this.$el.querySelectorAll("video");
        videos.forEach((video) => {
          observer.observe(video);
        });
      });
    },
    onCurrentChange(curPage) {
      this.$emit("current-page-change", curPage);
    },
    onSizeChange(curSize) {
      this.$emit("size-page-change", curSize);
    },
    onSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    onSingleSelectionChange(selection) {
      if (selection) {
        this.curRow = selection[this.singleKey];
        this.$emit("single-selection-change", selection);
      }
    },
    clearSingleSelection() {
      this.curRow = "";
    },
    showOperates(val) {
      if (Array.isArray(this.operates)) {
        return this.operates;
      }
      return this.operates(val);
    },
  },
  mounted() {
    this.initLazyLoad();
  },
};
</script>


<style lang="less" scoped>


.table-header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

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
