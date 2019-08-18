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
      <br/>
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
import ACol from 'ant-design-vue/es/grid/Col'
import { uploadTheAvatar } from '@/api/user'
export default {
  components: { ACol },
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
    this.options.img = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
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
      const reader = new FileReader()
      reader.readAsDataURL(file) // 重要 以dataURL形式读取文件
      reader.onload = e => {
        this.options.img = e.target.result
      }
      return false
    },
    handleRemove () {

    },
    cancelHandel () {
      this.close()
    },
    okHandel () {
      const formData = new FormData()
      const vm = this
      vm.confirmLoading = true
      this.$refs.cropper.getCropBlob(data => {
        formData.set('file', data)
        uploadTheAvatar(this.id, formData).then(() => {
          vm.uploadSuccess()
        }).finally(() => {
          vm.confirmLoading = false
        })
      })
      return false
    },
    realTime (data) {
      this.previews = data
    },
    uploadSuccess () {
      this.close()
      this.$store.dispatch('GetUserDetails').then(() => {
        this.$emit('refreshUserDetails')
      }).finally(() => {
        this.$message.success('上传头像成功')
      })
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
