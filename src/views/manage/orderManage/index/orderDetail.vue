<!-- 详情 -->
<template>
  <div>
    <el-dialog
      title="订单详情"
      :close-on-click-modal="false"
      :visible.sync="detailVisible"
      width="70%"
      @close="handleClose"
    >
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../../utils/request";

export default {
  data() {
    return {
      detailVisible: false,
      info: {},
    };
  },

  methods: {
    open(orderNum) {
      this.detailVisible = true;
      this.getDetailInfo(orderNum);
    },
    handleClose() {
      this.detailVisible = false
    },
    getDetailInfo(orderNum) {
      request.post({
        url: "/system/sysCourseOrder/detail",
        params: {
          orderNum,
        },
        success: (res) => {
            console.log(res);
          this.info = res;
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
