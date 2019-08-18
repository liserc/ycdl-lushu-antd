<template>
  <el-carousel :autoplay="false" indicator-position="none" height="160px">
    <el-carousel-item v-for="(item,key) in dataJson" :key="key">
      <img
        v-if="item.type ===2"
        :src="item.name"
        alt="图片无法加载"
        width="350"
        :preview="2"
        :preview-text="item.explain"/>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import Vue from 'vue'
// 引入图片预览插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import { Carousel, CarouselItem } from 'element-ui'
import ARow from 'ant-design-vue/es/grid/Row'
import { detailsJson } from '@/api/lushu/point'
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(preview)
export default {
  name: 'ImageCarousel',
  components: { ARow },
  data () {
    return {
      dataJson: []
    }
  },
  created () {
    detailsJson.keypoints.forEach(item => {
      if (item.type === 2) {
        this.dataJson.push(item)
      }
    })
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
