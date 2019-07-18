<template>
  <div class="page-header-index-wide">
    <el-row :gutter="15">
      <el-col :span="16">
        <a-card :bordered="false" :body-style="{padding:'2px'}">
          <div :id="mapId" class="bm-view">
          </div>
          <a-input-search
            class="search"
            placeholder="搜索地点"
            @search="onSearch"></a-input-search>
        </a-card>
      </el-col>
      <el-col :span="8">
        <point-list list-height="600px" :loading="loading" :contents="pointData" @selection="selection"/>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col>
        <a-card :bordered="false" :body-style="{padding:'5px'}" >
          <template>
            <uploader
              :owner="authorSubject.nickName"
              :avatar="authorSubject.avatar"
              :href="authorSubject.avatar"
              :updateAt="authorSubject.uptime"/>
          </template>
        </a-card>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col>
        <a-card :body-style="{padding:'10px'}">
          <a-divider orientation="left">标注点信息</a-divider>
          <template v-if="keypoints">
            <point-gallery :keypoints="keypoints"/>
          </template>
        </a-card>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col>
        <a-card :body-style="{padding:'10px'}">
          <a-divider orientation="left">评论信息</a-divider>
          <!--<social-commentary/>-->
          <template v-if="show">
            <social-comment :commentSubject="commentSubject" :comments="comments" @refreshComment="refreshComment"></social-comment>
          </template>
        </a-card>
      </el-col>
      <a-back-top />
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import { search } from '@/api/lushu/point/index.js'
import { queryComment } from '@/api/lushu/common/index.js'
import { loadBMap } from '@/assets/js/async-load-bmap.js'
import { wgs84_to_bd09 } from '@/assets/js/gps-transform.js'
// import SocialCommentary from '@/views/lushu/route/components/social-commentary.vue'
import moment from 'moment'
import { Row, Col, Carousel, CarouselItem, Collapse, CollapseItem, Card, Button } from 'element-ui'
import ACol from 'ant-design-vue/es/grid/Col'
import { Uploader, SocialCommentary } from '@/components/Lushu'
import PointList from './components/PointList'
import PointGallery from './components/PointGallery'
import SocialComment from '@/components/Lushu/SocialComment'
Vue.use(Row)
Vue.use(Col)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Card)
Vue.use(Button)
export default {
  components: { ACol, Uploader, PointList, PointGallery, SocialCommentary, SocialComment },
  filters: {
    formatUptime (date) {
      if (date) {
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  data () {
    return {
      mapId: 'BMap-' + parseInt(Date.now() + Math.random()),
      map: null,
      zoom: 11,
      points: [],
      markers: [],
      icon: require('@/assets/images/ic_route_photo.png'),
      currentLocation: null,
      query: {
        keyword: undefined,
        sLng: undefined,
        sLat: undefined,
        eLng: undefined,
        eLat: undefined,
        range: 10
      },
      loading: true,
      pointData: [],
      activeName: null,
      point_photo: {
        3: require('@/assets/images/music.png'),
        4: require('@/assets/images/video.png')
        // 'http://duanly.oss-cn-shenzhen.aliyuncs.com/bmap/ic_route_photo.png'
      },
      images: [],
      authorSubject: {
        pointId: '',
        userId: '',
        nickName: '',
        avatar: '',
        uptime: ''
      },
      commentSubject: {
        routeId: '',
        userId: '',
        routeType: 0
      },
      show: false,
      keypoints: [],
      comments: []
    }
  },
  mounted () {
  },
  created () {
    this.initMap()
  },
  methods: {
    initMap () {
      loadBMap('tSiFWPYXfG7iInGZhEfL8ThMMAisdyXQ')
        .then(() => {
          // 百度地图API功能
          this.map = new BMap.Map(this.mapId, { enableMapClick: false }) // 创建Map实例

          // 添加地图类型控件
          this.map.addControl(
            new BMap.MapTypeControl({
              mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
            })
          )
          // this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
          this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

          const that = this
          // 浏览器定位获取当前经纬度坐标
          const geolocation = new BMap.Geolocation()
          geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              that.currentLocation = r.point
              that.map.centerAndZoom(r.point, that.zoom)
              that.query.sLng = r.point.lng
              that.query.sLat = r.point.lat
              console.log('浏览器定位成功：', r.point)
            } else {
              console.log('浏览器定位失败：', r)
            }
          })

          // 开启SDK辅助定位
          // geolocation.enableSDKLocation()
          // geolocation.getCurrentPosition(function (r) {
          //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //     console.log('SDK定位成功：', this)
          //     that.currentLocation = r.point
          //     that.map.centerAndZoom(r.point, that.zoom)
          //     that.query.sLng = r.point.lng
          //     that.query.sLat = r.point.lat
          //   } else {
          //     console.log('SDK定位失败：', this.getStatus())
          //   }
          // })

          // 添加定位控件
          const geolocationControl = new BMap.GeolocationControl()
          geolocationControl.addEventListener('locationSuccess', function (e) {
            // 定位成功事件
            var address = ''
            address += e.addressComponent.province
            address += e.addressComponent.city
            address += e.addressComponent.district
            address += e.addressComponent.street
            address += e.addressComponent.streetNumber
            alert('当前定位地址为：' + address)
          })
          geolocationControl.addEventListener('locationError', function (e) {
            // 定位失败事件
            alert(e.message)
          })
          that.map.addControl(geolocationControl)

          // 加载数据
          this.loadPoints()
        })
        .catch(err => {
          console.log('地图加载失败：', err)
        })
    },
    loadPoints () {
      search(this.query).then(response => {
        const { data } = response
        this.pointData = data
        this.loading = false
        this.activeName = data[0].pointId
        const that = this
        data.forEach(value => {
          const location = wgs84_to_bd09(value.lng, value.lat)
          const point = new BMap.Point(location[0], location[1])
          if (that) {
            const marker = this.addMarkerToMap(point, value)
            that.points.push(point)
            that.markers.push(marker)
          }
        })
        this.map.setViewport(this.points)
        new BMapLib.MarkerClusterer(this.map, { markers: this.markers })
      }).catch(error => {
        console.log('数据加载失败：', error)
      })
    },
    addMarkerToMap (point, value) {
      const startIcon = new BMap.Icon(this.icon, new BMap.Size(80, 40), {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(40, 40),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(20, 0)
      })
      // 创建标注对象并添加到地图
      const marker = new BMap.Marker(point, { icon: startIcon })
      this.map.addOverlay(marker)
      const infoWindow = this.getInfoWindow(value)
      marker.addEventListener('click', function () {
        this.activeName = value.pointId
        console.log(this.activeName)
        this.openInfoWindow(infoWindow)
      })

      return marker
    },
    getInfoWindow (value) {
      const sContent =
          '<div style=\'height: 100px;width: 300px;\'>\n' +
          '    <div style=\'width: 20%;height: 100%;float: left;\'>\n' +
          '        <img style=\'height: 40px;width: 40px;border-radius: 20px\' src=\'' + value.avatar + '\'>\n' +
          '        <img id=\'collect\' style=\'height: 40px;width: 40px;border-radius: 20px\'' +
          '              src=\'http://ycdl.oss-cn-shenzhen.aliyuncs.com/bmap/ic_uncollect.png\'>\n' +
          '    </div>\n' +
          '    <div style=\'width: 80%;height: 100%;float: left;\'>\n' +
          '        <div>' + value.name + '</div>\n' +
          '        <div>上传时间：2019-06-27 07:08:09</div>\n' +
          '        <div>上传时间：2019-06-27 07:08:09</div>\n' +
          '        <div>上传时间：2019-06-27 07:08:09</div>\n' +
          '    </div>\n' +
          '</div>'
      return new BMap.InfoWindow(sContent)
    },
    infoWindowClick () {
      console.log('信息弹窗被点击了')
    },
    onSearch () {

    },
    selection (item) {
      const { pointId, userId, nickName, avatar, uptime, keypoints } = item
      this.authorSubject.pointId = pointId
      this.authorSubject.userId = userId
      this.authorSubject.nickName = nickName
      this.authorSubject.avatar = avatar
      this.authorSubject.uptime = uptime

      this.commentSubject.routeId = pointId
      this.commentSubject.userId = userId
      this.keypoints = keypoints
      // if (keypoints && keypoints.length > 0) {
      //   this.keypoints = keypoints
      //   this.show = true
      // } else {
      //   this.show = false
      // }
      this.selectComments(pointId)
      this.show = true
    },
    selectComments (id) {
      queryComment(id).then(response => {
        const { data } = response
        this.comments = data
      })
    },
    refreshComment () {
      console.log('刷新评论')
      this.selectComments(this.commentSubject.routeId)
    }
  }
}
</script>
<style scoped>
  .bm-view {
    height: 600px;
    z-index: 0;
  }
  .search {
    width: 280px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    padding: 0 5px;
    position: absolute;
    top: 20px;
    left: 60px;
  }
</style>
