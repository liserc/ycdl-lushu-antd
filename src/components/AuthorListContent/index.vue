<template>
  <div class="antd-pro-components-article-list-content-index-listContent">
    <div class="description">
      <slot>
        {{ description }}
      </slot>
    </div>
    <div class="extra">
      <a-avatar :src="avatar" size="small" />
      <router-link :to="{path:'/account/center', query:{id:href}}">{{ owner }}</router-link> 上传于
      <!--<a :href="href">{{ owner }}</a> 上传于-->
      <em>{{ updateAt | formatUptime }}</em>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'AuthorListContent',
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
  filters: {
    formatUptime (date) {
      if (date) {
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../index.less';

  .antd-pro-components-article-list-content-index-listContent {
    .description {
      max-width: 720px;
      line-height: 22px;
    }
    .extra {
      margin-top: 16px;
      color: @text-color-secondary;
      line-height: 22px;

      & /deep/ .ant-avatar {
        position: relative;
        top: 1px;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        vertical-align: top;
      }

      & > em {
        /*margin-left: 16px;*/
        color: @disabled-color;
        font-style: normal;
      }
    }
  }

  @media screen and (max-width: @screen-xs) {
    .antd-pro-components-article-list-content-index-listContent {
      .extra {
        & > em {
          display: block;
          margin-top: 8px;
          margin-left: 0;
        }
      }
    }
  }
</style>
