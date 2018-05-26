<template>
  <b-form-group label="Evolves?">
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" />
  </b-form-group>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: Boolean
  },

  computed: {
    options() {
      return [
        { value: null, text: '&mdash;' },
        { value: true, text: 'Evolves' },
        { value: false, text: 'Does Not Evolve' }
      ]
    }
  },

  methods: {
    update(value) {
      this.$emit('input', value)
    }
  }
}
</script>
