<template>
  <b-nav-item-dropdown v-bind:text="text">
    <b-dropdown-item v-for="gen in generations" v-on:click="update(gen)" v-bind:active="value === gen">{{ gen }}</b-dropdown-item>
    <b-dropdown-item v-on:click="update(null)">Show All</b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

import RarityBadge from '../badges/type-badge.vue'

export default {
  props: {
    value: Number
  },

  computed: {
    ...mapGetters({ generations: 'pokemonGenerations' }),

    text() {
      return this.value
        ? `Generation: ${this.value}`
        : 'Generation'
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
