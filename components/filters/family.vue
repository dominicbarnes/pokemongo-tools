<template>
  <b-form-group label="Evolution Family">
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" />
  </b-form-group>
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
