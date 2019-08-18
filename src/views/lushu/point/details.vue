<template>
  <div class="page-header-index-wide">
    <a-row>
      <a-col :span="24">
        <a-card :bordered="false">
          <a-card-meta
            :title="pointData.name">
            <template slot="description">
              <div>
                <a-icon type="environment"/>
                <span>{{ pointData.province }}{{ pointData.city }}{{ pointData.district }}{{ pointData.street }}</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card :bordered="false" :body-style="{padding:'2px',height:'400px'}">
          <div :id="mapId" style="height: 100%">
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
        <a-card :body-style="{padding:'10px'}">
          <a-divider orientation="left">标注点信息</a-divider>
          <template v-if="medias > 0">
            <point-gallery ref="pointCarousel" :keypoints="keypoints" @mapRelation="mapRelation"/>
          </template>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col>
        <a-card :body-style="{padding:'10px'}">
          <a-divider orientation="left">评论信息</a-divider>
          <template v-if="show">
            <social-comment :commentSubject="commentSubject" :comments="comments" @refreshComment="refreshComment"></social-comment>
          </template>
        </a-card>
      </a-col>
      <a-col>
        <a-back-top />
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { loadBMapBasic } from '@/assets/js/async-load-bmap.js'
import { details, detailsJson } from '@/api/lushu/point'
import { wgs84_to_bd09 } from '@/assets/js/gps-transform.js'
import { Uploader, SocialComment } from '@/components/Lushu'
import { PointGallery } from './components'
import { queryComment } from '@/api/lushu/common'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
export default {
  components: { ACol, ARow, Uploader, SocialComment, PointGallery },
  data () {
    return {
      mapId: 'BMap-Lushu',
      map: null,
      zoom: 11,
      id: '',
      routePhoto: {
        2: require('@/assets/images/ic_route_photo.png'),
        3: require('@/assets/images/ic_route_voice.png'),
        4: require('@/assets/images/ic_route_video.png'),
        5: require('@/assets/images/ic_route_label.png'),
        9: require('@/assets/images/marker_single_point_40.png')
      },
      markers: [],
      pointData: {},
      medias: '',
      keypoints: [],
      noMediasKeypoints: {
        'type': 9,
        'lng': null,
        'lat': null
      },
      animationIndex: 0,
      authorSubject: {
        routeId: '',
        routeType: 0,
        userId: '',
        nickName: '',
        avatar: '',
        uptime: ''
      },
      show: false,
      commentSubject: {
        routeId: '',
        userId: '',
        routeType: 0
      },
      comments: []
    }
  },
  created () {
    this.id = this.$route.params.id
    console.log('路由传值：' + this.id)
    this.initMap()
  },
  mounted () {
  },
  methods: {
    initMap () {
      loadBMapBasic('tSiFWPYXfG7iInGZhEfL8ThMMAisdyXQ').then(() => {
        // 百度地图API功能
        this.map = new BMap.Map(this.mapId) // 创建Map实例

        // 添加地图类型控件
        this.map.addControl(
          new BMap.MapTypeControl({
            mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
          })
        )
        this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        const point = new BMap.Point(116.404, 39.915)
        this.map.centerAndZoom(point, this.zoom)
        this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
        this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
        this.map.addControl(new BMap.NavigationControl())
        this.map.addControl(new BMap.MapTypeControl())

        this.loadDetails()
      }).catch(error => {
        console.log('地图加载失败：', error)
        this.$message.error('地图加载失败')
      })
    },
    loadDetails () {
      details(this.id).then(res => {
        const { data } = res
        const { pointId, userId, nickName, avatar, uptime, lng, lat, medias, keypoints } = data
        this.pointData = data
        this.medias = medias
        this.keypoints = keypoints
        // this.medias = detailsJson.medias
        // this.keypoints = detailsJson.keypoints
        this.authorSubject.routeId = pointId
        this.authorSubject.userId = userId
        this.authorSubject.nickName = nickName
        this.authorSubject.avatar = avatar
        this.authorSubject.uptime = uptime
        this.commentSubject.routeId = pointId
        this.commentSubject.userId = this.$store.getters.userId
        this.show = true
        if (this.keypoints && this.keypoints.length > 0) {
          this.transferLocation(this.keypoints)
        } else {
          this.addNoMediasMarkers(lat, lng)
        }
        this.loadComments(pointId)
      })
    },
    transferLocation (data) {
      const locations = []
      data.forEach(value => {
        const result = wgs84_to_bd09(value.lng, value.lat)
        value.lng = result[1]
        value.lat = result[0]
        locations.push(value)
      })
      this.addMarkers(locations)
    },
    addMarkers (data) {
      data.forEach((val, index) => {
        const point = new BMap.Point(val.lat, val.lng)
        const icon = new BMap.Icon(
          this.routePhoto[val.type],
          new BMap.Size(48, 48),
          {
            anchor: new BMap.Size(23, 48)
          }
        )
        this.markers[index] = new BMap.Marker(point, { icon: icon })
        this.map.centerAndZoom(point, 15)
        this.map.addOverlay(this.markers[index])
        const that = this
        if (that.medias > 0) {
          that.markers[index].addEventListener('click', function () {
            that.carouselRelation(index)
          })
        }
      })
    },
    addNoMediasMarkers (lat, lng) {
      const result = wgs84_to_bd09(lng, lat)
      const BLng = result[1]
      const BLat = result[0]
      const point = new BMap.Point(BLat, BLng)
      const icon = new BMap.Icon(
        this.routePhoto[9],
        new BMap.Size(48, 48),
        {
          anchor: new BMap.Size(23, 48)
        }
      )
      const markers = new BMap.Marker(point, { icon: icon })
      this.map.centerAndZoom(point, 15)
      this.map.addOverlay(markers)
    },
    mapRelation (index) {
      this.markerAnimation(index)
      this.animationIndex = index
    },
    carouselRelation (index) {
      this.$refs.pointCarousel.carouselActiveItem(index)
      this.markerAnimation(index)
      this.animationIndex = index
    },
    markerAnimation (index) {
      this.markers[this.animationIndex].setAnimation(0)
      this.markers[index].setAnimation(2)
    },
    loadComments (id) {
      queryComment(id).then(response => {
        const { data } = response
        this.comments = data
      })
    },
    refreshComment () {
      this.loadComments(this.commentSubject.routeId)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
