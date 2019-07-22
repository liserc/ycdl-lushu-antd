<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="userInfo.avatar">
            </div>
            <div class="username">{{ userInfo.nickName }}</div>
            <div class="bio">海纳百川，有容乃大</div>
          </div>
          <div class="account-center-detail">
            <p>
              <i class="address"></i>
              <span>{{ userInfo.sex | filterSex }} </span>
            </p>
            <p>
              <i class="address"></i>
              <span>{{ userInfo.age }} 岁</span>
            </p>
            <p>
              <i class="address"></i>
              <span>{{ userInfo.province }} </span>
              <span>{{ userInfo.city }}</span>
            </p>
          </div>
          <a-divider/>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <point-collection v-if="noTitleKey === 'point'" :collections="pointResults"></point-collection>
          <route-collection v-else-if="noTitleKey === 'route'" :collections="routeResults"></route-collection>
        </a-card>
      </a-col>
      <a-col>
        <a-back-top />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import { AppPage, ArticlePage, ProjectPage, PointCollection, RouteCollection } from './page'

import { mapGetters } from 'vuex'
import { getCollection } from '@/api/lushu/common'
import { getUserdetails } from '@/api/user'
import ACol from 'ant-design-vue/es/grid/Col'
export default {
  components: {
    ACol,
    RouteView,
    PageView,
    AppPage,
    ArticlePage,
    ProjectPage,
    PointCollection,
    RouteCollection
  },
  data () {
    return {
      pathId: '',
      userInfo: {
        userId: '',
        nickName: '',
        avatar: '',
        sex: '',
        age: '',
        province: '',
        city: ''
      },
      pointResults: [],
      routeResults: [],
      tags: ['很有想法的', '专注设计', '辣~', '大长腿', '川妹子', '海纳百川'],
      tagInputVisible: false,
      tagInputValue: '',
      tabListNoTitle: [
        {
          key: 'point',
          tab: '收藏单点(0)'
        },
        {
          key: 'route',
          tab: '收藏路线(0)'
        }
      ],
      noTitleKey: 'point'
    }
  },
  filters: {
    filterSex (sex) {
      let result
      switch (sex) {
        case 1:
          result = '男'
          break
        case 2:
          result = '女'
          break
        case 3:
          result = '其他'
          break
        default:
          break
      }
      return result
    }
  },
  created () {
    this.pathId = this.$route.query.id
    console.log('路由传值：' + this.pathId)
    this.getUserInfo(this.pathId)
    this.getRouteSocial(this.pathId)
  },
  mounted () {
  },
  methods: {
    ...mapGetters(['nickname', 'avatar']),
    handleTabChange (key, type) {
      this[type] = key
    },
    getUserInfo (userId) {
      if (userId) {
        getUserdetails(userId).then(res => {
          const { data } = res
          this.userInfo = data
        })
      } else {
        this.userInfo = this.$store.getters.userInfo
      }
    },
    getRouteSocial (userId) {
      getCollection(userId).then(res => {
        const { pointResults, routeResults } = res.data
        this.pointResults = pointResults
        this.routeResults = routeResults
        this.tabListNoTitle[0].tab = '收藏单点(' + `${pointResults.length}` + ')'
        this.tabListNoTitle[1].tab = '收藏路线(' + `${routeResults.length}` + ')'
      })
    },

    handleTagClose (removeTag) {
      const tags = this.tags.filter(tag => tag !== removeTag)
      this.tags = tags
    },

    showTagInput () {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },

    handleInputChange (e) {
      this.tagInputValue = e.target.value
    },

    handleTagInputConfirm () {
      const inputValue = this.tagInputValue
      let tags = this.tags
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue]
      }

      Object.assign(this, {
        tags,
        tagInputVisible: false,
        tagInputValue: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
