<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'BmInfoWindow',
  props: {
    map: {
      type: Object,
      default: null
    },
    position: {
      type: Object,
      default: null
    },
    autoPan: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    position (val) {
      this.openInfoWindow()
    }
  },
  data () {
    return {
    }
  },
  methods: {
    openInfoWindow () {
      const { map, position, autoPan, closeOnClick } = this
      const $content = this.$el
      const overlay = new BMap.InfoWindow($content, {
        enableAutoPan: autoPan,
        enableCloseOnClick: closeOnClick
      })
      // overlay.redraw()
      map.openInfoWindow(overlay, position)
      // this.marker.openInfoWindow($content, overlay)
    },
    closeInfoWindow () {
    }
  }
}

</script>
