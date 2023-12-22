<template>
  <div id="cropper">
    <div class="img_cut">
      <div class="cut">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :fixed="fixed"
          :fixed-number="fixedNumber"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          @real-time="realTime"
          :high="option.high"
          @img-load="imgLoad"
          mode="cover">
        </vue-cropper>
      </div>
      <div class="test-button">
          <label class="btn" for="uploads">选择一张图片</label>
          <input
            type="file"
            id="uploads"
            style="position:absolute; clip:rect(0 0 0 0);"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event, 1)"
          />
          
      </div>
    </div>
    
    <div
      class="show-preview"
      :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin-left': '10px'}"
    >
      <div :style="previews.div">
        <img :src="previews.url" :style="previews.img" />
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      previews: {},
      option: {
        img: require('@/assets/img/avatar_default.jpg'),
        size: 1,
        full: false,
        outputType: "jpg",
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 400,
        autoCropHeight: 50,
        fixedBox: true,
        centerBox: false,
        high: true
      },
      fixed: true,            // 是否开启截图框宽高固定比例
      fixedNumber: [1, 1]    // 截图框的宽高比例
    };
  },
  methods: {
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    },

    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        }
      };
      
    },
    finish() {
      this.$refs.cropper.getCropData(data => {
        this.$emit('imgUrl', data)
      });
    },
    imgLoad(msg) {
      console.log(msg);
    }
  }
};
</script>

<style scoped>
#cropper{
  display: flex;
}
.img_cut{
  width: 600px;
}
.cut {
  width: 600px;
  height: 600px;
}

.test-button {
  width: 600px;
  text-align: center;
}

.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ffa600;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 20px 10px 0px 0px;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #ffa600;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>