<template>
  <a-card
    :bordered="false"
    :body-style="{padding: '0',height:'300px'}">
    <a-list
      style="height: 300px; overflow: scroll; overflow-x: hidden"
      bordered
      itemLayout="vertical"
      :dataSource="keypoints"
      v-infinite-scroll="pageQuery"
      :infinite-scroll-disabled="false">
      >
      <a-list-item slot="renderItem" slot-scope="item, index">{{ item.name }}</a-list-item>
    </a-list>
  </a-card>
</template>
<script>
import { loadRoute } from '@/api/lushu/route/index.js'
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.'
]
export default {
  data () {
    return {
      data: data,
      keypoints: []
    }
  },
  created () {
    // console.log('开始搜索。。。')
    // this.pageQuery()
  },
  methods: {
    pageQuery () {
      loadRoute(3).then(response => {
        const { keypoints } = response.data
        this.keypoints = keypoints
        console.log('搜索结果：', this.keypoints)
      })
    }
  }
}
</script>
<style>
  .demo-infinite-container {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: auto;
    padding: 8px 24px;
    height: 300px;
  }
  .demo-loading-container {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
</style>
