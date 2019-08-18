<template>
  <div>
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
      style="max-width: 300px; margin: auto"
    >
      <a-list-item>
        <div>
          <a-icon type="mobile"/>
          <span>{{ data.mobile.identifier | filterMobile }}</span>
        </div>
        <a slot="actions" v-if="data.mobile.bindingState === 1" @click="unBindHandle(data.mobile.subidentifier)">解除绑定</a>
        <a slot="actions" v-if="data.mobile.bindingState === 2" @click="bindHandle(data.mobile.subidentifier)">绑定</a>
      </a-list-item>
      <a-list-item>
        <div>
          <a-icon type="mail"/>
          <span>{{ data.email.identifier | filterEmail }}</span>
        </div>
        <a slot="actions" v-if="data.email.bindingState === 1" @click="unBindHandle(data.email.subidentifier)">解除绑定</a>
        <a slot="actions" v-if="data.email.bindingState === 2" @click="bindHandle(data.email.subidentifier)">绑定</a>
      </a-list-item>
    </a-list>
    <a-modal
      :title="modal.title"
      :width="400"
      v-model="modal.visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        :form="form"
      >
        <a-form-item v-if="account.subidentifier ===2">
          <a-input
            size="large"
            placeholder="11 位手机号"
            v-decorator="['mobile', {rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ } ], validateTrigger: ['change', 'blur'] }]">
            <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

        <a-form-item v-if="account.subidentifier === 3">
          <a-input
            size="large"
            type="text"
            placeholder="邮箱"
            v-decorator="['email', {rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}]"
          >
            <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { getAccountBind, postAccountBind, deleteAccountBind } from '@/api/user'
export default {
  data () {
    return {
      data: {
        mobile: {
          authId: '',
          userId: '',
          grantType: '',
          identifier: '',
          subidentifier: 2,
          bindingState: 2
        },
        email: {
          authId: '',
          userId: '',
          grantType: '',
          identifier: '',
          subidentifier: 3,
          bindingState: 2
        }
      },
      modal: {
        title: '绑定',
        visible: false,
        bind: true
      },
      account: {
        subidentifier: ''
      },
      form: this.$form.createForm(this)
    }
  },
  filters: {
    filterMobile (value) {
      if (value) {
        const start = value.slice(0, 3)
        const end = value.slice(-4)
        return `${start}****${end}`
      }
    },
    filterEmail (value) {
      if (value) {
        const start = value.slice(0, 2)
        const index = value.indexOf('@')
        const end = value.slice(index - 2)
        return `${start}******${end}`
      }
    }
  },
  created () {
    this.handleGetAccountBind()
  },
  methods: {
    handleGetAccountBind () {
      getAccountBind().then(res => {
        const { data } = res
        data.forEach(item => {
          if (item.subidentifier === 2) {
            this.data.mobile = item
          } else if (item.subidentifier === 3) {
            this.data.email = item
          }
        })
      })
    },
    bindHandle (subidentifier) {
      this.modal.title = '绑定'
      this.modal.visible = true
      this.modal.bind = true
      this.account.subidentifier = subidentifier
    },
    unBindHandle (subidentifier) {
      this.modal.title = '解绑'
      this.modal.visible = true
      this.modal.bind = false
      this.account.subidentifier = subidentifier
    },
    handleOk () {
      const { form: { validateFields } } = this
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          const identifier = this.account.subidentifier === 2 ? values.mobile : values.email
          const data = {
            identifier: identifier,
            subidentifier: this.account.subidentifier
          }
          if (this.modal.bind) {
            postAccountBind(data).then(() => {
              this.$message.success('绑定成功')
              this.modal.visible = false
              this.handleGetAccountBind()
            })
          } else {
            deleteAccountBind(data).then(() => {
              this.$message.success('解绑成功')
              this.modal.visible = false
              this.handleGetAccountBind()
            })
          }
        }
      })
    },
    handleCancel () {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
