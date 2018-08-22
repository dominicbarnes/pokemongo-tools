<template>
  <b-form-group label="IVs">
    <vue-slider type="range" v-bind:min="0" v-bind:max="100" tooltip="hover" v-bind:value="value" v-on:input="update" />
  </b-form-group>
</template>

<script>
  import VueSlider from 'vue-slider-component'

  export default {
    props: {
      value: Array
    },

    methods: {
      update(value) {
        this.$emit('input', value)
      }
    },

    components: { VueSlider }
  }
</script>
