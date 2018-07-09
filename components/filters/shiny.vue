<template>
  <b-form-group label="Shiny?">
    <b-select v-bind:options="options" v-bind:value="value" v-on:change="update" />
  </b-form-group>
</template>

<script>
  export default {
    props: {
      value: Boolean
    },

    computed: {
      options() {
        return [
          { value: null, text: '&mdash;' },
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
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
