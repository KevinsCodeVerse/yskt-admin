<template>
  <div class="editorContent">
    <Editor v-model="content" :init="init"></Editor>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/icons/default";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/advlist";
import "tinymce/plugins/table";
import "tinymce/plugins/preview";
import "tinymce/plugins/image";
import "tinymce/plugins/paste";
import request from "../utils/request";
import * as qiniu from "qiniu-js";
export default {
  model: {
    prop: "editorContent",
    event: "change",
  },
  props: {
    id: String,
    editorContent: String,
  },
  data() {
    return {
      customDeleteTabs: false,
      content: "",
      init: {
        height: "100%",
        accept: "image/jpeg, image/png, image/jpg",
        selector: "#tinymce",
        readonly: 1,
        toolbar:
          "code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
    table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        language_url:
          window.location.origin +
          window.location.pathname +
          "static/tinymce5/langs/zh_CN.js",
        language: "zh_CN", // 需要在官网自己下载一个全局的langs包。同时我提供的powerpaste本身自带一个langs包里面含中文，所以可以100%支持中文。
        skin_url:
          window.location.origin +
          window.location.pathname +
          "static/tinymce5/skins/ui/oxide",
        content_css:
          window.location.origin +
          window.location.pathname +
          "static/tinymce5/skins/content/default/content.min.css",
        plugins: [
          "advlist",
          "table",
          "image",
          "preview", // plugins中，用powerpaste替换原来的paste
        ],
        content_style: "body {background: #fff}",
        external_plugins: {
          powerpaste:
            window.location.origin +
            window.location.pathname +
            "static/tinymce5/plugins/powerpaste/plugin.min.js",
        },
        powerpaste_word_import: "merge", // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: "merge", // propmt, merge, clear
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        end_container_on_empty_block: true,
        images_upload_handler: this.imagesUploadHandler,
      },
    };
  },
  components: { Editor },
  created() {
    console.log(
      window.location.origin +
        "/static/tinymce5/skins/content/default/content.min.css"
    );
    this.content = this.editorContent;
  },
  mounted() {},
  methods: {
    imagesUploadHandler(blobInfo, success) {
      this.handleUpload(blobInfo.blob(), success);
    },
    handleUpload(file, success) {
      try {
        request.post({
          url: "/comm/getUpToken",
          params: {},
          success: (res) => {
            const observable = qiniu.upload(file, null, res);
            observable.subscribe({
              next: undefined,
              error: () => {
                this.$message.error("上传出错，请重新上传！");
                success("uploadFail");
              },
              complete: ({ key }) => {
                this.$message.success("上传成功！");
                success(this.$envConfig.qiniuDomain + key);
              },
            });
          },
        });
      } catch (error) {
        console.log(error);
        this.$message.error("上传出错，请重新上传！");
      }
    },
  },

  watch: {
    content() {
      this.$emit("change", this.content);
    },
    editorContent(val) {
      this.content = val;
    },
  },
};
</script>

<style lang="less" scoped>
.editorContent {
  height: 400px;
}
</style>
<style>
.tox-statusbar__branding {
  display: none;
}
</style>
