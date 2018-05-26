<template>
  <b-form-group label="Minimum IVs">
    <b-form-input type="number" min="0" max="100" v-bind:value="value" v-on:input="update" />
  </b-form-group>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: Number
  },

  methods: {
    update(value) {
      this.$emit('input', parseInt(value, 10))
    }
  }
}
</script>
