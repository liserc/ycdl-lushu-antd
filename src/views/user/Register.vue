<template>
  <div class="main user-layout-register">
    <!--<h2><span>注册</span></h2>-->
    <a-form
      ref="formRegister"
      :form="form"
      id="formRegister"
    >
      <a-tabs
        :activeKey="register.type"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="mobile" tab="手机号注册">
          <a-form-item v-if="register.subidentifier === 2">
            <a-input
              size="large"
              placeholder="11 位手机号"
              v-decorator="['mobile', {rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }]">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16" v-if="register.subidentifier === 2">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  placeholder="验证码"
                  v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8" v-if="register.subidentifier === 2">
              <a-button
                class="getCaptcha"
                size="large"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="email" tab="邮箱注册">
          <a-form-item v-if="register.subidentifier === 3">
            <a-input
              size="large"
              type="text"
              placeholder="邮箱"
              v-decorator="['email', {rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}]"
            >
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <!--:getPopupContainer="(trigger) => trigger.parentElement"-->
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
        <a-form-item>
          <a-input
            size="large"
            type="password"
            @click="handlePasswordInputClick"
            autocomplete="false"
            placeholder="至少6位密码，区分大小写"
            v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          >
            <icon-font slot="prefix" type="icon-yiliaohangyedeICON-" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
      </a-popover>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="确认密码"
          v-decorator="['confirmPassword', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        >
          <icon-font slot="prefix" type="icon-Xtubiao-qingzaicishurumima" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="register.button"
          @click.stop.prevent="handleSubmit"
          :disabled="register.button">注册
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { getSmsCaptcha } from '@/api/login'
import { IconFont } from '@/components/IconFont'
import { postUser } from '@/api/user'

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
      register: {
        type: 'mobile',
        subidentifier: 2,
        button: false
      },
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      }
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
    handleTabClick (key) {
      this.register.type = key
      this.register.subidentifier = key === 'mobile' ? 2 : 3
      this.state.passwordLevelChecked = false
    },
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
    handlePhoneCheck (rule, value, callback) {
      callback()
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state, $message } = this
      validateFields(['mobile'], { force: true },
        (err, values) => {
          if (!err) {
            state.smsSendBtn = true
            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)
            const hide = $message.loading('短信验证码发送中..', 0)
            const data = {
              sign: 2,
              identifier: values.mobile
            }
            getSmsCaptcha(data).then(() => {
              $message.success('短信验证码发送成功', 2.5)
            }).catch(() => {
            }).finally(() => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
            })
          }
        }
      )
    },
    handleSubmit () {
      const { form: { validateFields }, state, $router } = this
      this.register.button = true
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          const identifier = this.register.subidentifier === 2 ? values.mobile : values.email
          state.passwordLevelChecked = false
          const data = {
            grantType: 'password',
            identifier: identifier,
            subidentifier: this.register.subidentifier
          }
          postUser(data).then(() => {
            $router.push({ name: 'registerResult', params: { ...values } })
          }).catch(() => {

          }).finally(() => {
            this.register.button = false
          })
        }
      })
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

  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>
