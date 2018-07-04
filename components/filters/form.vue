<template>
  <b-form-group label="Form">
    <b-select v-bind:value="value" v-on:change="update">
      <option v-bind:value="null">&mdash;</option>
      <option value="normal">Normal</option>
      <option value="alola">Alolan</option>
    </b-select>
  </b-form-group>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      value: String
    },

    methods: {
      update(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
