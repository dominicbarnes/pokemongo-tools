<template>
  <b-form-group label="Minimum Level">
    <b-form-input id="catalog-filters-level" type="range" min="1" step="0.5" max="40" v-bind:value="value" v-on:input="update" />
    <b-tooltip target="catalog-filters-level" placement="right">
      {{ value | number('0.0') }}
    </b-tooltip>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      value: Number
    },

    methods: {
      update(value) {
        this.$emit('input', parseFloat(value))
      }
    }
  }
</script>
