<template>

  <div class="">
    <a-row :gutter="16">
      <a-col :span="20">
        <div>
          <slot>
            {{ description }}
          </slot>
        </div>
        <div>
          <a-avatar :src="avatar"/>
          <a :href="href">{{ owner }}</a> 上传于
          <em>{{ updateAt | formatUptime }}</em>
        </div>
      </a-col>
      <a-col :span="4">
        <div style="cursor: pointer;text-align: center;margin-top: 2px">
          <span @click="onSocial">
            <a-icon type="like" theme="twoTone" :twoToneColor="twoToneColor"/>点赞
          </span>
          &nbsp;
          <span>
            <a-icon type="heart" theme="twoTone" :twoToneColor="twoToneColor"/>收藏
          </span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
export default {
  name: 'Uploader',
  components: { ACol, ARow },
  props: {
    prefixCls: {
      type: String,
      default: 'antd-pro-components-article-list-content-index-listContent'
    },
    description: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    updateAt: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      twoToneColor: '#eb2f96',
      routeSocial: {
        socialType: '',
        routeId: '',
        routeType: '',
        userId: ''
      }
    }
  },
  filters: {
    formatUptime (date) {
      if (date) {
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  methods: {
    onSocial () {
      console.log('点赞')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
