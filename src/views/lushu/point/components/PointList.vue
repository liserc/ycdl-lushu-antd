<template>
  <a-card :bordered="false" :body-style="{padding:'2px'}">
    <div class="list-scroll" :style="{height:listHeight}">
      <a-list
        itemLayout="vertical"
        size="small"
        :loading="loading"
        :dataSource="contents">
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index" @click="listItemClick(item)">
          <a-list-item-meta>
            <a slot="title">
              <h3>{{ item.name }}</h3>
            </a>
            <template slot="description">
              <span>
                <a-tag>距离我：{{ item.geodistance }}km</a-tag>
              </span>
            </template>
          </a-list-item-meta>
          <div style="padding: 2px; margin-top: 5px">
            <a-icon type="environment"/>
            <span>{{ item.city }} {{ item.district }}</span>
          </div>
          <template slot="actions" v-for="{type, text} in actions">
            <icon-text :type="type" :text="text" :key="text"/>
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
  methods: {
    listItemClick (item) {
      console.log('选中行：', item)
      this.$emit('selection', item)
    }
  }
}
</script>
<style>
  .list-scroll {
    overflow-y: scroll;
  }
</style>
