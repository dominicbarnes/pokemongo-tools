<template>
  <b-form-group label="Rarity">
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" />
  </b-form-group>
</template>

<script>
export default {
  props: {
    value: String
  },

  computed: {
    options() {
      return [
        { value: null, text: '&mdash;' },
        { value: 'common', text: 'Common' },
        { value: 'legendary', text: 'Legendary' },
        { value: 'mythic', text: 'Mythical' }
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
