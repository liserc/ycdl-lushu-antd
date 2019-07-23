<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="loading"
    itemLayout="vertical"
    :dataSource="collections"
  >
    <a-list-item :key="item.routId" slot="renderItem" slot-scope="item">
      <template slot="actions">
        <icon-text type="like-o" :text="item.praise" />
        <icon-text type="star-o" :text="item.collection" />
        <icon-text type="message" :text="item.comment" />
      </template>
      <a-list-item-meta>
        <router-link slot="title" :to="'/route/details/'+item.routId">{{ item.name }}</router-link>
        <template slot="description">
          <span>
            <a-tag>{{ item.record | filterRecord }}</a-tag>
            <a-tag>{{ item.mileage | filterMileage }} km</a-tag>
            <a-tag>{{ item.medias }} 标注点</a-tag>
          </span>
        </template>
      </a-list-item-meta>
      <p v-if="item.province">
        <a-icon type="environment"/>
        <span>{{ item.province }} </span>
        <span>{{ item.city }}</span>
      </p>
      <author-list-content :description="item.description" :owner="item.nickName" :avatar="item.avatar" :href="item.avatar" :updateAt="item.uptime"/>
      <img slot="extra" width="200" alt="logo" :src="item.snapshot"/>
    </a-list-item>
  </a-list>
</template>

<script>
import AuthorListContent from '@/components/AuthorListContent'
import IconText from '@/components/IconText'

export default {
  name: 'RouteCollection',
  components: {
    IconText,
    AuthorListContent
  },
  props: {
    collections: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  filters: {
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
  data () {
    return {
      loading: true
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
