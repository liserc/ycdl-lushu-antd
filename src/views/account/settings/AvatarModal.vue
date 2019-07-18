<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    @cancel="cancelHandel">
    <a-row>
      <a-col>
        <a-upload
          :fileList="fileList"
          :remove="handleRemove"
          :beforeUpload="beforeUpload"
        >
          <a-button>
            <a-icon type="upload" />选择图片
          </a-button>
        </a-upload>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :outputSize="options.size"
          :outputType="options.outputType"
          :info="true"
          :full="options.full"
          :canMove="options.canMove"
          :canMoveBox="options.canMoveBox"
          :original="options.original"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>

    <template slot="footer">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
// import { VueCropper } from 'vue-cropper'

import ACol from 'ant-design-vue/es/grid/Col'
import { uploadTheAvatar } from '@/api/user'
export default {
  components: { ACol },
  /*
  components: {
    VueCropper
  },
  */
  data () {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      options: {
        img: '',
        size: 1,
        outputType: 'jpeg',
        full: false,
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  created () {
    this.options.img = '/avatar2.jpg'
  },
  methods: {
    edit (id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.visible = false
    },
    beforeUpload (file) {
      // this.fileList = [file]
      const reader = new FileReader()
      reader.readAsDataURL(file) // 重要 以dataURL形式读取文件
      reader.onload = e => {
        const data = e.target.result
        this.options.img = data
      }
      return false
    },
    handleRemove () {

    },
    cancelHandel () {
      this.close()
    },
    okHandel () {
      // setTimeout(() => {
      //   vm.confirmLoading = false
      //   vm.close()
      //   vm.$message.success('上传头像成功')
      // }, 2000)

      const formData = new FormData()
      const vm = this
      vm.confirmLoading = true
      this.$refs.cropper.getCropBlob(data => {
        // data是裁剪后图片的blob对象
        formData.append('file', data)
        vm.confirmLoading = false
        // this.options.img = ''
        uploadTheAvatar(this.id, formData).then(() => {
          vm.confirmLoading = false
          vm.close()
          vm.$message.success('上传头像成功')
        })
      })
      return false
    },
    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
