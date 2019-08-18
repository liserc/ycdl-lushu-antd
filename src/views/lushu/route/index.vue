<template>
  <div class="page-header-index-wide">
    <a-row :gutter="20">
      <a-col
        :xl="10"
        :lg="24"
        :md="24"
        :sm="24"
        :xs="24">
        <a-card :bordered="false" :body-style="{padding: '10px'}">
          <span slot="title">类型</span>
          <div>
            <a-radio-group
              v-model="query.record"
              :defaultValue="''"
              @change="filterSearch"
              name="typeRadio"
              buttonStyle="solid"
              size="small">
              <a-radio-button v-for="item in typeRadios" :key="item.value" :value="item.value">{{ item.label }}</a-radio-button>
            </a-radio-group>
          </div>
        </a-card>
        <a-card :bordered="false" :body-style="{padding: '10px'}">
          <span slot="title">行程</span>
          <div>
            <a-radio-group
              v-model="query.mileage"
              :defaultValue="''"
              @change="filterSearch"
              name="mileageRadio"
              buttonStyle="solid"
              size="small">
              <a-radio-button v-for="item in mileageRadios" :key="item.value" :value="item.value">{{ item.label }}</a-radio-button>
            </a-radio-group>
          </div>
        </a-card>
        <a-card :bordered="false" :body-style="{padding: '10px'}">
          <span slot="title">地区</span>
          <div style="margin-top: 0px">
            <a-radio-group
              v-model="chinaArea.provinceCode"
              :defaultValue="''"
              name="provinceRadio"
              @change="provinceRadioChange"
              buttonStyle="solid"
              size="small">
              <a-radio-button v-for="item in provinceRadios" :key="item.value" :value="item.value">{{ item.label }}</a-radio-button>
            </a-radio-group>
          </div>
          <a-divider />
          <div v-if="selectProvince">
            <a-radio-group
              v-model="chinaArea.cityCode"
              :defaultValue="0"
              name="cityRadio"
              @change="cityRadioChange"
              buttonStyle="solid"
              size="small">
              <a-radio-button v-for="item in cityRadios" :key="item.value" :value="item.value">{{ item.label }}</a-radio-button>
            </a-radio-group>
          </div>
        </a-card>
      </a-col>
      <a-col :xl="14" :lg="24" :md="24" :sm="24" :xs="24">
        <a-row>
          <a-col>
            <a-card :bordered="false" :bodyStyle="{ padding: '0px' }">
              <a-input-search v-model="query.keyword" @search="filterSearch" size="large" placeholder="请输入关键字进行搜索" enterButton="搜索"/>
            </a-card>
          </a-col>
        </a-row>
        <br>
        <a-row>
          <a-col>
            <a-card>
              <a-list
                itemLayout="vertical"
                size="small"
                :loading="loading"
                :pagination="pagination"
                :dataSource="contents">
                <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
                  <a-list-item-meta>
                    <router-link slot="title" :to="'/route/details/'+item.routId">{{ item.name }}</router-link>
                    <template slot="description">
                      <span>
                        <a-tag color="blue">{{ item.record | filterRecord }}</a-tag>
                        <a-tag color="cyan">{{ item.mileage | filterMileage }} km</a-tag>
                        <a-tag color="green">{{ item.medias }} 标注点</a-tag>
                      </span>
                    </template>
                  </a-list-item-meta>
                  <author-list-content :description="item.description" :owner="item.nickName" :avatar="item.avatar" :href="item.userId" :updateAt="item.start"/>
                  <div v-if="item.city" style="padding: 2px; margin-top: 5px">
                    <a-icon type="environment"/>
                    <span>{{ item.city }} {{ item.district }}</span>
                  </div>
                  <template slot="actions">
                    <icon-text type="like-o" :text="item.praise" />
                    <icon-text type="star-o" :text="item.collection" />
                    <icon-text type="message" :text="item.comment" />
                  </template>
                  <img slot="extra" width="200" alt="logo" :src="item.snapshot"/>
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <a-back-top />
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import { page } from '@/api/lushu/route'
import ARow from 'ant-design-vue/es/grid/Row'
import AInputSearch from 'ant-design-vue/es/input/Search'
import ACol from 'ant-design-vue/es/grid/Col'
import AuthorListContent from '@/components/AuthorListContent'
import IconText from '@/components/IconText'
import { LoadCityCode, LoadCityLabel, LoadProvinceCode, LoadProvinceLabel } from '@/components/ChinaAreaCode'

export default {
  components: { ACol, AInputSearch, ARow, AuthorListContent, IconText },
  filters: {
    fromNow (date) {
      if (date) {
        return moment(parseInt(date)).fromNow()
      }
    },
    filterRecord (record) {
      if (record === 1) {
        return '步行'
      } else {
        return '驾车'
      }
    },
    filterMileage (data) {
      if (data) {
        return parseFloat(data / 1000).toFixed(2)
      }
    }
  },
  created () {
    this.pageQuery(this.query.page)
  },
  data () {
    return {
      loading: true,
      query: {
        page: 0,
        size: undefined,
        keyword: undefined,
        record: undefined,
        mileage: undefined,
        province: undefined,
        city: undefined
      },
      chinaArea: {
        provinceCode: '',
        provinceLabel: '',
        cityCode: '',
        cityLabel: ''
      },
      selectProvince: false,
      last: false,
      totalPages: 0,
      empty: false,
      contents: [],
      loadingMore: false,
      pagination: {
        onChange: (page) => {
          this.pageQuery(page - 1)
          this.scrollBack()
        },
        pageSize: 10,
        total: 0
      },
      typeRadios: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '步行',
          value: 1
        },
        {
          label: '驾车',
          value: 0
        }
      ],
      mileageRadios: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '0-5km',
          value: 5
        },
        {
          label: '5-10km',
          value: 10
        },
        {
          label: '10-25km',
          value: 25
        },
        {
          label: '25-50km',
          value: 50
        },
        {
          label: '50-100km',
          value: 100
        },
        {
          label: '100+km',
          value: 101
        }
      ],
      provinceRadios: [],
      cityRadios: []
    }
  },
  mounted () {
    this.provinceRadios = LoadProvinceCode()
  },
  methods: {
    scrollBack () {
      // 切换页面时滚动条自动滚动到顶部
      window.scrollTo(0, 0)
    },
    pageQuery (currentPage) {
      this.query.page = currentPage
      this.query.size = this.pagination.pageSize
      page(this.query).then(response => {
        const { content, totalElements, totalPages, number, last, empty } = response.data
        this.query.page = number
        this.last = last
        this.totalPages = totalPages
        this.empty = empty
        this.pagination.total = Number(totalElements)
        this.loading = false
        this.contents = content
      }).catch(() => {
        this.loading = false
      })
    },
    filterSearch () {
      this.pageQuery(0)
    },
    provinceRadioChange () {
      const { provinceCode } = this.chinaArea
      if (provinceCode) {
        this.selectProvince = true
        this.cityRadios = LoadCityCode(provinceCode)
        this.query.province = LoadProvinceLabel(provinceCode)
      } else {
        this.selectProvince = false
        this.chinaArea.cityRadios = []
        this.query.province = undefined
      }
      this.filterSearch()
    },
    cityRadioChange () {
      const { provinceCode, cityCode } = this.chinaArea
      if (cityCode) {
        this.query.city = LoadCityLabel(provinceCode, cityCode)
      } else {
        this.query.city = undefined
      }
      this.filterSearch()
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-radio-button-wrapper{
    margin-left: 10px;
    margin-top: 10px;
  }

  .wrap-box {
    overflow-y: scroll;
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    /*margin-top: 16px;*/
    margin-bottom: -4px;
    line-height: 20px;

    > span {
      flex: 1 1;
      color: rgba(0, 0, 0, .45);
      font-size: 12px;
    }

    /deep/ .ant-pro-avatar-list {
      flex: 0 1 auto;
    }
  }
</style>
