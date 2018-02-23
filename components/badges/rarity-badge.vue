<template>
  <b-badge variant="info">{{ rarity | uppercase }}</b-badge>
</template>

<script>
  export default {
    props: {
      rarity: {
        type: String,
        required: true
      }
    },

    filters: {
      uppercase(value) {
        return value.toUpperCase()
      }
    }
  }
</script>
