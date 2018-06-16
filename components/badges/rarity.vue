<template>
  <b-badge variant="info">{{ text }}</b-badge>
</template>

<script>
  export default {
    props: {
      rarity: String
    },

    computed: {
      text() {
        return (this.rarity || 'common').toUpperCase()
      }
    }
  }
</script>
