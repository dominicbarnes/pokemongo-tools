<template>
  <b-nav-item-dropdown>
    <template slot="button-content">
      Rarity
      <rarity-badge v-if="value" v-bind:rarity="value" />
    </template>
    <b-dropdown-item v-on:click="update('mythic')">
      <rarity-badge rarity="mythical" />
    </b-dropdown-item>
    <b-dropdown-item v-on:click="update('legendary')">
      <rarity-badge rarity="legendary" />
    </b-dropdown-item>
    <b-dropdown-item v-on:click="update(null)">Show All</b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import RarityBadge from '../badges/rarity-badge.vue'

export default {
  props: {
    value: String
  },

  methods: {
    update(value) {
      this.$emit('input', value)
    }
  },

  components: { RarityBadge }
}
</script>
