<template>
  <a-carousel arrows>
    <div v-for="(item,index) in 4" :key="index">
      <img :src="baseUrl+'abstract0'+item+'.jpg'" />
    </div>
  </a-carousel>
</template>
<script>
const baseUrl = 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/'
export default {
  data () {
    return {
      baseUrl
    }
  },
  methods: {
    getImgUrl (i) {
      return `${baseUrl}abstract0${i + 1}.jpg`
    }
  }
}
</script>
