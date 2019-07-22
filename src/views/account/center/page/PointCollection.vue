<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="loading"
    itemLayout="vertical"
    :dataSource="collections"
  >
    <a-list-item :key="item.pointId" slot="renderItem" slot-scope="item">
      <template slot="actions">
        <icon-text type="like-o" :text="item.praise" />
        <icon-text type="star-o" :text="item.collection" />
        <icon-text type="message" :text="item.comment" />
      </template>
      <a-list-item-meta>
        <router-link slot="title" :to="'/point/details/'+item.pointId">{{ item.name }}</router-link>
        <template slot="description">
          <span>
            <a-tag>{{ item.medias }} 标注点</a-tag>
          </span>
        </template>
      </a-list-item-meta>
      <p>
        <a-icon type="environment"/>
        <span>{{ item.city }} </span>
        <span>{{ item.district }}</span>
      </p>
      <author-list-content :description="item.description" :owner="item.nickName" :avatar="item.avatar" :href="item.avatar" :updateAt="item.uptime"/>
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
