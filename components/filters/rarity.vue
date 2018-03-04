<template>
  <b-form inline>
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" size="sm" />
  </b-form>
</template>

<script>
export default {
  props: {
    value: String
  },

  computed: {
    options() {
      return [
        { value: null, text: 'Rarity' },
        { disabled: true, text: '---' },
        { value: 'common', text: 'Common' },
        { value: 'mythic', text: 'Mythical' },
        { value: 'legendary', text: 'Legendary' }
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
