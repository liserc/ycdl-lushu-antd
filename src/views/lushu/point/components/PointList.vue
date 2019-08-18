<template>
  <a-card :bordered="false" :body-style="{padding:'2px'}">
    <div class="list-scroll" :style="{height:listHeight}">
      <a-list
        itemLayout="vertical"
        size="small"
        :loading="loading"
        :dataSource="contents">
        <a-list-item slot="renderItem" slot-scope="item, index" :id="index" :key="index" @click="listItemClick(item,index)">
          <a-list-item-meta>
            <a slot="title">
              <h3>{{ item.name }}</h3>
            </a>
            <template slot="description">
              <span>
                <a-tag color="green" v-if="item.geodistance">距离我：{{ item.geodistance }}km</a-tag>
                <a-tag color="blue">{{ item.medias }} 标注点</a-tag>
              </span>
            </template>
          </a-list-item-meta>
          <div style="padding: 2px; margin-top: 5px">
            <a-icon type="environment"/>
            <span>{{ item.city }} {{ item.district }}</span>
          </div>
          <template slot="actions">
            <icon-text type="like-o" :text="item.praise" />
            <icon-text type="star-o" :text="item.collection" />
            <icon-text type="message" :text="item.comment" />
          </template>
        </a-list-item>
      </a-list>
    </div>
  </a-card>
</template>
<script>
import IconText from '@/components/IconText'
export default {
  name: 'PointList',
  components: {
    IconText
  },
  props: {
    listHeight: {
      type: String,
      default: '400'
    },
    loading: {
      type: Boolean,
      default: true
    },
    contents: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentId: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' }
      ]
    }
  },
  watch: {
    currentId (val) {
      this.scrollToListItem(val)
    }
  },
  methods: {
    listItemClick (item, index) {
      this.$emit('selection', item, index)
    },
    scrollToListItem (id) {
      document.getElementById(id).scrollIntoView()
    }
  }
}
</script>
<style>
  .list-scroll {
    overflow-y: scroll;
  }
</style>
