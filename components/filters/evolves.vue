<template>
  <b-form inline>
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" size="sm" />
  </b-form>
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
        { value: null, text: 'Evolves?' },
        { disabled: true, text: '---' },
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
