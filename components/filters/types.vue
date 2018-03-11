<template>
  <b-nav-item-dropdown>
    <template slot="button-content">
      Type(s)
      <type-badge v-for="type in value" v-bind:type="type" />
    </template>
    <b-dropdown-item v-for="type in types" v-on:click="toggleType(type)" v-bind:active="isActiveType(type)" v-bind:disabled="isDisabledType(type)">
      <type-badge v-bind:type="type" />
    </b-dropdown-item>
  </b-nav-item-dropdown>
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
    }
  },

  methods: {
    toggleType(type) {
      const value = this.value.slice() // copy original

      const index = value.indexOf(type)
      if (index > -1) {
        value.splice(index, 1)
      } else {
        value.push(type)
      }

      this.$emit('input', value)
    },

    isActiveType(type) {
      return this.value.indexOf(type) > -1
    },

    isDisabledType(type) {
      return !this.isActiveType(type) && this.value.length >= 2
    }
  },

  components: { TypeBadge }
}
</script>
