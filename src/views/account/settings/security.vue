<template>
  <a-list
    itemLayout="horizontal"
  >
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">账户密码</a>
        <span slot="description">
          <span>当前密码强度：</span>
          <span>
            <div :class="['user-register', passwordLevelClass]"><span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
          </span>
        </span>
      </a-list-item-meta>
      <router-link :to="{ name: 'Password' }">
        修改
      </router-link>
    </a-list-item>
  </a-list>
</template>

<script>
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
export default {
  data () {
    return {
      data: [
        { title: '账户密码', description: '当前密码强度', value: '强', actions: { title: '修改', callback: () => { this.$message.info('This is a normal message') } } },
        { title: '密保手机', description: '已绑定手机', value: '138****8293', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success') } } },
        { title: '密保问题', description: '未设置密保问题，密保问题可有效保护账户安全', value: '', actions: { title: '设置', callback: () => { this.$message.error('This is a message of error') } } },
        { title: '备用邮箱', description: '已绑定邮箱', value: 'ant***sign.com', actions: { title: '修改', callback: () => { this.$message.warning('This is message of warning') } } },
        { title: 'MFA 设备', description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '', actions: { title: '绑定', callback: () => { this.$message.info('This is a normal message') } } }
      ],
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
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    }
  },
  methods: {
    handlePasswordLevel (value) {
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
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
      }
    },
    passwordClick () {
      this.$router.push('/account/settings/password')
    }
  }
}
</script>

<style scoped>

</style>
