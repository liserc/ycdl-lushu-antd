<template>
  <div class="page-header-index-wide">
    <a-row :gutter="15">
      <a-col :span="15">
        <a-card :bordered="false" :body-style="{padding: '0',height:'416px'}" style="padding: 2px">
          <a-row :gutter="15">
            <a-col>
              <h1 style="font-size:20px">
                <span class="liStyle">{{ data.name }}</span>
              </h1>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4">
              <span class="liStyle">里程 {{ data.mileage | fromM }}km</span>
            </a-col>
            <a-col :span="4">
              <span class="liStyle">平均坡度 {{ routeData[1] }}%</span>
            </a-col>
            <a-col :span="4">
              <span class="liStyle">累计爬升 {{ routeData[2] }}m</span>
            </a-col>
            <a-col :span="4">
              <span class="liStyle">海拔落差 {{ data.drop }}m</span>
            </a-col>
            <a-col :span="4">
              &nbsp;
            </a-col>
            <a-col :span="2">
              <a-button type="primary" size="small" @click="routeExport">导出</a-button>
            </a-col>
            <a-col :span="2">
              <a-button type="primary" size="small" @click="routeCollection">收藏</a-button>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <div id="container" style="height: 350px;"/>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="9">
        <a-card
          :bordered="false"
          :body-style="{padding: '0'}">
          <el-carousel
            v-if="hasData"
            ref="elCarousel"
            trigger="click"
            :interval="3000"
            :height="elCarouselHeight + 'px'"
            indicator-position="none"
            @change="carouselChange"
          >
            <el-carousel-item v-for="(item,index) in resolveKeywords" :key="index" style="overflow: auto">
              <a-card :bordered="false">
                <img
                  v-if="item.type ===2"
                  slot="cover"
                  :src="item.name"
                  height="200"
                  alt="图片无法加载"
                  :preview="2"
                  :preview-text="item.explain"/>
                <aplayer
                  v-else-if="item.type ===3"
                  :ref="index"
                  :music="{
                    title: 'secret base~君がくれたもの~',
                    artist: 'Silent Siren',
                    src: 'http://www.w3school.com.cn/i/song.ogg',
                    pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
                  }"
                  mode="circulation"
                />
                <video-player
                  v-else-if="item.type ===4"
                  :ref="index"
                  class="video-player vjs-custom-skin"
                  :options="{
                    height: '200%',
                    muted: false,
                    autoplay: false,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [{
                      type: 'video/mp4',
                      src: item.name
                    }],
                    poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg'
                  }"
                  :playsinline="true"
                />
                <div v-else-if="item.type ===5">
                  <ellipsis :length="100">{{ item.name }}</ellipsis>
                </div>
                <!--<a-card-meta-->
                <!--title="LISER">-->
                <!--<a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />-->
                <!--<template slot="description">-->
                <!--<ellipsis :length="100">散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。-->
                <!--调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。</ellipsis>-->
                <!--</template>-->
                <!--</a-card-meta>-->
                <div class="cardItemContent">
                  <span>{{ item.time | fromNow }}</span>
                  <div class="avatarList">
                    <span>{{ item.city }} {{ item.district }} {{ item.street }}</span>
                  </div>
                </div>
              </a-card>
            </el-carousel-item>
          </el-carousel>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col>
        <a-card :bordered="false" :body-style="{padding:'5px'}">
          <div>
            <a-avatar :src="data.avatar" />
            <span style="padding-left: 2px">{{ data.nickName }} 上传于：{{ '1560329422031' |formatUptime }}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col>
        <social-commentary/>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { loadBMap } from '@/assets/js/async-load-bmap.js'
import { loadRoute } from '@/api/lushu/route/index.js'
import { wgs84_to_bd09 } from '@/assets/js/gps-transform.js'
import { Button, Carousel, CarouselItem } from 'element-ui'
import moment from 'moment'
import SocialCommentary from '@/views/lushu/route/components/social-commentary.vue'
import { Ellipsis } from '@/components'
// 引入图片预览插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

// 音频播放器
import Aplayer from 'vue-aplayer'

// 引入音视频播放器
import VideoPlayer from 'vue-video-player'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

Vue.use(Button)
Vue.use(Carousel)
Vue.use(CarouselItem)

// import MuseUI from 'muse-ui'
// import 'muse-ui/dist/muse-ui.css'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(preview)
Vue.use(VideoPlayer)
// Vue.use(MuseUI)

const listData = []
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'https://vue.ant.design/',
    title: `ant design vue part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
  })
}

export default {
  components: {
    ACol,
    ARow,
    Aplayer,
    SocialCommentary,
    Ellipsis
  },
  filters: {
    fromM (data) {
      if (data) {
        return parseFloat(data / 1000).toFixed(2)
      }
    },
    formatUptime (date) {
      if (date) {
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    fromNow (date) {
      if (date) {
        return moment(Number(date)).fromNow()
      }
    }
  },
  data () {
    return {
      data: null,
      elCarouselHeight: 416,
      muCardMediaWidth: '200px',
      map: null,
      hasData: false,
      // 音视频播放配置项
      playerOptions: {
        muted: false,
        language: 'zh',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [],
        poster: '/static/images/author.jpg'
      },
      // 音视频播放类型
      playerSources: {
        mp3: 'audio/mp3',
        mp4: 'video/mp4'
      },
      roteName: '北京路口赛段',
      routeData: ['7.4', '1.99', '366.9', '188.0'],
      authorName: 'Wjh2016',
      time: '2019-6-23',
      number: '111111',
      dialogStatus: undefined,
      dialogVisible: false,
      resolveLocations: [],
      resolveKeywords: [],
      markers: [],
      now_index: 0,
      all_index: 0,
      route_photo: {
        2: require('@/assets/images/ic_route_photo.png'),
        3: require('@/assets/images/ic_route_voice.png'),
        4: require('@/assets/images/ic_route_video.png'),
        5: require('@/assets/images/ic_route_label.png')
        // 'http://duanly.oss-cn-shenzhen.aliyuncs.com/bmap/ic_route_photo.png'
      },
      images: [],
      listData,
      pagination: {
        onChange: (page) => {
          console.log(page)
        },
        pageSize: 3
      },
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' }
      ]
    }
  },
  created () {
    // 加载百度地图
    loadBMap('tSiFWPYXfG7iInGZhEfL8ThMMAisdyXQ').then(() => {
      console.log('加载地图成功')
      this.map = new BMap.Map('container')
      const point = new BMap.Point(116.404, 39.915)
      this.map.centerAndZoom(point, 15)
      this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
      this.map.addControl(new BMap.NavigationControl())
      this.map.addControl(new BMap.MapTypeControl())
      // this.map.setMapStyleV2({
      //   styleId: '2d8d9faa497c0f410abe41d80606d403'
      // })
    })

    console.log('路由传值：' + this.$route.query)
    this.data = this.$route.query
  },
  mounted () {
    this.load(this.$route.params.id)
  },
  methods: {
    load (id) {
      loadRoute(id)
        .then(response => {
          // var locations = response.data.data.locations
          const { locations, keypoints } = response.data
          const rLocations = []
          locations.forEach(function (val, index) {
            const result = wgs84_to_bd09(val.lng, val.lat)
            // eslint-disable-next-line no-undef
            const location = new BMap.Point(result[0], result[1])
            rLocations.push(location)
          })
          if (keypoints) {
            keypoints.forEach((val, index) => {
              const result = wgs84_to_bd09(val.lng, val.lat)
              // eslint-disable-next-line no-undef
              if (val.type > 1 && val.type < 6) {
                val.lng = result[1]
                val.lat = result[0]
                this.resolveKeywords.push(val)
                this.hasData = true
              }
            })
          }
          this.loadPolyline(rLocations)
          this.loadKeyPoints(this.resolveKeywords)
        })
        .catch(error => {
          console.log('加载数据失败', error)
        })
    },
    carouselChange (index) {
      this.markers[this.now_index].setAnimation(0)
      this.showPoint(index)
    },
    loadKeyPoints (points) {
      this.all_index = points.length
      points.forEach((val, index) => {
        // eslint-disable-next-line no-undef
        var point = new BMap.Point(val.lat, val.lng)
        // eslint-disable-next-line no-undef
        var myIcon = new BMap.Icon(
          this.route_photo[val.type],
          // eslint-disable-next-line no-undef
          new BMap.Size(48, 48),
          {
            // eslint-disable-next-line no-undef
            anchor: new BMap.Size(23, 48)
          }
        )
        // eslint-disable-next-line no-undef
        this.markers[index] = new BMap.Marker(point, { icon: myIcon })
        this.map.centerAndZoom(point, 15)
        this.markers[index].customData = { index: index }
        this.map.addOverlay(this.markers[index])
        const that = this
        this.markers[index].addEventListener('click', function () {
          that.markers[that.now_index].setAnimation(0)
          console.log(this.customData.index)
          that.showPoint(this.customData.index)
          that.$refs.elCarousel.setActiveItem(this.customData.index)
        })
      })
    },
    loadPolyline (locations) {
      // eslint-disable-next-line no-undef
      var polyline = new BMap.Polyline(locations, {
        strokeColor: '#00AA33', // 线路颜色
        strokeWeight: 4, // 线路大小
        //         线路类型(虚线)
        strokeStyle: 'solid' // 轨迹线为虚线
      })
      this.map.centerAndZoom(locations[locations.length / 2], 12)
      /** 添加终点和起点的标记**/
      this.addMarker(
        locations[0],
        'http://duanly.oss-cn-shenzhen.aliyuncs.com/ic_route_start.png'
      )
      this.addMarker(
        locations[locations.length - 1],
        'http://duanly.oss-cn-shenzhen.aliyuncs.com/ic_route_end.png'
      )
      this.map.addOverlay(polyline)
      this.map.setViewport(locations)
      // 创建线路
    },
    showPoint (i) {
      this.map.centerAndZoom(this.markers[i].point, this.map.getZoom())
      this.now_index = i
      this.markers[i].setAnimation(2)
    },
    nextNode () {
      this.markers[this.now_index].setAnimation(0)
      this.now_index++
      if (this.now_index > this.all_index - 1) {
        this.now_index = 0
      }
      this.showPoint(this.now_index)
    },
    previousNode () {
      this.markers[this.now_index].setAnimation(0)
      this.now_index--
      if (this.now_index < 0) {
        this.now_index = this.all_index - 1
      }
      this.showPoint(this.now_index)
    },
    addMarker (point, imgurl) {
      // eslint-disable-next-line no-undef
      const myIcon = new BMap.Icon(imgurl, new BMap.Size(38, 38), {
        // eslint-disable-next-line no-undef
        anchor: new BMap.Size(22, 38)
      })
      // eslint-disable-next-line no-undef
      const marker = new BMap.Marker(point, { icon: myIcon })
      this.map.addOverlay(marker)
    },
    routeExport () {
      alert('导出')
    },
    routeCollection () {
      alert('收藏')
    }
  }
}
</script>
<style lang="less" scoped>
  .ant-pro-pages-list-projects-cardList {
    margin-top: 24px;

    /deep/ .ant-card-meta-title {
      margin-bottom: 4px;
    }

    /deep/ .ant-card-meta-description {
      height: 44px;
      overflow: hidden;
      line-height: 22px;
    }

    .cardItemContent {
      display: flex;
      height: 20px;
      margin-top: 16px;
      margin-bottom: -4px;
      line-height: 20px;

      > span {
        flex: 1 1;
        color: rgba(0,0,0,.45);
        font-size: 12px;
      }

      /deep/ .ant-pro-avatar-list {
        flex: 0 1 auto;
      }
    }
  }
</style>
