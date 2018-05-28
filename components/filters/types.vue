<template>
  <b-form-group label="Type(s)">
    <b-form-checkbox-group stacked v-on:change="update">
      <b-form-checkbox v-for="type in types" v-bind:value="type" v-bind:checked="isChecked(type)">
        <type-badge v-bind:type="type" />
      </b-form-checkbox>
    </b-form-checkbox-group>
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
    checked() {
      const s = new Set()
      for (const t of this.value) {
        s.add(t)
      }
      return s
    }
  },

  methods: {
    isChecked(type) {
      return this.checked.has(type)
    },
    update(value) {
      this.$emit('input', value)
    }
  },

  components: { TypeBadge }
}
</script>

<style>

</style>
