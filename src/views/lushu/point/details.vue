<template>
  <div class="page-header-index-wide">
    <a-row>
      <a-col>
        <a-card :bordered="false" :body-style="{padding:'2px',height:'400px'}" style="border: 1px solid red">
          <div id="bMap">
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pathId: '',
      data: []
    }
  },
  created () {
    this.pathId = this.$route.query
    console.log('路由传值：' + this.pathId)
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
</style>
