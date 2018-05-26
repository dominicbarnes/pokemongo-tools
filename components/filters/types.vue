<template>
  <b-form-group label="Type(s)">
    <b-form-select multiple v-bind:options="options" v-bind:value="value" v-bind:size="size" v-on:change="update" />
  </b-form-group>
</template>

<script>
import TypeBadge from '../badges/type.vue'

export default {
  props: {
    value: Array
  },

  computed: {
    types() {
      return this.$store.state.metadata.types.list
    },

    size() {
      return this.types.length.toString()
    },

    options() {
      return this.types.map(type => {
        return { value: type, text: type }
      })
    }
  },

  methods: {
    update(value) {
      this.$emit('input', value)
    }
  },

  components: { TypeBadge }
}
</script>

<style>

</style>
