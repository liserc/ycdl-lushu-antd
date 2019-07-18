<template>
  <div class="page-header-index-wide">
    <a-card
      :bordered="false"
      v-infinite-scroll="pageQuery"
      :infinite-scroll-distance="100"
      :infinite-scroll-listen-for-event="true"
      :body-style="{padding: '0'}">
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="grid-content bg-purple"/>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <h1 style="text-align:center">路书</h1>
            <el-input
              v-model="query.keyword"
              placeholder="请输入路线名称"
              class="input-with-select"
              size="medium"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple"/>
        </el-col>
      </el-row>
      <!--<div v-infinite-scroll="pageQuery">-->

      <el-row :gutter="16">
        <el-col v-for="site in contents" :key="site.routId" :span="8">
          <el-card shadow="hover" style="margin-bottom: 12px" :body-style="{ padding: '0px'}">
            <a :href="'#/route/details/'+site.routId+''">
              <div class="bottom clearfix">
                <div>
                  <el-image :src="site.snapshot" :style="{height:height}"/>
                </div>
                <h3 >{{ site.name }}</h3>
                <span>{{ site.routId }}</span>
              </div>
            </a>
          </el-card>
        </el-col>
      </el-row>

    </a-card>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'
import { page } from '@/api/lushu/route'
import Vue from 'vue'
import { Row, Col, Card, Image, Input, Button } from 'element-ui'
// import VueScroller from 'vue-scroller'
// Vue.use(VueScroller)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Image)
Vue.use(Input)
Vue.use(Button)
// Vue.use(infiniteScroll)
export default {
  directives: { infiniteScroll },
  data () {
    return {
      height: undefined,
      query: {
        page: -1,
        keyword: undefined
      },
      last: false,
      empty: false,
      contents: []
    }
  },
  mounted () {
    this.highlyAdaptive()
  },
  created () {
    this.highlyAdaptive()
  },
  methods: {
    highlyAdaptive () {
      window.onresize = () => {
        this.height = document.body.clientWidth / 7 + 'px'
        console.log(this.height)
      }
    },
    handleSearch () {
      this.query.page = -1
      this.last = false
      this.contents = []
      this.pageQuery()
    },
    pageQuery () {
      console.log('触发')
      if (this.last) {
        console.log('已加载全部')
        return
      }

      this.query.page += 1
      page(this.query).then(response => {
        const { content, number, last, empty } = response.data
        this.query.page = number
        this.last = last
        this.empty = empty
        console.log('返回结果：', response.data)
        if (!empty) {
          this.contents.push(...content)
        }
      })
    }
  }
}
</script>

<style>
  .scale img {
    width: 100%;
    height: auto;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }

  .clearfix:after {
    clear: both;
  }

  .el-card__body {
    padding: 5px;
  }

  .bottom {
    margin-top: 0;
  }
</style>
