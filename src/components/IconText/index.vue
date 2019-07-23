<template>
  <span>
    <a-icon :type="type" style="margin-right: 8px" />
    {{ text | filterText }}
  </span>
</template>

<script>
export default {
  name: 'IconText',
  props: {
    'type': {
      type: String,
      required: true
    },
    text: {
      type: [String, Number],
      default: 0
    }
  },
  filters: {
    filterText (text) {
      if (text) {
        return text
      } else {
        return 0
      }
    }
  }
}
</script>
