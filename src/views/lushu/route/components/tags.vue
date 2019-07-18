<template>
  <div>
    <template v-for="item in tags">
      <a-checkable-tag
        :key="item.tag"
        :checked="item.checked"
        @change="(checked) => handleChange(item.tag, checked)"
      >
        {{ item.tag }}
      </a-checkable-tag>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checked1: false,
      checked2: false,
      checked3: false,
      tags: [
        {
          tag: '步行',
          checked: false
        },
        {
          tag: '驾车',
          checked: false
        }
      ],
      // tags: ['Movies', 'Books', 'Music', 'Sports'],
      selectedTags: []
    }
  },
  methods: {
    handleChange (tag, checked) {
      console.log(this.tags.tag[tag], checked)
      // this.tags[tag].checked = checked
      // const { selectedTags } = this
      // const nextSelectedTags = checked
      //   ? [...selectedTags, tag]
      //   // : selectedTags.filter(t => t !== tag)
      //   : selectedTags.filter(t => t === tag)
      // console.log('You are interested in: ', nextSelectedTags)
      // this.selectedTags = nextSelectedTags
    }
  }
}
</script>
