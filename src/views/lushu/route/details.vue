<template>
  <div class="page-header-index-wide">
    <a-row :gutter="15">
      <a-col :span="15">
        <a-card :bordered="false" :body-style="{padding: '0',height:'416px'}" style="padding: 2px">
          <a-row :gutter="15">
            <a-col>
              <h1 style="font-size:20px">
                <span class="liStyle">{{ owner.name }}</span>
              </h1>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4">
              <span class="liStyle">里程 {{ owner.mileage | fromM }}km</span>
            </a-col>
            <a-col :span="4">
              <span class="liStyle">海拔落差 {{ owner.drop }}m</span>
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
        <a-card :bordered="false" :body-style="{padding: '0px'}">
          <div
            class="demo-infinite-container"
          >
            <a-list
              itemLayout="vertical"
              size="small"
              :dataSource="resolveKeywords"
            >
              <a-list-item slot="renderItem" slot-scope="item, index" :id="index">
                <a-card
                  :bordered="false"
                  :head-style="{padding:'0px',border: '0px'}"
                  @click="cardClick(index)"
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
                      :ref="index"
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
                      :ref="index"
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
                  <a-card-meta
                    description="散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。">
                  </a-card-meta>
                </a-card>
                <template slot="actions">
                  <span><a-icon type="environment"/>{{ item.city }} {{ item.district }} </span>
                </template>
              </a-list-item>
            </a-list>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col>
        <a-card :bordered="false" :body-style="{padding:'5px'}" >
          <template>
            <uploader
              :owner="authorSubject.nickName"
              :avatar="authorSubject.avatar"
              :href="authorSubject.userId"
              :updateAt="authorSubject.uptime"
              :routeId="authorSubject.routeId"
              :routeType="authorSubject.routeType"
            />
          </template>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col>
        <a-card>
          <a-divider orientation="left">评论信息</a-divider>
          <social-comment :commentSubject="commentSubject" :comments="comments" @refreshComment="refreshComment"></social-comment>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { loadBMap } from '@/assets/js/async-load-bmap.js'
import { loadRoute } from '@/api/lushu/route'
import { queryComment } from '@/api/lushu/common'
import { wgs84_to_bd09 } from '@/assets/js/gps-transform.js'
import { Button, Carousel, CarouselItem } from 'element-ui'
import moment from 'moment'
import { Uploader, SocialComment } from '@/components/Lushu'
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

Vue.use(preview)
Vue.use(VideoPlayer)
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

export default {
  components: {
    ACol,
    ARow,
    Aplayer,
    Ellipsis,
    Uploader,
    SocialComment
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
      pathId: null,
      owner: {
        'routId': '',
        'userId': '',
        'nickName': '',
        'avatar': '',
        'name': '',
        'type': undefined,
        'record': undefined,
        'snapshot': '',
        'drop': null,
        'mileage': undefined,
        'use': '',
        'start': '',
        'end': '',
        'uptime': null,
        'praise': null,
        'collection': null,
        'comment': null,
        'medias': null
      },
      map: null,
      hasData: false,
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
      },
      pagination: {
        onChange: (page) => {
          console.log(page)
        },
        pageSize: 3
      },
      authorSubject: {
        routeId: '',
        routeType: 1,
        userId: '',
        nickName: '',
        avatar: '',
        uptime: ''
      },
      commentSubject: {
        routeId: '',
        userId: '',
        routeType: 1
      },
      comments: []
    }
  },
  created () {
    const pathId = this.$route.params.id
    this.pathId = pathId
    this.commentSubject.routeId = pathId
    this.commentSubject.userId = this.$store.getters.userId
    this.initBMap()
  },
  mounted () {
    this.selectComments(this.pathId)
  },
  methods: {
    initBMap () {
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

        // 加载数据 绘制地图
        this.selectRoute(this.pathId)
      })
    },
    selectRoute (id) {
      loadRoute(id)
        .then(response => {
          this.owner = response.data
          this.authorAssignment(response.data)
          const { locations, keypoints } = response.data
          const rLocations = []
          locations.forEach(function (val) {
            const result = wgs84_to_bd09(val.lng, val.lat)
            const location = new BMap.Point(result[0], result[1])
            rLocations.push(location)
          })
          if (keypoints) {
            keypoints.forEach((val) => {
              const result = wgs84_to_bd09(val.lng, val.lat)
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
    authorAssignment (data) {
      const { routId, userId, nickName, avatar, uptime } = data
      this.authorSubject.routeId = routId
      this.authorSubject.userId = userId
      this.authorSubject.nickName = nickName
      this.authorSubject.avatar = avatar
      this.authorSubject.uptime = uptime
    },
    loadKeyPoints (points) {
      this.all_index = points.length
      points.forEach((val, index) => {
        var point = new BMap.Point(val.lat, val.lng)
        var myIcon = new BMap.Icon(
          this.route_photo[val.type],
          new BMap.Size(48, 48),
          {
            anchor: new BMap.Size(23, 48)
          }
        )
        this.markers[index] = new BMap.Marker(point, { icon: myIcon })
        this.map.centerAndZoom(point, 15)
        this.markers[index].customData = { index: index }
        this.map.addOverlay(this.markers[index])
        const that = this
        this.markers[index].addEventListener('click', function () {
          that.markers[that.now_index].setAnimation(0)
          that.scrollToListItem(this.customData.index)
          // console.log(this.customData.index)
          that.showPoint(this.customData.index)
          // that.$refs.elCarousel.setActiveItem(this.customData.index)
        })
      })
    },
    loadPolyline (locations) {
      const polyline = new BMap.Polyline(locations, {
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
    addMarker (point, imgurl) {
      const myIcon = new BMap.Icon(imgurl, new BMap.Size(38, 38), {
        anchor: new BMap.Size(22, 38)
      })
      const marker = new BMap.Marker(point, { icon: myIcon })
      this.map.addOverlay(marker)
    },
    cardClick (index) {
      this.markers[this.now_index].setAnimation(0)
      this.showPoint(index)
    },
    selectComments (id) {
      queryComment(id).then(response => {
        const { data } = response
        this.comments = data
      })
    },
    refreshComment () {
      this.selectComments(this.commentSubject.routeId)
    },
    scrollToListItem (id) {
      document.getElementById(id).scrollIntoView()
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
        color: rgba(0, 0, 0, .45);
        font-size: 12px;
      }

      /deep/ .ant-pro-avatar-list {
        flex: 0 1 auto;
      }
    }
  }

  .demo-infinite-container {
    border-radius: 4px;
    overflow-x: hidden;
    padding: 8px 24px;
    height: 420px;
  }

  .demo-loading-container {
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }

</style>
