<template>
  <b-badge variant="secondary">{{ text | uppercase }}</b-badge>
</template>

<script>
  export default {
    props: {
      generation: {
        type: Number,
        required: true
      }
    },

    computed: {
      text() {
        return `Gen ${this.generation}`
      }
    },

    filters: {
      uppercase(value) {
        return value.toUpperCase()
      }
    }
  }
</script>
