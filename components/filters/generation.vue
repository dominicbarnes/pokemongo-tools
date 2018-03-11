<template>
  <b-form inline>
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" size="sm" />
  </b-form>
</template>

<script>
import { mapGetters } from 'vuex'

import RarityBadge from '../badges/type.vue'

export default {
  props: {
    value: Number
  },

  computed: {
    ...mapGetters({ generations: 'pokemonGenerations' }),

    options() {
      const list = this.generations.map(gen => {
        return { value: gen, text: `Generation ${gen}` }
      })

      list.unshift(
        { value: null, text: 'Generation' },
        { disabled: true, text: '---' }
      )

      return list
    }
  },

  methods: {
    update(value) {
      this.$emit('input', value)
    }
  },

  components: { RarityBadge }
}
</script>
