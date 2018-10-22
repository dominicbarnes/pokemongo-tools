<template>
  <b-progress v-bind:value="iv" v-bind:max="15" v-bind:precision="1" show-value v-bind:variant="variant" />
</template>

<script>
  export default {
    props: {
      iv: Number
    },

    computed: {
      variant() {
        const { iv } = this
        if (iv === 15) return 'primary'
        if (iv >= 13) return 'success'
        if (iv >= 8) return 'warning'
        return 'danger'
      }
    }
  }
</script>
