<template>
  <div>
    <span slot="title">{{ title }}</span>
    <div>
      <a-radio-group :name="name" buttonStyle="solid" size="small" @change="radioChange">
        <a-radio-button v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SearchFilterRadio',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    radioChange (event) {
      console.log('单选变化：', event)
    }
  }
}
</script>
