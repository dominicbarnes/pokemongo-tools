<template>
  <b-badge v-bind:variant="variant" v-bind:title="title">{{ text }}</b-badge>
</template>

<script>
  export default {
    props: {
      level: {
        type: Number,
        required: true
      }
    },

    computed: {
      max() {
        return this.level === 40
      },

      variant() {
        return this.max ? 'success' : 'info'
      },

      title() {
        return 'Level ' + this.level.toFixed(1)
      },

      text() {
        return this.max ? 'MAX' : this.level.toString()
      }
    }
  }
</script>
