<template>
  <div class="page-header-index-wide">
    <a-row :gutter="15">
      <a-col :span="16">
        <a-card :bordered="false" :body-style="{padding:'2px'}">
          <div :id="mapId" class="bm-view">
            <bm-info-window v-show="windowShow" :map="map" :title="bmInfoWindow.title" :position="bmInfoWindow.position">
              <a-card
                hoverable
                style="width: 350px"
                :bordered="true"
              >
                <image-carousel slot="cover"/>
                <a-card-meta>
                  <template slot="title">
                    <span>{{ bmInfoWindow.name }}</span>
                  </template>
                  <a-avatar slot="avatar" :src="bmInfoWindow.avatar" />
                  <template slot="description">
                    <span>{{ bmInfoWindow.time | formatUptime }} </span>
                  </template>
                </a-card-meta>
                <div style="margin-top: 5px">
                  <a-row>
                    <a-col>
                      <div>
                        <a-icon type="environment"/>
                        <span>{{ bmInfoWindow.province }}{{ bmInfoWindow.city }}{{ bmInfoWindow.district }}{{ bmInfoWindow.street }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
                <template class="ant-card-actions" slot="actions">
                  <a-tooltip title="点赞">
                    <a-icon type="like-o" />
                  </a-tooltip>
                  <a-tooltip title="收藏">
                    <a-icon type="star-o" />
                  </a-tooltip>
                  <router-link slot="title" :to="'/point/details/'+bmInfoWindow.pointId">
                    <a-tooltip title="详情">
                      <a-icon type="ellipsis"></a-icon>
                    </a-tooltip>
                  </router-link>
                </template>
              </a-card>
            </bm-info-window>
          </div>
          <div class="control">
            <a-row :gutter="8">
              <a-col :span="20">
                <a-input-search
                  v-model="query.keyword"
                  placeholder="搜索地点"
                  @search="onSearch"></a-input-search>
              </a-col>
              <a-col :span="4">
                <a-button @click="onMapSelection">{{ mapSelection }}</a-button>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <point-list list-height="600px" :currentId="currentId" :loading="loading" :contents="pointData" @selection="selection"/>
      </a-col>
    </a-row>
    <!--<br>
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
            <point-gallery :keypoints="keypoints"/>
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
    </a-row>-->
  </div>
</template>
<script>
import Vue from 'vue'
import { search } from '@/api/lushu/point'
import { queryComment } from '@/api/lushu/common'
import { loadBMap } from '@/assets/js/async-load-bmap.js'
import { wgs84_to_bd09, gcj02towgs84 } from '@/assets/js/gps-transform.js'
import moment from 'moment'
import { Carousel, CarouselItem, Collapse, CollapseItem, Card, Button } from 'element-ui'
import ACol from 'ant-design-vue/es/grid/Col'
import { Uploader, SocialComment, BmInfoWindow } from '@/components/Lushu'
import { PointGallery, PointList, ImageCarousel } from './components'
import ARow from 'ant-design-vue/es/grid/Row'
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Card)
Vue.use(Button)
export default {
  components: { BmInfoWindow, ARow, ACol, Uploader, PointList, PointGallery, SocialComment, ImageCarousel },
  filters: {
    formatUptime (date) {
      if (date) {
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  data () {
    return {
      mapId: 'BMap-Lushu',
      map: null,
      zoom: 11,
      currentId: null,
      points: [],
      markers: [],
      icons: {
        0: require('@/assets/images/marker_single_point_40.png'),
        1: require('@/assets/images/marker_user_40.png')
      },
      fixedPosition: null,
      query: {
        keyword: '贵阳',
        sLng: undefined,
        sLat: undefined,
        eLng: undefined,
        eLat: undefined,
        range: 10
      },
      loading: true,
      pointData: [],
      point_photo: {
        3: require('@/assets/images/music.png'),
        4: require('@/assets/images/video.png')
        // 'http://duanly.oss-cn-shenzhen.aliyuncs.com/bmap/ic_route_photo.png'
      },
      images: [],
      windowShow: false,
      authorSubject: {
        routeId: '',
        routeType: 0,
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
      medias: '',
      keypoints: [],
      comments: [],
      markerClusterer: null,
      mapSelection: '地图选点',
      mapSelectionOptions: ['地图选点', '取消选点'],
      mapSelecting: false,
      mapSelectionDragendIcon: require('@/assets/images/ic_map_select_point_48.png'),
      mapSelectionDraggingIcon: require('@/assets/images/ic_map_select_point_48x64.png'),
      mapSelectionCenterMarker: null,
      bmInfoWindow: {
        position: null
      }
    }
  },
  created () {
    this.initMap()
  },
  mounted () {
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
          this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放

          const point = new BMap.Point(116.404, 39.915)
          this.map.centerAndZoom(point, this.zoom)

          /* const that = this
          // 浏览器定位获取当前经纬度坐标
           const geolocation = new BMap.Geolocation()
          geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
              that.fixedPosition = r.point
              that.map.centerAndZoom(r.point, that.zoom)
              console.log('浏览器定位成功', r.point)
              that.positionSuccess()
            } else {
              console.log('浏览器定位失败')
            }
          }) */

          // 加载数据
          this.loadPoints()
        })
        .catch(error => {
          console.log('地图加载失败：', error)
        })
    },
    positionSuccess () {
      const { lng, lat } = this.fixedPosition
      const location = gcj02towgs84(lng, lat)
      this.query.sLng = location[0]
      this.query.sLat = location[1]
      const point = new BMap.Point(lng, lat)
      const icon = new BMap.Icon(this.icons[1],
        new BMap.Size(80, 40),
        {
          anchor: new BMap.Size(40, 40),
          imageOffset: new BMap.Size(20, 0)
        })
      // 创建标注对象并添加到地图
      const marker = new BMap.Marker(point, { icon: icon })
      this.map.addOverlay(marker)
    },
    loadPoints () {
      search(this.query).then(response => {
        const { data } = response
        this.pointData = data
        this.addMarkerClusterer(data)
      }).finally(() => {
        this.loading = false
      })
    },
    addMarkerClusterer (data) {
      const that = this
      that.removeMarkers()
      data.forEach((value, index) => {
        const location = wgs84_to_bd09(value.lng, value.lat)
        const point = new BMap.Point(location[0], location[1])
        const marker = that.addMarkerToMap(point, value, index)
        that.points.push(point)
        that.markers.push(marker)
      })
      this.map.setViewport(this.points)
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markers })
    },
    removeMarkers () {
      // 重新赋值之前先清空原来的数据
      this.points = []
      this.markers = []
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers(this.markers)
      }
    },
    addMarkerToMap (point, value, index) {
      const icon = new BMap.Icon(this.icons[0],
        new BMap.Size(80, 40),
        {
          anchor: new BMap.Size(40, 40),
          imageOffset: new BMap.Size(20, 0)
        })
      // 创建标注对象并添加到地图
      const marker = new BMap.Marker(point, { icon: icon })
      this.map.addOverlay(marker)
      const that = this
      marker.addEventListener('click', function () {
        that.bmInfoWindow.position = this.point
        that.openInfoWindow(this.point, index, value)
      })
      return marker
    },
    openInfoWindow (position, index, value) {
      this.windowShow = true
      this.currentId = index
      this.bmInfoWindow.position = position
      for (const item in value) {
        this.bmInfoWindow[item] = value[item]
      }
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
      console.log('点击查询：', this.query)
      this.loadPoints()
    },
    selection (item, index) {
      this.markBeating(index)
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
    markBeating (index) {
      this.openInfoWindow(this.markers[index].point, index, this.pointData[index])
      // this.map.centerAndZoom(position, this.map.getZoom())
    },
    onMapSelection () {
      this.mapSelecting = !this.mapSelecting
      if (this.mapSelecting) {
        this.mapSelection = this.mapSelectionOptions[1]
        this.mapSelectionDragend()

        /**
         * 地图的事件不能使用匿名方法，否则不能移除监听事件
         */
        this.map.addEventListener('dragend', this.mapSelectionDragend)
        this.map.addEventListener('dragging', this.mapSelectionDragging)
      } else {
        this.mapSelection = this.mapSelectionOptions[0]
        /**
         * 移除地图的监听事件
         */
        this.map.removeEventListener('dragend', this.mapSelectionDragend)
        this.map.removeEventListener('dragging', this.mapSelectionDragging)
        this.mapSelectionCenterMarker.remove()
        this.query.eLng = null
        this.query.eLat = null
      }
    },
    addMapSelectionToMap (point, icon) {
      const markerIcon = new BMap.Icon(icon, new BMap.Size(50, 60), {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(25, 30),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0)
      })
      // 创建标注对象并添加到地图
      const marker = new BMap.Marker(point, { icon: markerIcon })
      this.map.addOverlay(marker)
      return marker
    },
    mapSelectionDragend () {
      if (this.mapSelectionCenterMarker != null) {
        this.mapSelectionCenterMarker.remove()
      }
      this.mapSelectionCenterMarker = this.addMapSelectionToMap(new BMap.Point(this.map.getCenter().lng, this.map.getCenter().lat), this.mapSelectionDragendIcon)
      this.mapSelectionQuery()
    },
    mapSelectionDragging () {
      if (this.mapSelectionCenterMarker != null) {
        this.mapSelectionCenterMarker.remove()
      }
      this.mapSelectionCenterMarker = this.addMapSelectionToMap(new BMap.Point(this.map.getCenter().lng, this.map.getCenter().lat), this.mapSelectionDraggingIcon)
    },
    mapSelectionQuery () {
      this.query.eLng = this.map.getCenter().lng
      this.query.eLat = this.map.getCenter().lat
      this.loadPoints()
    }
  }
}
</script>
<style scoped>
  .bm-view {
    height: 600px;
    z-index: 0;
  }
  .control{
    position: absolute;
    top: 20px;
    left: 60px;
  }
</style>
