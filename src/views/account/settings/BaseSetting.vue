<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form v-model="form" layout="vertical">
          <a-form-item
            label="昵称">
            <a-input v-model="form.nickName" placeholder="给自己起个名字" />
          </a-form-item>
          <a-form-item
            label="性别"
            :required="false">
            <a-select defaultValue="1" v-model="form.sex">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
              <a-select-option :value="3">其他</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="年龄"
            :required="false">
            <a-input-number v-model="form.age" :min="1" :max="200" :defaultValue="18"/>
          </a-form-item>
          <a-form-item
            label="所在地区"
            :required="false">
            <a-cascader :options="area" v-model="belongArea" placeholder="请选择所在地区" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(form.userId)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="form.avatar"/>
        </div>
      </a-col>
    </a-row>

    <avatar-modal ref="modal">

    </avatar-modal>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { ProvinceAndCityCascades } from '@/components/ChinaAreaCode'
import { putObj } from '@/api/user'
export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      belongArea: [],
      form: {
        userId: null,
        nickName: null,
        avatar: null,
        sex: null,
        age: null,
        province: null,
        city: null
      },
      preview: {},
      area: [],
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  created () {
    this.area = ProvinceAndCityCascades()
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.form = this.$store.getters.userInfo
      const { province, city } = this.form
      if (province) {
        this.belongArea.push(province)
      }
      if (city) {
        this.belongArea.push(city)
      }
    },
    handleSubmit () {
      this.form.province = this.belongArea[0]
      this.form.city = this.belongArea[1]
      putObj(this.form).then(() => {
        this.$message.success('信息修改成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
