<template>
  <b-form-group label="Minimum IVs">
    <b-form-input id="catalog-filters-ivs" type="range" min="0" max="100" v-bind:value="value" v-on:input="update" />
    <b-tooltip target="catalog-filters-ivs" placement="right">
      {{ value | number('0,0') }}
    </b-tooltip>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      }
    },

    methods: {
      update(value) {
        this.$emit('input', parseInt(value, 10))
      }
    }
  }
</script>
