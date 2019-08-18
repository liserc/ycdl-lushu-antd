<template>
  <a-card :bordered="false" :body-style="{padding:'2px'}">
    <el-carousel ref="elCarousel" height="340px" :autoplay="false" indicator-position="none" @change="carouselChange">
      <el-carousel-item v-for="(item,key) in keypoints" :key="key">
        <a-row>
          <a-col :span="7">&nbsp;</a-col>
          <a-col :span="10">
            <a-card
              :bordered="false"
            >
              <template slot="title">
                <span>{{ item.street }}</span>
              </template>
              <template slot="extra">
                <span>{{ item.time | formatUptime }}</span>
              </template>
              <template slot="cover">
                <img
                  v-if="item.type ===2"
                  :src="item.name"
                  alt="图片无法加载"
                  height="200"
                  :preview="2"
                  :preview-text="item.explain"/>
                <aplayer
                  v-if="item.type ===3"
                  :music="{
                    title: 'music',
                    artist: '录音',
                    src: 'http://www.w3school.com.cn/i/song.ogg',
                    pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
                  }"
                  mode="circulation"
                />
                <video-player
                  v-if="item.type ===4"
                  class="vjs-custom-skin"
                  :options="{
                    height: '200',
                    muted: false,
                    autoplay: false,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [{
                      type: 'video/mp4',
                      src: item.name
                    }]
                  }"
                  :playsinline="false"
                />
                <h3 v-if="item.type ===5" slot="title">{{ item.name }}</h3>
              </template>
              <a-card-meta>
                <template slot="description">
                  <span>散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。</span>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
          <a-col :span="7">&nbsp;</a-col>
        </a-row>
      </el-carousel-item>
    </el-carousel>
  </a-card>
</template>
<script>
import Vue from 'vue'
// import vGallery from 'v-gallery'
// Vue.use(vGallery)
import { Carousel, CarouselItem } from 'element-ui'
// 引入图片预览插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
// 音频播放器
import Aplayer from 'vue-aplayer'
// 引入音视频播放器
import VideoPlayer from 'vue-video-player'
import moment from 'moment'
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(preview)

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

export default {
  name: 'PointGallery',
  components: {
    Aplayer
  },
  props: {
    keypoints: {
      type: Array,
      default: () => {
        return []
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
  data () {
    return {
    }
  },
  methods: {
    carouselChange (index) {
      this.$emit('mapRelation', index)
    },
    carouselActiveItem (index) {
      this.$refs.elCarousel.setActiveItem(index)
    }
  }
}
</script>
<style>
</style>
