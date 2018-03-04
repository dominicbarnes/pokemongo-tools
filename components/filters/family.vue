<template>
  <b-form inline>
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" size="sm" />
  </b-form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: String
  },

  computed: {
    families() {
      return this.$store.state.metadata.families
    },

    options() {
      const list = this.families.map(family => {
        return { value: family._id, text: `${family.name} Family` }
      })

      list.unshift(
        { value: null, text: 'Evolution Family' },
        { disabled: true, text: '---' }
      )

      return list
    }
  },

  methods: {
    update(value) {
      this.$emit('input', value)
    }
  }
}
</script>
