<template>
  <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" />
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
        const value = family._id
        const text = `${family.name} Family`
        return { value, text }
      })

      list.unshift({ value: null, text: '&mdash;' })

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
