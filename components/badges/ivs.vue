<template>
  <b-badge v-bind:variant="variant" v-bind:title="title">
    {{ percentage | number('0%') }}
    <i v-if="uncertain">*</i>
  </b-badge>
</template>

<script>
  export default {
    props: {
      percentage: Number,
      uncertain: Boolean
    },

    computed: {
      title() {
        return this.uncertain ? 'Uncertain IVs' : null
      },

      variant() {
        const { percentage, uncertain } = this
        if (uncertain) return 'dark'
        if (percentage === 1) return 'primary'
        if (percentage >= 0.822) return 'success'
        if (percentage >= 0.667) return 'warning'
        if (percentage >= 0.511) return 'warning'
        return 'danger'
      }
    }
  }
</script>
