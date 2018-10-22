<template>
  <b-progress v-bind:value="level" v-bind:max="40" v-bind:precision="1" show-value v-bind:variant="variant" />
</template>

<script>
  export default {
    props: {
      level: Number
    },

    computed: {
      variant() {
        const { level } = this
        if (level >= 40) return 'primary'
        if (level >= 35) return 'success'
        return 'secondary'
      }
    }
  }
</script>
