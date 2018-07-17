<template>
  <b-badge variant="primary" v-bind:title="title">{{ text }}</b-badge>
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

      title() {
        return 'Level ' + this.level.toFixed(1)
      },

      text() {
        return this.max ? 'MAX' : this.level.toString()
      }
    }
  }
</script>
