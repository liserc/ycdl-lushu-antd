<template>
  <div class="main user-layout-register">
    <a-form
      ref="formPassword"
      :form="form"
      id="formPassword"
    >
      <a-form-item label="旧密码" v-bind="formItemLayout">
        <a-input
          size="large"
          type="password"
          v-decorator="['oldPassword', {rules: [{ required: true, message: '请输入之前使用的密码' }], validateTrigger: ['change', 'blur']}]"
        >
          <icon-font slot="prefix" type="icon-yiliaohangyedeICON-" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-popover
        placement="rightTop"
        :trigger="['focus']"
        v-model="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }">
            <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
            <div style="margin-top: 10px;">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item label="新密码" v-bind="formItemLayout">
          <a-input
            size="large"
            type="password"
            @click="handlePasswordInputClick"
            autocomplete="false"
            v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          >
            <icon-font slot="prefix" type="icon-yiliaohangyedeICON-" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
      </a-popover>

      <a-form-item label="确认密码" v-bind="formItemLayout">
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          v-decorator="['confirmPassword', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        >
          <icon-font slot="prefix" type="icon-Xtubiao-qingzaicishurumima" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item v-bind="tailFormItemLayout">
        <a-button
          type="primary"
          htmlType="submit"
          class="commit-button"
          :loading="commit"
          @click.stop.prevent="handleSubmit"
          :disabled="commit">确定
        </a-button>
        <a-button
          class="reset-btn"
          @click.stop.prevent="handleCancel">重置
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { IconFont } from '@/components/IconFont'
import { putAccountPassword } from '@/api/user'

const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'Register',
  components: {
    IconFont
  },
  mixins: [mixinDevice],
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 18,
            offset: 6
          }
        }
      },
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      commit: false
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    handlePasswordInputClick () {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    handlePasswordLevel (rule, value, callback) {
      let level = 0
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleSubmit () {
      const { form: { validateFields }, state } = this
      this.commit = true
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          state.passwordLevelChecked = false
          const { oldPassword, password } = values
          const parameter = {
            oldPassword: oldPassword,
            newPassword: password
          }
          putAccountPassword(parameter).then(res => {
            const { data } = res
            if (data) {
              this.$message.success('修改成功')
              this.handleCancel()
            } else {
              this.$message.error('密码错误')
            }
          }).finally(() => {
            this.commit = false
          })
        }
      })
    },
    handleCancel () {
      this.state.passwordLevelChecked = false
      this.form.resetFields()
    }
  }
}
</script>
<style lang="less">
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }
</style>
<style lang="less" scoped>
  .main {
    min-width: 300px;
    width: 400px;
    margin: 0 auto;
  }
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .commit-button {
      width: 40%;
    }

    .reset-btn {
      float: right;
      width: 40%;
      margin-top: 4px;
    }
  }
</style>
